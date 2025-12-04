"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminNav() {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		toast.success("Logged out successfully");
		router.push("/admin/login");
	};

	const navItems = [
		{ href: "/admin", label: "Dashboard", icon: "📊" },
		{ href: "/admin/posts", label: "Posts", icon: "📝" },
		{ href: "/admin/posts/new", label: "New Post", icon: "➕" },
	];

	return (
		<nav className="bg-lego-dark text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center gap-8">
						<Link href="/admin" className="flex items-center gap-2">
							<span className="text-2xl">🧱</span>
							<span className="font-heading font-bold">
								Admin Panel
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

					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="text-gray-300 hover:text-white transition-colors text-sm"
						>
							View Site ↗
						</Link>
						<button
							onClick={handleLogout}
							className="text-gray-300 hover:text-white transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
}
