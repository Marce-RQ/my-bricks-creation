import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

export function getStorageUsagePercentage(usedBytes: number): number {
	const totalBytes = 1024 * 1024 * 1024; // 1GB
	return Math.round((usedBytes / totalBytes) * 100);
}
