import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on requests to refresh Supabase auth tokens and protect /admin routes.
 *
 * 1. Refreshes the auth session cookie so user logins do not expire mid-visit.
 * 2. Redirects unauthenticated users attempting to access /admin routes directly to /login.
 * 3. The admin layout additionally checks role permissions (admin/editor) on the server.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run application logic between createServerClient and getUser().
  // getUser() validates the token against the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static build assets)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (prospectus.pdf, images)
     */
    "/((?!_next/static|_next/image|favicon.ico|prospectus\\.pdf|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
