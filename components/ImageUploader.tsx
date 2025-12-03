"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import type { PostImage } from "@/lib/types";

interface ImageUploaderProps {
	existingImages: PostImage[];
	newImages: File[];
	onAddImages: (files: File[]) => void;
	onRemoveExisting: (imageId: string) => void;
	onRemoveNew: (index: number) => void;
	maxImages: number;
}

export default function ImageUploader({
	existingImages,
	newImages,
	onAddImages,
	onRemoveExisting,
	onRemoveNew,
	maxImages,
}: ImageUploaderProps) {
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
				{existingImages.map((image) => (
					<div
						key={image.id}
						className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
					>
						<Image
							src={image.image_url}
							alt={image.alt_text || "Build image"}
							fill
							sizes="(max-width: 768px) 50vw, 25vw"
							className="object-cover"
						/>
						<button
							type="button"
							onClick={() => onRemoveExisting(image.id)}
							className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full 
                         opacity-0 group-hover:opacity-100 transition-opacity
                         flex items-center justify-center hover:bg-red-600"
						>
							✕
						</button>
						<div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
							#{image.display_order + 1}
						</div>
					</div>
				))}

				{/* New Images Preview */}
				{newImages.map((file, index) => (
					<div
						key={`new-${index}`}
						className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
					>
						<Image
							src={URL.createObjectURL(file)}
							alt={`New upload ${index + 1}`}
							fill
							sizes="(max-width: 768px) 50vw, 25vw"
							className="object-cover"
						/>
						<button
							type="button"
							onClick={() => onRemoveNew(index)}
							className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full 
                         opacity-0 group-hover:opacity-100 transition-opacity
                         flex items-center justify-center hover:bg-red-600"
						>
							✕
						</button>
						<div className="absolute bottom-2 left-2 bg-lego-blue text-white px-2 py-1 rounded text-xs">
							New
						</div>
					</div>
				))}
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
							Drop images here...
						</p>
					) : (
						<>
							<p className="text-gray-600 font-medium">
								Drag & drop images here, or click to select
							</p>
							<p className="text-sm text-gray-500 mt-2">
								JPEG, PNG, or WebP • Max 5MB each •{" "}
								{maxImages - totalImages} more allowed
							</p>
						</>
					)}
				</div>
			)}

			{!canAddMore && (
				<p className="text-sm text-gray-500 text-center">
					Maximum of {maxImages} images reached
				</p>
			)}
		</div>
	);
}
