export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + "...";
}

export function validateImageFile(file: File): {
	valid: boolean;
	error?: string;
} {
	const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
	const maxSize = 5 * 1024 * 1024; // 5MB

	if (!validTypes.includes(file.type)) {
		return {
			valid: false,
			error: "Invalid file type. Please upload JPEG, PNG, or WebP.",
		};
	}

	if (file.size > maxSize) {
		return { valid: false, error: "File too large. Maximum size is 5MB." };
	}

	return { valid: true };
}
