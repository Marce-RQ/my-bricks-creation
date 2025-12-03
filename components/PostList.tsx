"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface PostListProps {
	posts: Post[];
}

export default function PostList({ posts: initialPosts }: PostListProps) {
	const [posts, setPosts] = useState(initialPosts);
	const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
	const [deleting, setDeleting] = useState<string | null>(null);
	const router = useRouter();

	const filteredPosts = posts.filter((post) => {
		if (filter === "all") return true;
		return post.status === filter;
	});

	const handleDelete = async (postId: string) => {
		if (!confirm("Are you sure you want to delete this post?")) return;

		setDeleting(postId);
		const supabase = createClient();

		try {
			const { error } = await supabase
				.from("posts")
				.delete()
				.eq("id", postId);

			if (error) throw error;

			setPosts(posts.filter((p) => p.id !== postId));
			toast.success("Post deleted successfully");
			router.refresh();
		} catch {
			toast.error("Failed to delete post");
		} finally {
			setDeleting(null);
		}
	};

	const toggleStatus = async (post: Post) => {
		const newStatus = post.status === "published" ? "draft" : "published";
		const supabase = createClient();

		try {
			const { error } = await supabase
				.from("posts")
				.update({
					status: newStatus,
					published_at:
						newStatus === "published"
							? new Date().toISOString()
							: null,
				})
				.eq("id", post.id);

			if (error) throw error;

			setPosts(
				posts.map((p) =>
					p.id === post.id ? { ...p, status: newStatus } : p
				)
			);
			toast.success(
				newStatus === "published"
					? "Post published!"
					: "Post unpublished"
			);
			router.refresh();
		} catch {
			toast.error("Failed to update post status");
		}
	};

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex gap-2">
				{(["all", "published", "draft"] as const).map(
					(filterOption) => (
						<button
							key={filterOption}
							onClick={() => setFilter(filterOption)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filter === filterOption
									? "bg-lego-blue text-white"
									: "bg-white text-gray-600 hover:bg-gray-100"
							}`}
						>
							{filterOption.charAt(0).toUpperCase() +
								filterOption.slice(1)}
							{filterOption !== "all" && (
								<span className="ml-2 bg-white/20 px-2 py-0.5 rounded">
									{
										posts.filter(
											(p) => p.status === filterOption
										).length
									}
								</span>
							)}
						</button>
					)
				)}
			</div>

			{/* Posts Table */}
			<div className="bg-white rounded-card shadow-card overflow-hidden">
				{filteredPosts.length === 0 ? (
					<div className="p-12 text-center">
						<span className="text-6xl mb-4 block">📭</span>
						<p className="text-gray-500">No posts found</p>
						<Link
							href="/admin/posts/new"
							className="text-lego-blue hover:underline mt-2 inline-block"
						>
							Create your first post
						</Link>
					</div>
				) : (
					<table className="w-full">
						<thead className="bg-gray-50 border-b">
							<tr>
								<th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
									Title
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
									Status
								</th>
								<th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
									Created
								</th>
								<th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{filteredPosts.map((post) => (
								<tr key={post.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<p className="font-medium text-lego-dark">
												{post.title}
											</p>
											<p className="text-sm text-gray-500">
												/{post.slug}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() => toggleStatus(post)}
											className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
												post.status === "published"
													? "bg-green-100 text-green-700"
													: "bg-yellow-100 text-yellow-700"
											}`}
										>
											{post.status === "published"
												? "✓ Published"
												: "Draft"}
										</button>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{formatDate(post.created_at)}
									</td>
									<td className="px-6 py-4">
										<div className="flex justify-end gap-2">
											<Link
												href={`/builds/${post.slug}`}
												target="_blank"
												className="p-2 text-gray-400 hover:text-gray-600"
												title="View"
											>
												👁️
											</Link>
											<Link
												href={`/admin/posts/edit/${post.id}`}
												className="p-2 text-gray-400 hover:text-lego-blue"
												title="Edit"
											>
												✏️
											</Link>
											<button
												onClick={() =>
													handleDelete(post.id)
												}
												disabled={deleting === post.id}
												className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
												title="Delete"
											>
												{deleting === post.id
													? "⏳"
													: "🗑️"}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
