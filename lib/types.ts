export interface Post {
	id: string;
	title: string;
	description: string | null;
	slug: string;
	piece_count: number | null;
	status: "draft" | "published";
	date_start: string | null;
	date_completed: string | null;
	created_at: string;
	updated_at: string;
	published_at: string | null;
}

export interface PostImage {
	id: string;
	post_id: string;
	image_url: string;
	display_order: number;
	alt_text: string | null;
	created_at: string;
}

export interface PostWithImages extends Post {
	images: PostImage[];
}
