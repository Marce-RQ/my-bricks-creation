import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PostWithImages } from "@/lib/types";

interface BuildCardProps {
	post: PostWithImages;
}

export default function BuildCard({ post }: BuildCardProps) {
	const mainImage =
		post.images.find((img) => img.display_order === 0) || post.images[0];

	return (
		<Link href={`/builds/${post.slug}`} className="block group">
			<article className="card overflow-hidden">
				{/* Image Container */}
				<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
					{mainImage ? (
						<>
							<Image
								src={mainImage.image_url}
								alt={mainImage.alt_text || post.title}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							{/* Gradient overlay on hover */}
							<div
								className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
						</>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<span className="text-7xl opacity-50 group-hover:animate-float transition-transform">
								🧱
							</span>
						</div>
					)}

					{/* Image count badge */}
					{post.images.length > 1 && (
						<div
							className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white 
                          px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
						>
							<svg
								className="w-3.5 h-3.5"
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
							{post.images.length}
						</div>
					)}

					{/* View button on hover */}
					<div
						className="absolute inset-0 flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-all duration-300"
					>
						<span
							className="bg-white text-lego-dark px-6 py-2.5 rounded-full font-semibold 
                           shadow-lg transform translate-y-4 group-hover:translate-y-0 
                           transition-transform duration-300"
						>
							View Build
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="p-5">
					<h3
						className="font-heading font-bold text-lg text-lego-dark mb-2 
                       group-hover:text-lego-red transition-colors line-clamp-2"
					>
						{post.title}
					</h3>

					<div className="flex items-center justify-between">
						{post.piece_count ? (
							<div className="flex items-center gap-2 text-sm">
								<span
									className="inline-flex items-center gap-1.5 bg-lego-blue/10 text-lego-blue 
                              px-3 py-1.5 rounded-full font-medium"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
									{post.piece_count.toLocaleString()} pieces
								</span>
							</div>
						) : (
							<span />
						)}

						{/* Arrow indicator */}
						<span
							className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                           group-hover:bg-lego-red group-hover:text-white transition-colors"
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
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</span>
					</div>
				</div>
			</article>
		</Link>
	);
}
