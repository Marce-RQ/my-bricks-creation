import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale, getTranslations } from "next-intl/server";

async function getStats() {
	const supabase = await createClient();

	const { count: totalPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true });

	const { count: publishedPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("status", "published");

	const { count: draftPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("status", "draft");

	return {
		totalPosts: totalPosts || 0,
		publishedPosts: publishedPosts || 0,
		draftPosts: draftPosts || 0,
	};
}

export default async function AdminDashboard({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("admin");

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/admin/login");
	}

	const stats = await getStats();

	const statCards = [
		{
			label: t("totalBuilds"),
			value: stats.totalPosts,
			icon: "🚀",
			color: "from-lego-blue to-blue-600",
			bgLight: "bg-blue-50",
		},
		{
			label: t("published"),
			value: stats.publishedPosts,
			icon: "✅",
			color: "from-green-500 to-emerald-600",
			bgLight: "bg-green-50",
		},
		{
			label: t("drafts"),
			value: stats.draftPosts,
			icon: "📝",
			color: "from-amber-400 to-orange-500",
			bgLight: "bg-amber-50",
		},
	];

	return (
		<div className="space-y-8 animate-in">
			{/* Welcome Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-heading font-bold text-lego-dark">
						{t("welcomeBack")} 👋
					</h1>
					<p className="text-gray-500 mt-1">
						{t("overviewDescription")}
					</p>
				</div>
				<Link href="/admin/posts/new" className="btn-primary">
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
					{t("newBuild")}
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{statCards.map((stat, index) => (
					<div
						key={stat.label}
						className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100
                     hover:shadow-lg transition-all duration-300 group"
						style={{ animationDelay: `${index * 100}ms` }}
					>
						<div className="flex items-start justify-between">
							<div>
								<p className="text-gray-500 text-sm font-medium">
									{stat.label}
								</p>
								<p className="text-4xl font-bold text-lego-dark mt-2">
									{stat.value}
								</p>
							</div>
							<div
								className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} 
                            flex items-center justify-center text-2xl shadow-lg
                            group-hover:scale-110 transition-transform duration-300`}
							>
								{stat.icon}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
				<h2 className="text-xl font-heading font-bold text-lego-dark mb-6 flex items-center gap-2">
					<span className="text-2xl">⚡</span>
					{t("quickActions")}
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<Link
						href="/admin/posts/new"
						className="group flex items-center gap-4 p-4 rounded-xl bg-lego-red/5 
                     hover:bg-lego-red transition-colors"
					>
						<div
							className="w-12 h-12 rounded-xl bg-lego-red/10 group-hover:bg-white/20 
                          flex items-center justify-center transition-colors"
						>
							<span className="text-2xl">➕</span>
						</div>
						<div>
							<p className="font-semibold text-lego-dark group-hover:text-white transition-colors">
								{t("createNewBuild")}
							</p>
							<p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors">
								{t("addNewCreation")}
							</p>
						</div>
					</Link>

					<Link
						href="/admin/posts"
						className="group flex items-center gap-4 p-4 rounded-xl bg-lego-blue/5 
                     hover:bg-lego-blue transition-colors"
					>
						<div
							className="w-12 h-12 rounded-xl bg-lego-blue/10 group-hover:bg-white/20 
                          flex items-center justify-center transition-colors"
						>
							<span className="text-2xl">📋</span>
						</div>
						<div>
							<p className="font-semibold text-lego-dark group-hover:text-white transition-colors">
								{t("managePosts")}
							</p>
							<p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors">
								{t("editOrDelete")}
							</p>
						</div>
					</Link>

					<Link
						href="/"
						className="group flex items-center gap-4 p-4 rounded-xl bg-gray-100 
                     hover:bg-gray-800 transition-colors"
					>
						<div
							className="w-12 h-12 rounded-xl bg-gray-200 group-hover:bg-white/20 
                          flex items-center justify-center transition-colors"
						>
							<span className="text-2xl">👀</span>
						</div>
						<div>
							<p className="font-semibold text-lego-dark group-hover:text-white transition-colors">
								{t("viewSite")}
							</p>
							<p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors">
								{t("openPublicGallery")}
							</p>
						</div>
					</Link>
				</div>
			</div>

			{/* Storage Usage */}
			<div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-heading font-bold text-lego-dark flex items-center gap-2">
						<span className="text-2xl">💾</span>
						{t("storageUsage")}
					</h2>
					<span className="text-sm text-gray-500">0 MB / 1 GB</span>
				</div>
				<div className="h-4 bg-gray-100 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-lego-blue to-lego-red rounded-full transition-all duration-500"
						style={{ width: "0%" }}
					/>
				</div>
				<p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
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
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{t("storageInfo")}
				</p>
			</div>
		</div>
	);
}
