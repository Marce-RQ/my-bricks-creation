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

export interface CreatePostInput {
	title: string;
	description?: string;
	slug: string;
	piece_count?: number;
	status: "draft" | "published";
	date_start?: string;
	date_completed?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
	id: string;
}

export interface UploadedImage {
	file: File;
	preview: string;
	alt_text?: string;
}

export interface StorageStats {
	totalBytes: number;
	usedBytes: number;
	percentage: number;
}
