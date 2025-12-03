import Link from "next/link";

export default function Header() {
	return (
		<header className="glass sticky top-0 z-50 border-b border-gray-100">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 md:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative">
							<span className="text-3xl group-hover:animate-float inline-block transition-transform">
								🧱
							</span>
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
                         font-medium transition-colors group"
						>
							Gallery
							<span
								className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 
                             bg-lego-red group-hover:w-full transition-all duration-300"
							/>
						</Link>
						<Link
							href="/support"
							className="btn-primary text-sm py-2.5 px-5 shadow-none hover:shadow-button"
						>
							<span className="hidden sm:inline">❤️</span> Support
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
}
