import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has an existing clinic membership; if not, go to onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: membership } = await supabase
          .from("clinic_memberships")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!membership && next !== "/reset-password") {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(
    new URL("/login?error=Invalid or expired confirmation link", request.url)
  );
}
