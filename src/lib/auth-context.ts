import { cache } from "react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Clinic, ClinicMembership, Profile, UserRole } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { measureAsync } from "@/lib/perf";

export interface AuthenticatedContext {
  user: User;
  profile: Profile;
  clinic: Clinic;
  membership: ClinicMembership;
  role: UserRole;
}

/**
 * Request-scoped memoized authentication and clinic context resolver.
 * Wrapped with React `cache` so multiple server components and actions
 * within the same request lifecycle share a single database lookup.
 */
export const getAuthenticatedClinic = cache(async (): Promise<AuthenticatedContext> => {
  return await measureAsync("auth:getAuthenticatedClinic", async () => {
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

    // 1. Fetch strictly ACTIVE membership (SECURITY FIX: Inactive or removed memberships must NEVER produce an authenticated clinic context)
    const { data: membership, error: memberError } = await dbClient
      .from("clinic_memberships")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (memberError) {
      console.error("Auth context membership query error:", memberError.message);
    }

    // If no active authorized membership exists, redirect to onboarding or access-denied
    if (!membership || membership.status !== "active") {
      redirect("/onboarding");
    }

    // 2. Fetch clinic and profile concurrently to save a network roundtrip
    const [clinicResult, profileResult] = await Promise.all([
      dbClient
        .from("clinics")
        .select("*")
        .eq("id", membership.clinic_id)
        .maybeSingle(),
      dbClient
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const clinic = clinicResult.data;
    if (clinicResult.error) {
      console.error("Auth context clinic query error:", clinicResult.error.message);
    }

    if (!clinic) {
      redirect("/onboarding");
    }

    const profile = profileResult.data;
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
  }, 200);
});
