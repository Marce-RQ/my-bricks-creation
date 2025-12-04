import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
	title: "Support | MyBricksCreations",
	description:
		"Support a young Master Builder's Lego creations with cryptocurrency donations.",
};

const wallets = [
	{
		name: "Bitcoin",
		symbol: "BTC",
		address:
			process.env.BTC_ADDRESS ||
			"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
		color: "#F7931A",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
	},
	{
		name: "Solana",
		symbol: "SOL",
		address:
			process.env.SOL_ADDRESS ||
			"7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
		color: "#14F195",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
	},
	{
		name: "Ethereum",
		symbol: "ETH",
		address:
			process.env.ETH_ADDRESS ||
			"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		color: "#627EEA",
		bgColor: "bg-indigo-50",
		borderColor: "border-indigo-200",
		iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
	},
	{
		name: "BNB",
		symbol: "BNB",
		address:
			process.env.BNB_ADDRESS ||
			"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		color: "#F3BA2F",
		bgColor: "bg-yellow-50",
		borderColor: "border-yellow-200",
		iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
	},
	{
		name: "USDT (Tron)",
		symbol: "USDT",
		address:
			process.env.USDT_TRON_ADDRESS ||
			"TXwZ8FiNn5hPVDLSx8Xu3yH4CmPqT4CqVt",
		color: "#26A17B",
		bgColor: "bg-teal-50",
		borderColor: "border-teal-200",
		iconBg: "bg-gradient-to-br from-teal-400 to-teal-600",
	},
];

export default async function SupportPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("support");

	return (
		<div className="min-h-screen bg-gradient-to-b from-lego-bg via-white to-lego-bg">
			{/* Hero Section */}
			<section className="relative py-16 md:py-24 overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 left-1/4 w-72 h-72 bg-lego-red/5 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lego-yellow/10 rounded-full blur-3xl" />

				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					{/* Animated heart */}
					<div
						className="inline-flex items-center justify-center w-24 h-24 
                        bg-gradient-to-br from-lego-red to-red-600 rounded-3xl 
                        shadow-lg mb-8 animate-float"
					>
						<span className="text-5xl">❤️</span>
					</div>

					<h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-lego-dark mb-6">
						{t("title").split(" ").slice(0, 2).join(" ")}{" "}
						<span className="text-gradient">
							{t("title").split(" ").slice(2).join(" ")}
						</span>
					</h1>

					<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
						{t("subtitle")}
					</p>
				</div>
			</section>

			{/* Wallet Cards */}
			<section className="py-12 pb-24">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{wallets.map((wallet, index) => (
							<div
								key={wallet.symbol}
								className={`${wallet.bgColor} ${wallet.borderColor} border-2 rounded-2xl p-6 md:p-8 
                          transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                          animate-in`}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="flex flex-col md:flex-row gap-6 items-center">
									{/* Icon */}
									<div
										className={`w-20 h-20 ${wallet.iconBg} rounded-2xl flex items-center 
                                justify-center shadow-lg flex-shrink-0`}
									>
										<span className="text-white text-3xl font-bold">
											{wallet.symbol}
										</span>
									</div>

									{/* Info */}
									<div className="flex-grow text-center md:text-left w-full">
										<div className="flex items-center gap-3 justify-center md:justify-start mb-4">
											<h3 className="text-2xl font-heading font-bold text-gray-900">
												{wallet.name}
											</h3>
											<span className="bg-white/80 px-3 py-1 rounded-full text-sm font-semibold text-gray-600 shadow-sm">
												{wallet.symbol}
											</span>
										</div>

										<div className="space-y-3">
											<p className="text-sm font-medium text-gray-500">
												Wallet Address
											</p>
											<div className="flex flex-col sm:flex-row gap-3">
												<div
													className="flex-grow bg-white rounded-xl border border-gray-200 
                                      px-4 py-3 shadow-sm"
												>
													<code className="text-sm text-gray-700 break-all font-mono">
														{wallet.address}
													</code>
												</div>
												<CopyButton
													text={wallet.address}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Thank You Card */}
					<div
						className="mt-12 relative overflow-hidden bg-gradient-to-br from-lego-dark to-gray-900 
                        rounded-2xl p-8 md:p-12 text-white text-center"
					>
						{/* Decorative */}
						<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lego-red via-lego-yellow to-lego-blue" />
						<div className="absolute -top-20 -right-20 w-40 h-40 bg-lego-yellow/10 rounded-full blur-2xl" />
						<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-lego-red/10 rounded-full blur-2xl" />

						<div className="relative z-10">
							<span className="text-5xl mb-6 block">🙏</span>
							<h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
								{t("thankYou")}
							</h2>
							<p className="text-gray-300 max-w-lg mx-auto leading-relaxed">
								{t("thankYouMessage")}
							</p>

							{/* Brick animation */}
							<div className="flex justify-center gap-2 mt-8">
								{["🧱", "🧱", "🧱"].map((brick, i) => (
									<span
										key={i}
										className="text-3xl animate-float"
										style={{
											animationDelay: `${i * 200}ms`,
										}}
									>
										{brick}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
