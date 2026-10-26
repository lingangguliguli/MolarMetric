"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { leadCreateSchema, leadUpdateSchema, type LeadCreateInput, type LeadUpdateInput } from "@/lib/validations";
import { normalizePhoneNumber, sanitizeCsvValue } from "@/lib/utils";
import type { Lead, LeadStage, LeadSource, PaginatedResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface GetLeadsParams {
  stage?: LeadStage | "all";
  source?: LeadSource | "all";
  search?: string;
  assignedTo?: string | "all";
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getLeads(params: GetLeadsParams = {}): Promise<PaginatedResult<Lead>> {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select("*, assigned_profile:profiles!leads_assigned_to_fkey(*)", { count: "exact" })
    .eq("clinic_id", clinic.id)
    .eq("archived", false);

  if (params.stage && params.stage !== "all") {
    query = query.eq("stage", params.stage);
  }

  if (params.source && params.source !== "all") {
    query = query.eq("source", params.source);
  }

  if (params.assignedTo && params.assignedTo !== "all") {
    query = query.eq("assigned_to", params.assignedTo);
  }

  if (params.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    query = query.or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`);
  }

  const sortBy = params.sortBy || "created_at";
  const ascending = params.sortOrder === "asc";
  query = query.order(sortBy, { ascending }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching leads:", error.message);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count || 0;
  return {
    data: (data as Lead[]) || [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getLeadById(id: string) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*, assigned_profile:profiles!leads_assigned_to_fkey(*)")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (leadError || !lead) {
    return null;
  }

  // Fetch timeline events
  const { data: events } = await supabase
    .from("lead_events")
    .select("*, actor_profile:profiles!lead_events_actor_id_fkey(*)")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  // Fetch follow up tasks
  const { data: tasks } = await supabase
    .from("follow_up_tasks")
    .select("*, assigned_profile:profiles!follow_up_tasks_assigned_to_fkey(*)")
    .eq("lead_id", id)
    .order("due_at", { ascending: true });

  // Fetch appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("lead_id", id)
    .order("scheduled_at", { ascending: false });

  // Fetch treatment opportunities
  const { data: opportunities } = await supabase
    .from("treatment_opportunities")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return {
    lead: lead as Lead,
    events: events || [],
    tasks: tasks || [],
    appointments: appointments || [],
    opportunities: opportunities || [],
  };
}

export async function checkDuplicatePhone(phone: string): Promise<{ exists: boolean; leadId?: string; leadName?: string }> {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();
  const normalized = normalizePhoneNumber(phone);

  const { data } = await supabase
    .from("leads")
    .select("id, name")
    .eq("clinic_id", clinic.id)
    .eq("phone", normalized)
    .eq("archived", false)
    .maybeSingle();

  if (data) {
    return { exists: true, leadId: data.id, leadName: data.name };
  }
  return { exists: false };
}

export async function createLead(input: LeadCreateInput) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const parsed = leadCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input data" };
  }

  const normalizedPhone = normalizePhoneNumber(parsed.data.phone);

  // Check for duplicate phone in same clinic
  const { data: existing } = await supabase
    .from("leads")
    .select("id, name")
    .eq("clinic_id", clinic.id)
    .eq("phone", normalizedPhone)
    .eq("archived", false)
    .maybeSingle();

  if (existing) {
    return {
      error: `An enquiry with this phone number already exists for patient "${existing.name}".`,
      leadId: existing.id,
    };
  }

  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      clinic_id: clinic.id,
      name: parsed.data.name,
      phone: normalizedPhone,
      email: parsed.data.email || null,
      source: parsed.data.source,
      source_detail: parsed.data.source_detail || null,
      service_interest: parsed.data.service_interest || null,
      assigned_to: parsed.data.assigned_to || user.id,
      stage: "new",
      consent_whatsapp: parsed.data.consent_whatsapp ?? true,
      consent_sms: parsed.data.consent_sms ?? false,
      consent_email: parsed.data.consent_email ?? false,
    })
    .select("*")
    .single();

  if (insertError || !lead) {
    console.error("Failed to create lead:", insertError?.message);
    return { error: "Failed to create lead enquiry." };
  }

  // Log timeline creation event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: lead.id,
    event_type: "created",
    actor_id: user.id,
    metadata: {
      source: lead.source,
      service_interest: lead.service_interest,
    },
  });

  // Automatically schedule initial contact follow-up task (due in 2 hours during day, or next morning)
  const dueAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  await supabase.from("follow_up_tasks").insert({
    clinic_id: clinic.id,
    lead_id: lead.id,
    assigned_to: lead.assigned_to,
    task_type: "first_contact",
    due_at: dueAt,
    status: "pending",
    notes: `Initial enquiry follow-up regarding ${lead.service_interest || "consultation"}.`,
  });

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/follow-ups");

  return { success: true, lead: lead as Lead };
}

export async function updateLead(id: string, input: LeadUpdateInput) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const parsed = leadUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.phone !== undefined) updateData.phone = normalizePhoneNumber(parsed.data.phone);
  if (parsed.data.email !== undefined) updateData.email = parsed.data.email || null;
  if (parsed.data.source !== undefined) updateData.source = parsed.data.source;
  if (parsed.data.source_detail !== undefined) updateData.source_detail = parsed.data.source_detail;
  if (parsed.data.service_interest !== undefined) updateData.service_interest = parsed.data.service_interest;
  if (parsed.data.assigned_to !== undefined) updateData.assigned_to = parsed.data.assigned_to;
  if (parsed.data.consent_whatsapp !== undefined) updateData.consent_whatsapp = parsed.data.consent_whatsapp;
  if (parsed.data.opted_out !== undefined) updateData.opted_out = parsed.data.opted_out;

  const { error: updateError } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (updateError) {
    return { error: "Failed to update lead." };
  }

  // Log event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: id,
    event_type: "preference_updated",
    actor_id: user.id,
    metadata: updateData,
  });

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");

  return { success: true };
}

export async function transitionLeadStage(
  id: string,
  newStage: LeadStage,
  lossReason?: string
) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  // Get current stage
  const { data: currentLead } = await supabase
    .from("leads")
    .select("stage, first_contact_at, name")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (!currentLead) {
    return { error: "Lead not found." };
  }

  const updates: Record<string, unknown> = {
    stage: newStage,
    updated_at: new Date().toISOString(),
  };

  if (!currentLead.first_contact_at && newStage !== "new") {
    updates.first_contact_at = new Date().toISOString();
  }

  if (newStage === "lost") {
    updates.lost_reason = lossReason || "Not specified";
  }

  const { error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (error) {
    return { error: "Failed to update pipeline stage." };
  }

  // Record audit timeline event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: id,
    event_type: "stage_changed",
    actor_id: user.id,
    metadata: {
      from_stage: currentLead.stage,
      to_stage: newStage,
      reason: lossReason || null,
    },
  });

  // Automatically generate task if stage requires follow up
  if (newStage === "treatment_proposed") {
    const dueAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    await supabase.from("follow_up_tasks").insert({
      clinic_id: clinic.id,
      lead_id: id,
      assigned_to: user.id,
      task_type: "treatment_follow_up",
      due_at: dueAt,
      status: "pending",
      notes: "Follow up on proposed treatment plan acceptance.",
    });
  }

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/follow-ups");

  return { success: true };
}

export async function addLeadNote(leadId: string, noteText: string) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  if (!noteText.trim()) {
    return { error: "Note cannot be empty." };
  }

  const { error } = await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: leadId,
    event_type: "note_added",
    actor_id: user.id,
    metadata: {
      note: noteText.trim(),
    },
  });

  if (error) {
    return { error: "Failed to add note." };
  }

  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}

export async function exportLeadsCSV(): Promise<string> {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*, assigned_profile:profiles!leads_assigned_to_fkey(display_name)")
    .eq("clinic_id", clinic.id)
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error || !leads) {
    throw new Error("Failed to export leads.");
  }

  // Audit event for data export
  await supabase.from("audit_events").insert({
    clinic_id: clinic.id,
    actor_id: user.id,
    event_type: "data_exported",
    metadata: {
      entity: "leads",
      count: leads.length,
    },
  });

  const headers = [
    "Patient Name",
    "Phone",
    "Email",
    "Source",
    "Service Interest",
    "Stage",
    "Assigned To",
    "First Contact",
    "Created Date",
  ];

  const rows = leads.map((l) => [
    sanitizeCsvValue(l.name),
    sanitizeCsvValue(l.phone),
    sanitizeCsvValue(l.email || ""),
    sanitizeCsvValue(l.source),
    sanitizeCsvValue(l.service_interest || ""),
    sanitizeCsvValue(l.stage),
    sanitizeCsvValue(l.assigned_profile?.display_name || "Unassigned"),
    sanitizeCsvValue(l.first_contact_at ? new Date(l.first_contact_at).toLocaleDateString() : "Pending"),
    sanitizeCsvValue(new Date(l.created_at).toLocaleDateString()),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
