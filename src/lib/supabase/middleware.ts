import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { measureAsync } from "@/lib/perf";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/auth/confirm",
];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Exclude webhooks and health endpoints from session middleware
  if (pathname.startsWith("/api/webhooks/") || pathname.startsWith("/api/health")) {
    return NextResponse.next({ request });
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/auth/")
  );

  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      (c.name.startsWith("sb-") && c.name.includes("auth-token")) ||
      c.name === "sb-access-token" ||
      c.name === "sb-refresh-token"
  );

  // Fast path 1: Public route and no auth cookies present -> No session to refresh
  if (isPublicRoute && !hasAuthCookie) {
    return NextResponse.next({ request });
  }

  // Fast path 2: Protected route and completely missing auth cookies -> Redirect immediately
  if (!isPublicRoute && !hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Auth cookie is present — perform token verification and session refresh
  return await measureAsync("middleware:updateSession", async () => {
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
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
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

    // Refresh session — important for server components
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users on protected routes
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (user && ["/login", "/register"].includes(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }, 250);
}

