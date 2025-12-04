import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import { setRequestLocale } from "next-intl/server";

export default async function AdminLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// This layout is only for authenticated pages, not login
	// The middleware handles the redirect

	return (
		<div className="min-h-screen bg-lego-bg">
			{user && <AdminNav />}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</div>
		</div>
	);
}
