import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PostForm from "@/components/PostForm";

export default async function NewPostPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("admin");

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/admin/login");
	}

	return (
		<div className="max-w-4xl mx-auto">
			<h1 className="text-3xl font-heading font-bold text-lego-dark mb-8">
				{t("createNewBuildTitle")}
			</h1>
			<PostForm />
		</div>
	);
}
