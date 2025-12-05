"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { generateSlug, validateImageFile } from "@/lib/utils";
import type { PostWithImages, PostImage } from "@/lib/types";
import ImageUploader from "@/components/ImageUploader";

interface PostFormProps {
	post?: PostWithImages;
}

export default function PostForm({ post }: PostFormProps) {
	const router = useRouter();
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const isEditing = !!post;
	const isDraft = post?.status === "draft";
	const isPublished = post?.status === "published";

	const [title, setTitle] = useState(post?.title || "");
	const [description, setDescription] = useState(post?.description || "");
	const [slug, setSlug] = useState(post?.slug || "");
	const [pieceCount, setPieceCount] = useState<string>(
		post?.piece_count?.toString() || ""
	);
	const [dateStart, setDateStart] = useState(
		post?.date_start ? post.date_start.split("T")[0] : ""
	);
	const [dateCompleted, setDateCompleted] = useState(
		post?.date_completed ? post.date_completed.split("T")[0] : ""
	);
	const [existingImages, setExistingImages] = useState<PostImage[]>(
		post?.images || []
	);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [savingAs, setSavingAs] = useState<"draft" | "published" | null>(
		null
	);

	// Check if any changes have been made (for existing builds)
	const hasChanges = useMemo(() => {
		if (!isEditing) return true; // New builds always allow saving

		const titleChanged = title !== (post?.title || "");
		const descriptionChanged = description !== (post?.description || "");
		const slugChanged = slug !== (post?.slug || "");
		const pieceCountChanged =
			pieceCount !== (post?.piece_count?.toString() || "");
		const dateStartChanged =
			dateStart !==
			(post?.date_start ? post.date_start.split("T")[0] : "");
		const dateCompletedChanged =
			dateCompleted !==
			(post?.date_completed ? post.date_completed.split("T")[0] : "");
		const imagesChanged = newImages.length > 0 || imagesToDelete.length > 0;

		return (
			titleChanged ||
			descriptionChanged ||
			slugChanged ||
			pieceCountChanged ||
			dateStartChanged ||
			dateCompletedChanged ||
			imagesChanged
		);
	}, [
		isEditing,
		title,
		description,
		slug,
		pieceCount,
		dateStart,
		dateCompleted,
		newImages.length,
		imagesToDelete.length,
		post,
	]);

	// Check if form is valid for saving (new posts need at least a title)
	const canSave = useMemo(() => {
		const hasValidTitle = title.trim().length >= 3;
		return hasValidTitle;
	}, [title]);

	const handleTitleChange = (value: string) => {
		setTitle(value);
		// Auto-update slug for new posts and drafts
		if (!isEditing || isDraft) {
			setSlug(generateSlug(value));
		}
	};

	const handleSave = async (status: "draft" | "published") => {
		if (!title.trim()) {
			toast.error(t("titleRequired"));
			return;
		}

		if (title.length < 3 || title.length > 100) {
			toast.error(t("titleLength"));
			return;
		}

		if (
			pieceCount &&
			(isNaN(Number(pieceCount)) || Number(pieceCount) < 0)
		) {
			toast.error(t("pieceCountPositive"));
			return;
		}

		if (dateStart && dateCompleted && dateStart > dateCompleted) {
			toast.error(t("dateValidation"));
			return;
		}

		setSaving(true);
		setSavingAs(status);

		const supabase = createClient();

		try {
			const postData = {
				title: title.trim(),
				description: description.trim() || null,
				slug: slug || generateSlug(title),
				piece_count: pieceCount ? Number(pieceCount) : null,
				status,
				date_start: dateStart || null,
				date_completed: dateCompleted || null,
				updated_at: new Date().toISOString(),
				...(status === "published" && !post?.published_at
					? { published_at: new Date().toISOString() }
					: {}),
			};

			let postId = post?.id;

			if (isEditing && postId) {
				const { error } = await supabase
					.from("posts")
					.update(postData)
					.eq("id", postId);

				if (error) throw error;
			} else {
				const { data, error } = await supabase
					.from("posts")
					.insert(postData)
					.select()
					.single();

				if (error) throw error;
				postId = data.id;
			}

			// Delete removed images
			if (imagesToDelete.length > 0) {
				for (const imageId of imagesToDelete) {
					const image = post?.images?.find(
						(img) => img.id === imageId
					);
					if (image) {
						// Delete from storage
						const path = image.image_url
							.split("/")
							.slice(-2)
							.join("/");
						await supabase.storage
							.from("build-images")
							.remove([path]);
					}
					// Delete from database
					await supabase
						.from("post_images")
						.delete()
						.eq("id", imageId);
				}
			}

			// Renumber existing images to have consecutive display_order starting from 0
			if (existingImages.length > 0) {
				for (let i = 0; i < existingImages.length; i++) {
					const image = existingImages[i];
					if (image.display_order !== i) {
						await supabase
							.from("post_images")
							.update({ display_order: i })
							.eq("id", image.id);
					}
				}
			}

			// Upload new images
			if (newImages.length > 0 && postId) {
				const startOrder = existingImages.length;

				let successCount = 0;
				let failCount = 0;

				for (let i = 0; i < newImages.length; i++) {
					const file = newImages[i];
					// Sanitize filename: remove special chars, replace spaces with dashes
					const extension = file.name.split(".").pop() || "jpg";
					const sanitizedName = `${Date.now()}-${i}.${extension}`;
					const filePath = `${postId}/${sanitizedName}`;

					const { error: uploadError } = await supabase.storage
						.from("build-images")
						.upload(filePath, file);

					if (uploadError) {
						console.error("Upload error:", uploadError);
						failCount++;
						continue;
					}

					const {
						data: { publicUrl },
					} = supabase.storage
						.from("build-images")
						.getPublicUrl(filePath);

					const { error: insertError } = await supabase
						.from("post_images")
						.insert({
							post_id: postId,
							image_url: publicUrl,
							display_order: startOrder + i,
							alt_text: title,
						});

					if (insertError) {
						console.error("Database insert error:", insertError);
						failCount++;
						continue;
					}

					successCount++;
				}

				// Show appropriate message based on upload results
				if (failCount > 0 && successCount > 0) {
					toast.error(
						`${failCount} ${t("uploadFailed")}. ${successCount} ${t(
							"uploadSuccess"
						)}.`
					);
				} else if (failCount > 0 && successCount === 0) {
					toast.error(`${t("allUploadsFailed")}`);
				}
			}

			toast.success(
				isEditing
					? t("postUpdated")
					: status === "published"
					? t("postPublished")
					: t("draftSaved")
			);

			router.push("/admin/posts");
			router.refresh();
		} catch (error: unknown) {
			console.error("Save error:", error);
			const errorMessage =
				error instanceof Error ? error.message : t("saveFailed");
			toast.error(errorMessage);
		} finally {
			setSaving(false);
			setSavingAs(null);
		}
	};

	const handleRemoveExistingImage = (imageId: string) => {
		setImagesToDelete([...imagesToDelete, imageId]);
		setExistingImages(existingImages.filter((img) => img.id !== imageId));
	};

	const handleNewImages = (files: File[]) => {
		// existingImages is already filtered (removed images are excluded from state)
		const totalImages =
			existingImages.length + newImages.length + files.length;

		if (totalImages > 4) {
			toast.error(t("maxImagesError"));
			return;
		}

		for (const file of files) {
			const validation = validateImageFile(file);
			if (!validation.valid) {
				toast.error(validation.error!);
				return;
			}
		}

		setNewImages([...newImages, ...files]);
	};

	const handleRemoveNewImage = (index: number) => {
		setNewImages(newImages.filter((_, i) => i !== index));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
			}}
			className="space-y-8"
		>
			{/* Title */}
			<div className="bg-white rounded-card shadow-card p-6">
				<label htmlFor="title" className="label">
					{t("title")} *
				</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => handleTitleChange(e.target.value)}
					className="input-field"
					placeholder={t("titlePlaceholder")}
					minLength={3}
					maxLength={100}
					required
				/>

				<div className="mt-4">
					<label htmlFor="slug" className="label">
						{t("urlSlug")}
					</label>
					<div className="flex items-center gap-2">
						<span className="text-gray-500">/builds/</span>
						<input
							id="slug"
							type="text"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							className="input-field flex-grow"
							placeholder="my-amazing-lego-build"
						/>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="bg-white rounded-card shadow-card p-6">
				<label htmlFor="description" className="label">
					{t("storyDescription")}
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="input-field min-h-[200px]"
					placeholder={t("storyPlaceholder")}
				/>
			</div>

			{/* Details */}
			<div className="bg-white rounded-card shadow-card p-6">
				<h3 className="font-heading font-bold text-lego-dark mb-4">
					{t("buildDetails")}
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="pieceCount" className="label">
							{t("pieceCount")}
						</label>
						<input
							id="pieceCount"
							type="number"
							value={pieceCount}
							onChange={(e) => setPieceCount(e.target.value)}
							className="input-field"
							placeholder="500"
							min="0"
						/>
					</div>
					<div>
						<label htmlFor="dateStart" className="label">
							{t("startDate")}
						</label>
						<input
							id="dateStart"
							type="date"
							value={dateStart}
							onChange={(e) => setDateStart(e.target.value)}
							className="input-field"
						/>
					</div>
					<div>
						<label htmlFor="dateCompleted" className="label">
							{t("completionDate")}
						</label>
						<input
							id="dateCompleted"
							type="date"
							value={dateCompleted}
							onChange={(e) => setDateCompleted(e.target.value)}
							className="input-field"
						/>
					</div>
				</div>
			</div>

			{/* Images */}
			<div className="bg-white rounded-card shadow-card p-6">
				<h3 className="font-heading font-bold text-lego-dark mb-4">
					{t("imagesMax")}
				</h3>

				<ImageUploader
					existingImages={existingImages}
					newImages={newImages}
					onAddImages={handleNewImages}
					onRemoveExisting={handleRemoveExistingImage}
					onRemoveNew={handleRemoveNewImage}
					maxImages={4}
				/>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
				>
					{tCommon("cancel")}
				</button>
				{/* Show Save Draft for new posts and existing drafts */}
				{(!isEditing || isDraft) && (
					<button
						type="button"
						onClick={() => handleSave("draft")}
						disabled={saving || !canSave}
						className={`btn-outline disabled:opacity-50 ${
							!canSave ? "cursor-not-allowed" : ""
						}`}
					>
						{saving && savingAs === "draft"
							? t("saving")
							: t("saveDraft")}
					</button>
				)}
				<button
					type="button"
					onClick={() => handleSave("published")}
					disabled={
						saving || (isPublished && !hasChanges) || !canSave
					}
					className={`btn-primary disabled:opacity-50 ${
						(isPublished && !hasChanges) || !canSave
							? "cursor-not-allowed"
							: ""
					}`}
				>
					{saving && savingAs === "published"
						? isPublished
							? t("saving")
							: t("publishing")
						: isPublished
						? t("confirmChanges")
						: t("publish")}
				</button>
			</div>
		</form>
	);
}
