import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function NotFound({
	params,
}: {
	params?: Promise<{ locale: string }>;
}) {
	const locale = params ? (await params).locale : "en";
	setRequestLocale(locale);

	const t = await getTranslations("notFound");

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-lego-bg to-white">
			<div className="text-center px-4 py-16 max-w-lg mx-auto">
				{/* Animated 404 */}
				<div className="relative inline-block mb-8">
					<span className="text-[150px] font-heading font-bold text-lego-bg leading-none">
						404
					</span>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-7xl animate-float">🧱</span>
					</div>
				</div>

				<h1 className="text-3xl sm:text-4xl font-heading font-bold text-lego-dark mb-4">
					{t("title")}
				</h1>

				<p className="text-lg text-gray-500 mb-8 leading-relaxed">
					{t("description")}
				</p>

				<Link
					href="/"
					className="btn-primary inline-flex items-center gap-2"
				>
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
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					{t("backHome")}
				</Link>

				{/* Decorative bricks */}
				<div className="flex justify-center gap-4 mt-12">
					{["🟥", "🟨", "🟦"].map((brick, i) => (
						<span
							key={i}
							className="text-3xl animate-float opacity-50"
							style={{ animationDelay: `${i * 150}ms` }}
						>
							{brick}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
