import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("footer");
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-b from-lego-dark to-gray-900 text-white mt-auto">
			{/* Decorative brick pattern */}
			<div className="h-2 bg-gradient-to-r from-lego-red via-lego-yellow to-lego-blue" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
					{/* Brand */}
					<div className="text-center md:text-left">
						<Link
							href="/"
							className="inline-flex items-center gap-3 group"
						>
							<span className="text-3xl group-hover:animate-float inline-block">
								🧱
							</span>
							<div>
								<span className="font-heading font-bold text-xl">
									MyBricks
								</span>
								<span className="font-heading font-bold text-xl text-lego-yellow">
									Creations
								</span>
							</div>
						</Link>
						<p className="mt-3 text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
							{t("tagline")}
						</p>
					</div>

					{/* Links */}
					<nav className="flex justify-center gap-8">
						<Link
							href="/"
							className="text-gray-300 hover:text-lego-yellow transition-colors font-medium"
						>
							{t("gallery")}
						</Link>
						<Link
							href="/support"
							className="text-gray-300 hover:text-lego-yellow transition-colors font-medium"
						>
							{t("support")}
						</Link>
					</nav>

					{/* Copyright */}
					<div className="text-center md:text-right">
						<p className="text-gray-400 text-sm">
							© {currentYear} MyBricksCreations
						</p>
						<p className="text-gray-500 text-xs mt-1">
							{t("madeWith")}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
