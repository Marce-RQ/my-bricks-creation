"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface CopyButtonProps {
	text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Address copied to clipboard!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy address");
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                font-semibold transition-all duration-200 flex-shrink-0
                ${
					copied
						? "bg-green-500 text-white shadow-lg"
						: "bg-lego-blue text-white hover:bg-lego-blue-600 shadow-md hover:shadow-lg"
				}`}
		>
			{copied ? (
				<>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Copied!
				</>
			) : (
				<>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					Copy
				</>
			)}
		</button>
	);
}
