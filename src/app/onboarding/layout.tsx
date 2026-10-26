import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated, redirect to login
  if (!user) {
    redirect("/login");
  }

  // Use service client if available to bypass RLS
  let dbClient = supabase;
  if (
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here"
  ) {
    try {
      dbClient = createServiceClient();
    } catch {
      dbClient = supabase;
    }
  }

  // Check if user already has an active clinic workspace
  const { data: membership } = await dbClient
    .from("clinic_memberships")
    .select("id, clinic_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  // If user is already onboarded with a clinic, send straight to dashboard
  if (membership) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
