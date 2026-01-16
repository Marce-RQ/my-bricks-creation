"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export default function AdminNav() {
	const pathname = usePathname();
	const router = useRouter();
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const supabase = createClient();
			await supabase.auth.signOut();
			toast.success(t("logoutSuccess"));
			router.push("/admin/login");
			router.refresh();
		} catch {
			toast.error("Failed to logout");
		} finally {
			setIsLoggingOut(false);
		}
	};

	const navItems = [
		{ href: "/admin", label: t("dashboard"), icon: "📊" },
		{ href: "/admin/posts", label: t("posts"), icon: "📝" },
	];

	return (
		<nav className="bg-lego-dark text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center gap-8">
						<Link href="/admin" className="flex items-center gap-2">
							<span className="text-2xl">🧱</span>
							<span className="font-heading font-bold">
								{t("adminPanel")}
							</span>
						</Link>

						<div className="hidden md:flex items-center gap-1">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`px-4 py-2 rounded-lg transition-colors ${
										pathname === item.href
											? "bg-lego-red text-white"
											: "text-gray-300 hover:bg-gray-700"
									}`}
								>
									<span className="mr-2">{item.icon}</span>
									{item.label}
								</Link>
							))}
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/"
							className="text-gray-300 hover:text-white transition-colors text-sm"
						>
							{t("backToUserSite")} ↗
						</Link>
						<div className="w-px h-5 bg-gray-600" />
						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="flex items-center gap-2 px-3 py-1.5 rounded-lg 
								border border-gray-500 text-gray-300 
								hover:border-red-400 hover:text-red-400 
								transition-all duration-200 text-sm font-medium
								disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoggingOut ? (
								<>
									<div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
									{tCommon("logout")}...
								</>
							) : (
								<>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									{tCommon("logout")}
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
