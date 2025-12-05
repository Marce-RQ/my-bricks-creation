import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { locales, type Locale } from "@/i18n/config";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const nunito = Nunito({
	subsets: ["latin"],
	variable: "--font-nunito",
	display: "swap",
});

export const metadata: Metadata = {
	title: "MyBricksCreations - A Young Master Builder's Portfolio",
	description:
		"Explore amazing Lego creations from a young Master Builder. View the gallery of builds, read their stories, and support the creator.",
	keywords: ["Lego", "creations", "builds", "portfolio", "master builder"],
	openGraph: {
		title: "MyBricksCreations",
		description: "A Young Master Builder's Portfolio",
		type: "website",
		url: "https://mybrickscreations.com",
	},
};

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Validate locale
	if (!locales.includes(locale as Locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Get messages for the current locale
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${inter.variable} ${nunito.variable}`}>
			<body className="min-h-screen flex flex-col">
				<NextIntlClientProvider messages={messages}>
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 4000,
							success: {
								style: {
									background: "#ECFDF5",
									color: "#065F46",
									borderRadius: "8px",
									border: "1px solid #A7F3D0",
								},
								iconTheme: {
									primary: "#10B981",
									secondary: "#fff",
								},
							},
							error: {
								style: {
									background: "#FEF2F2",
									color: "#991B1B",
									borderRadius: "8px",
									border: "1px solid #FECACA",
								},
								iconTheme: {
									primary: "#DC2626",
									secondary: "#fff",
								},
							},
						}}
					/>
					<Header />
					<main className="flex-grow">{children}</main>
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
