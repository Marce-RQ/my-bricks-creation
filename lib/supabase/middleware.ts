import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const removeLocaleFromPath = (path: string) => {
	const { locales } = routing;
	const regex = new RegExp(`^/(${locales.join("|")})`);
	return path.replace(regex, "");
};

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: "",
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const cleanPathname = removeLocaleFromPath(request.nextUrl.pathname);

	// Protect admin routes (except the login page)
	if (
		cleanPathname.startsWith("/admin") &&
		cleanPathname !== "/admin/login"
	) {
		if (!user) {
			const loginUrl = new URL("/admin/login", request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Redirect logged-in users away from login page
	if (cleanPathname === "/admin/login" && user) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}

	return response;
}
