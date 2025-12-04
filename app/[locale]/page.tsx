import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BuildCard from "@/components/BuildCard";
import type { PostWithImages } from "@/lib/types";

async function getPosts(): Promise<PostWithImages[]> {
	const supabase = await createClient();

	const { data: posts, error } = await supabase
		.from("posts")
		.select("*")
		.eq("status", "published")
		.order("created_at", { ascending: false });

	if (error || !posts) {
		console.error("Error fetching posts:", error);
		return [];
	}

	// Get images for each post
	const postsWithImages = await Promise.all(
		posts.map(async (post) => {
			const { data: images } = await supabase
				.from("post_images")
				.select("*")
				.eq("post_id", post.id)
				.order("display_order", { ascending: true });

			return {
				...post,
				images: images || [],
			};
		})
	);

	return postsWithImages;
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations();
	const posts = await getPosts();

	return (
		<div className="overflow-hidden">
			{/* Hero Section */}
			<section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-lego-bg via-white to-lego-yellow-50 pattern-dots">
				{/* Decorative elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-lego-red/10 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-32 h-32 bg-lego-blue/10 rounded-full blur-3xl" />

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
					<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
						{/* Avatar */}
						<div className="relative animate-in">
							{/* Glow effect */}
							<div
								className="absolute inset-0 bg-gradient-to-br from-lego-yellow to-lego-red 
                            rounded-full blur-2xl opacity-30 scale-110 animate-pulse-soft"
							/>

							<div
								className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden 
                            ring-4 ring-white ring-offset-4 ring-offset-lego-yellow/20 
                            shadow-2xl bg-gray-200"
							>
								<Image
									src="/avatar.svg"
									alt="Young Master Builder"
									width={256}
									height={256}
									className="object-cover w-full h-full"
									priority
								/>
							</div>

							{/* Floating Lego bricks around avatar */}
							<div className="absolute -bottom-2 -right-4 text-4xl animate-float">
								🧱
							</div>
							<div
								className="absolute -bottom-6 right-8 text-3xl animate-float"
								style={{ animationDelay: "200ms" }}
							>
								🟨
							</div>
							<div
								className="absolute top-0 -right-8 text-3xl animate-float"
								style={{ animationDelay: "400ms" }}
							>
								🟥
							</div>
							<div
								className="absolute top-1/3 -left-6 text-2xl animate-float"
								style={{ animationDelay: "600ms" }}
							>
								🟦
							</div>
							<div
								className="absolute -bottom-4 left-4 text-2xl animate-float"
								style={{ animationDelay: "300ms" }}
							>
								🟩
							</div>
							<div
								className="absolute top-8 -left-4 text-3xl animate-float"
								style={{ animationDelay: "500ms" }}
							>
								🧱
							</div>

							{/* Badge */}
							<div
								className="absolute -top-2 -left-2 bg-lego-red text-white px-3 py-1 
                            rounded-full text-sm font-bold shadow-lg rotate-[-10deg]"
							>
								{t("hero.badge")}
							</div>
						</div>

						{/* Content */}
						<div
							className="text-center lg:text-left max-w-xl animate-in"
							style={{ animationDelay: "100ms" }}
						>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-lego-dark mb-6 leading-tight">
								{t("hero.greeting")}{" "}
								<span className="text-gradient inline-block">
									{t("hero.title")}
								</span>
							</h1>

							<p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
								{t("hero.description")}
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Link href="#gallery" className="btn-primary">
									{t("hero.exploreGallery")}
									<svg
										className="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</Link>
								<Link href="/support" className="btn-outline">
									❤️ {t("hero.supportCreations")}
								</Link>
							</div>

							{/* Stats */}
							{posts.length > 0 && (
								<div className="flex gap-8 justify-center lg:justify-start mt-10 pt-8 border-t border-gray-200">
									<div>
										<p className="text-3xl font-heading font-bold text-lego-dark">
											{posts.length}
										</p>
										<p className="text-sm text-gray-500">
											{t("hero.creations")}
										</p>
									</div>
									<div>
										<p className="text-3xl font-heading font-bold text-lego-dark">
											{posts
												.reduce(
													(acc, post) =>
														acc +
														(post.piece_count || 0),
													0
												)
												.toLocaleString()}
										</p>
										<p className="text-sm text-gray-500">
											{t("hero.totalPieces")}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
					<svg
						className="w-6 h-6 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</section>

			{/* Gallery Section */}
			<section id="gallery" className="py-20 sm:py-28 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<span className="inline-block text-4xl mb-4 animate-float">
							✨
						</span>
						<h2 className="section-heading">
							{t("gallery.title")}
						</h2>
						<p className="section-subheading">
							{t("gallery.subtitle")}
						</p>
					</div>

					{posts.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{posts.map((post, index) => (
								<div
									key={post.id}
									className="animate-in"
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<BuildCard post={post} />
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-20">
							<div
								className="inline-flex items-center justify-center w-24 h-24 
                            bg-lego-bg rounded-full mb-6"
							>
								<span className="text-5xl animate-float">
									🏗️
								</span>
							</div>
							<h3 className="text-2xl font-heading font-bold text-lego-dark mb-3">
								{t("gallery.emptyTitle")}
							</h3>
							<p className="text-lg text-gray-500 max-w-md mx-auto">
								{t("gallery.emptyDescription")}
							</p>
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-br from-lego-dark via-gray-900 to-lego-dark relative overflow-hidden">
				{/* Decorative bricks */}
				<div className="absolute top-10 left-10 text-6xl opacity-10">
					🧱
				</div>
				<div className="absolute bottom-10 right-10 text-8xl opacity-10">
					🧱
				</div>

				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<span className="text-5xl mb-6 block">❤️</span>
					<h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
						{t("cta.title")}
					</h2>
					<p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
						{t("cta.description")}
					</p>
					<Link
						href="/support"
						className="btn-primary bg-lego-yellow text-lego-dark hover:bg-lego-yellow-300"
					>
						{t("cta.button")}
						<svg
							className="w-5 h-5"
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
			</section>
		</div>
	);
}
