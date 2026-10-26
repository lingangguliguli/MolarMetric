"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { invitationCreateSchema, type InvitationCreateInput } from "@/lib/validations";
import type { ClinicMembership, Invitation, UserRole } from "@/lib/types";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getTeamMembers() {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const [{ data: rawMembers }, { data: invitations }] = await Promise.all([
    supabase
      .from("clinic_memberships")
      .select("*")
      .eq("clinic_id", clinic.id)
      .neq("status", "removed")
      .order("created_at", { ascending: true }),
    supabase
      .from("invitations")
      .select("*")
      .eq("clinic_id", clinic.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  const userIds = (rawMembers || []).map((m) => m.user_id);
  const { data: profiles } = userIds.length > 0
    ? await supabase.from("profiles").select("*").in("user_id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
  const members = (rawMembers || []).map((m: any) => ({
    ...m,
    profile: profileMap.get(m.user_id) || {
      id: m.user_id,
      user_id: m.user_id,
      display_name: "Staff Member",
      avatar_url: null,
      timezone: "Asia/Kolkata",
      created_at: m.created_at,
      updated_at: m.updated_at,
    },
  }));

  return {
    members: (members as ClinicMembership[]) || [],
    pendingInvitations: (invitations as Invitation[]) || [],
  };
}

export async function inviteTeamMember(input: InvitationCreateInput) {
  const { clinic, user, role } = await getAuthenticatedClinic();

  if (role !== "owner" && role !== "admin") {
    return { error: "Only clinic owners or administrators can invite team members." };
  }

  const supabase = createClient();
  const parsed = invitationCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid invitation input" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      clinic_id: clinic.id,
      email: parsed.data.email.toLowerCase().trim(),
      role: parsed.data.role,
      invited_by: user.id,
      token,
      expires_at: expiresAt,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !invitation) {
    return { error: "Failed to create invitation. Member may already have a pending invite." };
  }

  // Audit event
  await supabase.from("audit_events").insert({
    clinic_id: clinic.id,
    actor_id: user.id,
    event_type: "invitation_created",
    metadata: {
      invited_email: parsed.data.email,
      role: parsed.data.role,
    },
  });

  revalidatePath("/team");
  return { success: true, invitation: invitation as Invitation };
}

export async function updateMemberRole(membershipId: string, newRole: UserRole) {
  const { clinic, user, role } = await getAuthenticatedClinic();

  if (role !== "owner") {
    return { error: "Only the clinic owner can change staff roles." };
  }

  const supabase = createClient();

  const { data: targetMember } = await supabase
    .from("clinic_memberships")
    .select("user_id, role")
    .eq("id", membershipId)
    .eq("clinic_id", clinic.id)
    .single();

  if (!targetMember) {
    return { error: "Team member not found." };
  }

  if (targetMember.role === "owner") {
    return { error: "The primary clinic owner role cannot be changed directly." };
  }

  const { error } = await supabase
    .from("clinic_memberships")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", membershipId);

  if (error) {
    return { error: "Failed to update role." };
  }

  await supabase.from("audit_events").insert({
    clinic_id: clinic.id,
    actor_id: user.id,
    event_type: "role_changed",
    metadata: {
      target_user_id: targetMember.user_id,
      old_role: targetMember.role,
      new_role: newRole,
    },
  });

  revalidatePath("/team");
  return { success: true };
}

export async function removeTeamMember(membershipId: string) {
  const { clinic, user, role } = await getAuthenticatedClinic();

  if (role !== "owner" && role !== "admin") {
    return { error: "Unauthorized to remove team members." };
  }

  const supabase = createClient();

  const { data: targetMember } = await supabase
    .from("clinic_memberships")
    .select("user_id, role")
    .eq("id", membershipId)
    .eq("clinic_id", clinic.id)
    .single();

  if (!targetMember) {
    return { error: "Member not found." };
  }

  if (targetMember.role === "owner") {
    return { error: "The clinic owner cannot be removed." };
  }

  const { error } = await supabase
    .from("clinic_memberships")
    .update({ status: "removed", updated_at: new Date().toISOString() })
    .eq("id", membershipId);

  if (error) {
    return { error: "Failed to remove member." };
  }

  await supabase.from("audit_events").insert({
    clinic_id: clinic.id,
    actor_id: user.id,
    event_type: "member_removed",
    metadata: {
      target_user_id: targetMember.user_id,
      role: targetMember.role,
    },
  });

  revalidatePath("/team");
  return { success: true };
}
