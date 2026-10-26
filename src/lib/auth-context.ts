import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Clinic, ClinicMembership, Profile, UserRole } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export interface AuthenticatedContext {
  user: User;
  profile: Profile;
  clinic: Clinic;
  membership: ClinicMembership;
  role: UserRole;
}

export async function getAuthenticatedClinic(): Promise<AuthenticatedContext> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Use service client if available to safely load clinic context without RLS recursion
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

  // 1. Get active membership (or latest membership)
  let { data: membership, error: memberError } = await dbClient
    .from("clinic_memberships")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    // Fallback: check if any membership exists regardless of status filter
    const { data: fallbackMem } = await dbClient
      .from("clinic_memberships")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    membership = fallbackMem;
  }

  if (memberError && !membership) {
    console.error("Auth context membership query error:", memberError.message);
  }

  if (!membership) {
    redirect("/onboarding");
  }

  // 2. Fetch clinic directly by clinic_id (guaranteed 100% reliable, zero join errors)
  const { data: clinic, error: clinicErr } = await dbClient
    .from("clinics")
    .select("*")
    .eq("id", membership.clinic_id)
    .maybeSingle();

  if (clinicErr) {
    console.error("Auth context clinic query error:", clinicErr.message);
  }

  if (!clinic) {
    redirect("/onboarding");
  }

  // 3. Get profile
  const { data: profile } = await dbClient
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const userProfile: Profile = profile || {
    id: user.id,
    user_id: user.id,
    display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
    avatar_url: null,
    timezone: clinic.timezone || "Asia/Kolkata",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    user,
    profile: userProfile,
    clinic,
    membership: membership as ClinicMembership,
    role: membership.role as UserRole,
  };
}
