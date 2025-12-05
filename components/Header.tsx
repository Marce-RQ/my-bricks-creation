import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";

export default function Header() {
	return (
		<header className="glass sticky top-0 z-50 border-b border-gray-100">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative">
							<Image
								src="/header-brand-image.png"
								alt="Header Brand Image"
								width={61}
								height={61}
								className="group-hover:animate-float inline-block transition-transform"
							/>
							<div
								className="absolute -bottom-1 -right-1 w-3 h-3 bg-lego-yellow rounded-full 
                            opacity-0 group-hover:opacity-100 transition-opacity"
							/>
						</div>
						<div className="hidden sm:block">
							<span className="font-heading font-bold text-xl text-lego-dark">
								MyBricks
							</span>
							<span className="font-heading font-bold text-xl text-lego-red">
								Creations
							</span>
						</div>
					</Link>

					{/* Navigation */}
					<div className="flex items-center gap-2 sm:gap-4">
						<Link
							href="/"
							className="relative px-4 py-2 text-gray-600 hover:text-lego-dark 
                         font-medium transition-all duration-300 border-b-2 border-transparent hover:border-lego-red"
						>
							Gallery
						</Link>
						<LanguageSwitcher />
					</div>
				</div>
			</nav>
		</header>
	);
}
