"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { leadCreateSchema, leadUpdateSchema, type LeadCreateInput, type LeadUpdateInput } from "@/lib/validations";
import { normalizePhoneNumber, sanitizeCsvValue } from "@/lib/utils";
import type { Lead, LeadStage, LeadSource, PaginatedResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

function getDbClient(supabaseClient: any) {
  if (
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here"
  ) {
    try {
      return createServiceClient();
    } catch {
      return supabaseClient;
    }
  }
  return supabaseClient;
}

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
  const dbClient = getDbClient(supabase);

  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = dbClient
    .from("leads")
    .select("id, clinic_id, name, phone, email, stage, source, service_interest, estimated_value, assigned_to, first_contact_at, created_at, updated_at", { count: "exact" })
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
  const dbClient = getDbClient(supabase);

  const { data: lead, error: leadError } = await dbClient
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (leadError || !lead) {
    return null;
  }

  // Fetch timeline events, tasks, appointments, and treatment opportunities concurrently
  const [eventsRes, tasksRes, apptsRes, oppsRes] = await Promise.all([
    dbClient
      .from("lead_events")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
    dbClient
      .from("follow_up_tasks")
      .select("*")
      .eq("lead_id", id)
      .order("due_at", { ascending: true })
      .limit(100),
    supabase
      .from("appointments")
      .select("*")
      .eq("lead_id", id)
      .order("scheduled_at", { ascending: false })
      .limit(50),
    supabase
      .from("treatment_opportunities")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return {
    lead: lead as Lead,
    events: eventsRes.data || [],
    tasks: tasksRes.data || [],
    appointments: apptsRes.data || [],
    opportunities: oppsRes.data || [],
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
  try {
    const { clinic, user } = await getAuthenticatedClinic();
    const supabase = createClient();
    const dbClient = getDbClient(supabase);

    const parsed = leadCreateSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message || "Invalid input data" };
    }

    const normalizedPhone = normalizePhoneNumber(parsed.data.phone);

    // Check for duplicate phone in same clinic
    const { data: existing } = await dbClient
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

    const leadId = crypto.randomUUID();
    const newLeadData = {
      id: leadId,
      clinic_id: clinic.id,
      name: parsed.data.name,
      phone: normalizedPhone,
      email: parsed.data.email || null,
      source: parsed.data.source,
      source_detail: parsed.data.source_detail || null,
      service_interest: parsed.data.service_interest || null,
      assigned_to: parsed.data.assigned_to || user.id,
      stage: "new" as const,
      consent_whatsapp: parsed.data.consent_whatsapp ?? true,
      consent_sms: parsed.data.consent_sms ?? false,
      consent_email: parsed.data.consent_email ?? false,
    };

    const { error: insertError } = await dbClient
      .from("leads")
      .insert(newLeadData);

    if (insertError) {
      console.error("Failed to create lead:", insertError.message);
      return { error: `Failed to create lead enquiry: ${insertError.message}` };
    }

    // Log timeline creation event (safe secondary action)
    try {
      await dbClient.from("lead_events").insert({
        clinic_id: clinic.id,
        lead_id: leadId,
        event_type: "created",
        actor_id: user.id,
        metadata: {
          source: parsed.data.source,
          service_interest: parsed.data.service_interest,
        },
      });

      // Automatically schedule initial contact follow-up task
      const dueAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      await dbClient.from("follow_up_tasks").insert({
        clinic_id: clinic.id,
        lead_id: leadId,
        assigned_to: newLeadData.assigned_to,
        task_type: "first_contact",
        due_at: dueAt,
        status: "pending",
        notes: `Initial enquiry follow-up regarding ${newLeadData.service_interest || "consultation"}.`,
      });
    } catch (secErr) {
      console.warn("Secondary lead event logging warning:", secErr);
    }

    try {
      revalidatePath("/leads");
      revalidatePath("/dashboard");
      revalidatePath("/follow-ups");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return { success: true, lead: newLeadData as unknown as Lead };
  } catch (err: any) {
    console.error("createLead unexpected error:", err);
    return { error: err?.message || "An unexpected error occurred while saving enquiry." };
  }
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
    .select("*")
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

export async function deleteLead(id: string) {
  const { clinic, user, role } = await getAuthenticatedClinic();

  // STRICT AUTHORIZATION: Only clinic Owner or Admin can delete enquiries.
  // Receptionists and staff members CANNOT delete patient enquiries.
  if (role !== "owner" && role !== "admin") {
    return { error: "Access denied. Only the clinic owner or administrator can delete patient enquiries." };
  }

  const supabase = createClient();
  const dbClient = getDbClient(supabase);

  // 1. Verify lead exists and belongs to this clinic
  const { data: lead, error: fetchErr } = await dbClient
    .from("leads")
    .select("id, name, phone")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (fetchErr || !lead) {
    return { error: "Patient enquiry not found or already removed." };
  }

  // 2. Delete lead (foreign keys in child tables have ON DELETE CASCADE)
  const { error: deleteErr } = await dbClient
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (deleteErr) {
    console.error("Delete lead database error:", deleteErr.message);
    return { error: "Failed to delete patient enquiry." };
  }

  // 3. Record tamper-evident audit event
  try {
    await dbClient.from("audit_events").insert({
      clinic_id: clinic.id,
      actor_id: user.id,
      event_type: "lead_deleted",
      metadata: {
        deleted_lead_id: id,
        patient_name: lead.name,
        patient_phone: lead.phone,
        deleted_by_role: role,
      },
    });
  } catch (auditErr) {
    console.warn("Audit logging non-blocking error:", auditErr);
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/follow-ups");
  revalidatePath("/appointments");
  revalidatePath("/treatments");

  return { success: true };
}
