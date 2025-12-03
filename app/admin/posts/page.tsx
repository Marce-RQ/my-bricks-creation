import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

export default async function PostsPage() {
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
					Manage Posts
				</h1>
				<Link href="/admin/posts/new" className="btn-primary">
					+ New Build
				</Link>
			</div>

			<PostList posts={posts} />
		</div>
	);
}
