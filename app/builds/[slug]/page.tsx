import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ImageCarousel from "@/components/ImageCarousel";
import { formatDate, truncateText } from "@/lib/utils";
import type { PostWithImages } from "@/lib/types";

interface BuildPageProps {
	params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PostWithImages | null> {
	const supabase = await createClient();

	const { data: post, error } = await supabase
		.from("posts")
		.select("*")
		.eq("slug", slug)
		.eq("status", "published")
		.single();

	if (error || !post) {
		return null;
	}

	const { data: images } = await supabase
		.from("post_images")
		.select("*")
		.eq("post_id", post.id)
		.order("display_order", { ascending: true });

	return {
		...post,
		images: images || [],
	};
}

export async function generateMetadata({
	params,
}: BuildPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		return {
			title: "Build Not Found | MyBricksCreations",
		};
	}

	const description = post.description
		? truncateText(post.description, 160)
		: `Check out this amazing Lego creation: ${post.title}`;

	const ogImage = post.images[0]?.image_url;

	return {
		title: `${post.title} | MyBricksCreations`,
		description,
		openGraph: {
			title: post.title,
			description,
			type: "article",
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
	};
}

export default async function BuildPage({ params }: BuildPageProps) {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-lego-bg to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
				{/* Breadcrumb */}
				<nav className="mb-8 animate-in">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-gray-500 hover:text-lego-red 
                     transition-colors group"
					>
						<span
							className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center
                           group-hover:shadow-md transition-shadow"
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
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
						</span>
						<span className="font-medium">Back to Gallery</span>
					</Link>
				</nav>

				<div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
					{/* Image Section */}
					<div
						className="animate-in"
						style={{ animationDelay: "100ms" }}
					>
						<div className="sticky top-28">
							<ImageCarousel
								images={post.images}
								title={post.title}
							/>
						</div>
					</div>

					{/* Content Section */}
					<div
						className="space-y-8 animate-in"
						style={{ animationDelay: "200ms" }}
					>
						{/* Title */}
						<div>
							<div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
								<span className="w-2 h-2 bg-green-500 rounded-full" />
								Published{" "}
								{post.published_at
									? formatDate(post.published_at)
									: formatDate(post.created_at)}
							</div>
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-lego-dark leading-tight">
								{post.title}
							</h1>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{post.piece_count && (
								<div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
									<div className="w-10 h-10 bg-lego-blue/10 rounded-lg flex items-center justify-center mb-3">
										<svg
											className="w-5 h-5 text-lego-blue"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
											/>
										</svg>
									</div>
									<p className="text-2xl font-bold text-lego-dark">
										{post.piece_count.toLocaleString()}
									</p>
									<p className="text-sm text-gray-500">
										Pieces
									</p>
								</div>
							)}
							{post.date_start && (
								<div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
									<div className="w-10 h-10 bg-lego-yellow/20 rounded-lg flex items-center justify-center mb-3">
										<svg
											className="w-5 h-5 text-lego-yellow-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p className="text-sm font-semibold text-lego-dark">
										{formatDate(post.date_start)}
									</p>
									<p className="text-sm text-gray-500">
										Started
									</p>
								</div>
							)}
							{post.date_completed && (
								<div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
									<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
										<svg
											className="w-5 h-5 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<p className="text-sm font-semibold text-lego-dark">
										{formatDate(post.date_completed)}
									</p>
									<p className="text-sm text-gray-500">
										Completed
									</p>
								</div>
							)}
						</div>

						{/* Description */}
						{post.description && (
							<div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-lego-red/10 rounded-lg flex items-center justify-center">
										<span className="text-xl">📖</span>
									</div>
									<h2 className="text-xl font-heading font-bold text-lego-dark">
										The Story
									</h2>
								</div>
								<div className="prose prose-gray max-w-none">
									<p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
										{post.description}
									</p>
								</div>
							</div>
						)}

						{/* Support CTA */}
						<div
							className="relative overflow-hidden bg-gradient-to-br from-lego-red to-red-600 
                          p-8 rounded-2xl text-white"
						>
							{/* Decorative elements */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
							<div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

							<div className="relative z-10">
								<span className="text-4xl mb-4 block">🧱</span>
								<h3 className="text-xl font-heading font-bold mb-2">
									Enjoyed this creation?
								</h3>
								<p className="text-white/80 mb-6">
									Your support helps me get more bricks and
									create even more amazing builds!
								</p>
								<Link
									href="/support"
									className="inline-flex items-center gap-2 bg-white text-lego-red px-6 py-3 
                           rounded-xl font-semibold hover:bg-gray-100 transition-colors"
								>
									❤️ Support Me
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
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
