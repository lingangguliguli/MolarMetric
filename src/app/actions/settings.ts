"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { clinicSetupSchema } from "@/lib/validations";
import type { AuditEvent, Clinic } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getClinicSettings() {
  const { clinic, role } = await getAuthenticatedClinic();
  return { clinic, role };
}

export async function updateClinicSettings(data: {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  lead_sources?: string[];
}) {
  const { clinic, user, role } = await getAuthenticatedClinic();

  if (role !== "owner" && role !== "admin") {
    return { error: "Only clinic owners or administrators can update settings." };
  }

  const parsed = clinicSetupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid clinic data" };
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("clinics")
    .update({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      pincode: parsed.data.pincode || null,
      lead_sources: parsed.data.lead_sources,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clinic.id);

  if (error) {
    return { error: "Failed to update clinic settings." };
  }

  // Audit event
  await supabase.from("audit_events").insert({
    clinic_id: clinic.id,
    actor_id: user.id,
    event_type: "clinic_updated",
    metadata: {
      updated_fields: Object.keys(data),
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getAuditLogs(): Promise<AuditEvent[]> {
  const { clinic, role } = await getAuthenticatedClinic();
  if (role !== "owner" && role !== "admin") {
    return [];
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("audit_events")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as AuditEvent[]) || [];
}
