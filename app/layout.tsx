import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "MyBricksCreations - A Young Master Builder's Portfolio",
	description:
		"Explore amazing Lego creations from a young Master Builder. View the gallery of builds, read their stories, and support the creator.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
