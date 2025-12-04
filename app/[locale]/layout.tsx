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
							style: {
								background: "#1F1F1F",
								color: "#fff",
								borderRadius: "8px",
							},
							success: {
								iconTheme: {
									primary: "#DA291C",
									secondary: "#fff",
								},
							},
							error: {
								iconTheme: {
									primary: "#DA291C",
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
