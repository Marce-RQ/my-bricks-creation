"use client";

import { useState } from "react";
import Image from "next/image";
import type { PostImage } from "@/lib/types";

interface ImageCarouselProps {
	images: PostImage[];
	title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	if (!images.length) {
		return (
			<div
				className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl 
                    flex items-center justify-center shadow-soft"
			>
				<span className="text-9xl opacity-50 animate-float">🧱</span>
			</div>
		);
	}

	const sortedImages = [...images].sort(
		(a, b) => a.display_order - b.display_order
	);

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div
				className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 
                    shadow-soft group"
			>
				<Image
					src={sortedImages[activeIndex].image_url}
					alt={
						sortedImages[activeIndex].alt_text ||
						`${title} - Image ${activeIndex + 1}`
					}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-contain"
					priority
				/>

				{/* Gradient overlay */}
				<div
					className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				/>

				{/* Navigation Arrows */}
				{sortedImages.length > 1 && (
					<>
						<button
							onClick={() =>
								setActiveIndex((prev) =>
									prev === 0
										? sortedImages.length - 1
										: prev - 1
								)
							}
							className="absolute left-4 top-1/2 -translate-y-1/2 
                       w-12 h-12 rounded-full
                       bg-white/90 hover:bg-white 
                       shadow-lg backdrop-blur-sm
                       flex items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transform -translate-x-2 group-hover:translate-x-0
                       transition-all duration-300"
							aria-label="Previous image"
						>
							<svg
								className="w-6 h-6 text-lego-dark"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						<button
							onClick={() =>
								setActiveIndex((prev) =>
									prev === sortedImages.length - 1
										? 0
										: prev + 1
								)
							}
							className="absolute right-4 top-1/2 -translate-y-1/2 
                       w-12 h-12 rounded-full
                       bg-white/90 hover:bg-white 
                       shadow-lg backdrop-blur-sm
                       flex items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transform translate-x-2 group-hover:translate-x-0
                       transition-all duration-300"
							aria-label="Next image"
						>
							<svg
								className="w-6 h-6 text-lego-dark"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</>
				)}

				{/* Image Counter */}
				{sortedImages.length > 1 && (
					<div
						className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm 
                        text-white px-4 py-2 rounded-full text-sm font-medium
                        flex items-center gap-2"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						{activeIndex + 1} / {sortedImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{sortedImages.length > 1 && (
				<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
					{sortedImages.map((image, index) => (
						<button
							key={image.id}
							onClick={() => setActiveIndex(index)}
							className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 
                         bg-gray-800 transition-all duration-300 ${
								index === activeIndex
									? "ring-3 ring-lego-red ring-offset-2 scale-105 shadow-lg"
									: "opacity-60 hover:opacity-100 hover:scale-105"
							}`}
						>
							<Image
								src={image.image_url}
								alt={
									image.alt_text ||
									`${title} thumbnail ${index + 1}`
								}
								fill
								sizes="80px"
								className="object-contain p-1"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
