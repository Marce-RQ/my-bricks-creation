"use client";

import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Reset loading state when component unmounts or after navigation
		return () => {
			setIsLoading(false);
		};
	}, []);

	const handleAdminClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoading(true);
		router.push("/admin");
		
		// Reset loading state after a delay to prevent permanent loading
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	};

	return (
		<header className="glass sticky top-0 z-50 border-b border-gray-100">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative">
							<Image
								src="/images/header-brand-image.png"
								alt="Header Brand Image"
								width={52}
								height={52}
								className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] group-hover:animate-float inline-block transition-transform"
							/>
							<div
								className="absolute -bottom-1 -right-1 w-3 h-3 bg-lego-yellow rounded-full 
                            opacity-0 group-hover:opacity-100 transition-opacity"
							/>
						</div>
						<div>
							<span className="font-heading font-bold text-lg sm:text-xl text-lego-dark">
								MyBricks
							</span>
							<span className="font-heading font-bold text-lg sm:text-xl text-lego-red">
								Creations
							</span>
						</div>
					</Link>

					{/* CTA Navigation to Admin page*/} 
					<div className="flex items-center gap-2 sm:gap-4">
						<button
							onClick={handleAdminClick}
							disabled={isLoading}
							className="text-sm font-medium text-gray-600 hover:text-lego-red transition-colors px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-gray-400 border-t-lego-red rounded-full animate-spin"></div>
									Loading...
								</>
							) : (
								"Admin"
							)}
						</button>
						<LanguageSwitcher />
					</div>
				</div>
			</nav>
		</header>
	);
}
