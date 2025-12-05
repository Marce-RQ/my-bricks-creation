import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PostList from "@/components/PostList";
import type { Post } from "@/lib/types";

async function getPosts(): Promise<Post[]> {
	const supabase = await createClient();

	const { data: posts, error } = await supabase
		.from("posts")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching posts:", error);
		return [];
	}

	return posts || [];
}

export default async function PostsPage({
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

	const posts = await getPosts();

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-heading font-bold text-lego-dark">
					{t("managePostsTitle")}
				</h1>
				<Link href="/admin/posts/new" className="btn-primary">
					+ {t("newBuild")}
				</Link>
			</div>

			<PostList posts={posts} />
		</div>
	);
}
