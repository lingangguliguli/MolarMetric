import { createClient } from "@/lib/supabase/server";
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

  // Get active membership with clinic details
  const { data: membership, error: memberError } = await supabase
    .from("clinic_memberships")
    .select("*, clinic:clinics(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (memberError || !membership || !membership.clinic) {
    redirect("/onboarding");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const userProfile: Profile = profile || {
    id: user.id,
    user_id: user.id,
    display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
    avatar_url: null,
    timezone: (membership.clinic as Clinic).timezone || "Asia/Kolkata",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    user,
    profile: userProfile,
    clinic: membership.clinic as Clinic,
    membership: membership as ClinicMembership,
    role: membership.role as UserRole,
  };
}
