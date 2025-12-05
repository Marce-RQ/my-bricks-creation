import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Header() {
	const t = useTranslations("header");
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
								width={52}
								height={52}
								className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] group-hover:animate-float inline-block transition-transform"
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

					{/* Navigation */}
					<div className="flex items-center gap-2 sm:gap-4">
						<LanguageSwitcher />
					</div>
				</div>
			</nav>
		</header>
	);
}
