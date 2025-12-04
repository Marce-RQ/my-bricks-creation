import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import PostForm from "@/components/PostForm";
import type { PostWithImages } from "@/lib/types";

interface EditPostPageProps {
	params: Promise<{ locale: string; id: string }>;
}

async function getPost(id: string): Promise<PostWithImages | null> {
	const supabase = await createClient();

	const { data: post, error } = await supabase
		.from("posts")
		.select("*")
		.eq("id", id)
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

export default async function EditPostPage({ params }: EditPostPageProps) {
	const { locale, id } = await params;
	setRequestLocale(locale);

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/admin/login");
	}

	const post = await getPost(id);

	if (!post) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-3xl font-heading font-bold text-lego-dark mb-8">
				Edit Build
			</h1>
			<PostForm post={post} />
		</div>
	);
}
