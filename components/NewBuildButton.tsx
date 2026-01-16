"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface NewBuildButtonProps {
	variant?: "primary" | "quickAction";
}

export default function NewBuildButton({ variant = "primary" }: NewBuildButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations("admin");

	const handleNewBuild = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoading(true);
		router.push("/admin/posts/new");
		
		// Reset loading state after a delay
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};

	if (variant === "quickAction") {
		return (
			<button
				onClick={handleNewBuild}
				disabled={isLoading}
				className="group flex items-center gap-4 p-4 rounded-xl bg-lego-red/5 
                     hover:bg-lego-red transition-colors w-full text-left disabled:opacity-50"
			>
				<div
					className="w-12 h-12 rounded-xl bg-lego-red/10 group-hover:bg-white/20 
                          flex items-center justify-center transition-colors"
				>
					{isLoading ? (
						<div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
					) : (
						<span className="text-2xl">➕</span>
					)}
				</div>
				<div>
					<p className="font-semibold text-lego-dark group-hover:text-white transition-colors">
						{isLoading ? "Loading..." : t("createNewBuild")}
					</p>
					<p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors">
						{t("addNewCreation")}
					</p>
				</div>
			</button>
		);
	}

	return (
		<button
			onClick={handleNewBuild}
			disabled={isLoading}
			className="btn-primary flex items-center gap-2 disabled:opacity-50"
		>
			{isLoading ? (
				<>
					<div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
					Loading...
				</>
			) : (
				<>
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
				</>
			)}
		</button>
	);
}
