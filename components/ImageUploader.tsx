"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import type { PostImage } from "@/lib/types";

// Cover button component - shows on all images
interface CoverButtonProps {
	isCover: boolean;
	onClick: () => void;
	label: string;
}

const CoverButton = ({ isCover, onClick, label }: CoverButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={isCover}
		className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all
			${
				isCover
					? "bg-lego-red text-white cursor-default"
					: "bg-gray-500/70 text-white/80 hover:bg-lego-red hover:text-white cursor-pointer"
			}`}
	>
		<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
			<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
			<path
				fillRule="evenodd"
				d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
				clipRule="evenodd"
			/>
		</svg>
		{label}
	</button>
);

// Shared remove button component
const RemoveButton = ({ onClick }: { onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full 
			opacity-0 group-hover:opacity-100 transition-opacity
			flex items-center justify-center hover:bg-red-600 z-10"
	>
		✕
	</button>
);

interface ImageUploaderProps {
	existingImages: PostImage[];
	newImages: File[];
	onAddImages: (files: File[]) => void;
	onRemoveExisting: (imageId: string) => void;
	onRemoveNew: (index: number) => void;
	maxImages: number;
	coverIndex: number;
	onSetCover: (index: number) => void;
}

export default function ImageUploader({
	existingImages,
	newImages,
	onAddImages,
	onRemoveExisting,
	onRemoveNew,
	maxImages,
	coverIndex,
	onSetCover,
}: ImageUploaderProps) {
	const t = useTranslations("admin");
	const totalImages = existingImages.length + newImages.length;
	const canAddMore = totalImages < maxImages;

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				onAddImages(acceptedFiles);
			}
		},
		[onAddImages]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [".jpg", ".jpeg"],
			"image/png": [".png"],
			"image/webp": [".webp"],
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		disabled: !canAddMore,
	});

	return (
		<div className="space-y-4">
			{/* Image Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{/* Existing Images */}
				{existingImages.map((image, index) => {
					const isCover = index === coverIndex;
					return (
						<div
							key={image.id}
							className={`relative aspect-square rounded-lg overflow-hidden bg-gray-800 group
								${isCover ? "ring-2 ring-lego-red ring-offset-2" : ""}`}
						>
							<Image
								src={image.image_url}
								alt={image.alt_text || "Build image"}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-contain p-1"
							/>
							<RemoveButton
								onClick={() => onRemoveExisting(image.id)}
							/>
							<CoverButton
								isCover={isCover}
								onClick={() => onSetCover(index)}
								label={t("cover")}
							/>
							<div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
								#{index + 1}
							</div>
						</div>
					);
				})}

				{/* New Images Preview */}
				{newImages.map((file, index) => {
					const globalIndex = existingImages.length + index;
					const isCover = globalIndex === coverIndex;
					const displayNumber = globalIndex + 1;
					return (
						<div
							key={`new-${index}`}
							className={`relative aspect-square rounded-lg overflow-hidden bg-gray-800 group
								${isCover ? "ring-2 ring-lego-red ring-offset-2" : ""}`}
						>
							<Image
								src={URL.createObjectURL(file)}
								alt={`New upload ${index + 1}`}
								fill
								sizes="(max-width: 768px) 50vw, 25vw"
								className="object-contain p-1"
							/>
							<RemoveButton onClick={() => onRemoveNew(index)} />
							<CoverButton
								isCover={isCover}
								onClick={() => onSetCover(globalIndex)}
								label={t("cover")}
							/>
							<div className="absolute bottom-2 left-2 bg-lego-blue text-white px-2 py-1 rounded text-xs">
								#{displayNumber} ({t("new")})
							</div>
						</div>
					);
				})}
			</div>

			{/* Dropzone */}
			{canAddMore && (
				<div
					{...getRootProps()}
					className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-colors ${
							isDragActive
								? "border-lego-blue bg-blue-50"
								: "border-gray-300 hover:border-lego-blue hover:bg-gray-50"
						}`}
				>
					<input {...getInputProps()} />
					<div className="text-4xl mb-2">📸</div>
					{isDragActive ? (
						<p className="text-lego-blue font-medium">
							{t("dropImagesHere")}
						</p>
					) : (
						<>
							<p className="text-gray-600 font-medium">
								{t("dragDropImages")}
							</p>
							<p className="text-sm text-gray-500 mt-2">
								{t("imageFormats")} • {maxImages - totalImages}{" "}
								{t("moreAllowed")}
							</p>
						</>
					)}
				</div>
			)}

			{!canAddMore && (
				<p className="text-sm text-gray-500 text-center">
					{t("maxImagesReached", { count: maxImages })}
				</p>
			)}
		</div>
	);
}
