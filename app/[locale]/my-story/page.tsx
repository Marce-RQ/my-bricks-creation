import { setRequestLocale } from "next-intl/server";
import UnderConstruction from "@/components/UnderConstruction";

export default async function QuienSoyPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="container mx-auto px-4 py-8">
			<UnderConstruction />
		</div>
	);
}
