import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function UnderConstruction() {
	const t = await getTranslations("underConstruction");

	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
			<div className="mb-8">
				<Image
					src="/images/under-construction.png"
					alt="Under Construction"
					width={374}
					height={374}
					className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[374px] xl:h-[374px]"
				/>
			</div>
			<h1 className="text-4xl font-heading font-bold text-lego-dark mb-4">
				{t("title")}
			</h1>
			<p className="text-lg text-gray-600 max-w-md">{t("message")}</p>
		</div>
	);
}
