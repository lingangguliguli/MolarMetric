"use server";

import { createClient, getDbClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic, assertActiveWorkspace } from "@/lib/auth-context";
import {
  opportunityCreateSchema,
  opportunityUpdateSchema,
  type OpportunityCreateInput,
  type OpportunityUpdateInput,
} from "@/lib/validations";
import type { TreatmentOpportunity, OpportunityStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getTreatmentOpportunities(params: {
  status?: OpportunityStatus | "all";
}) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();
  const dbClient = getDbClient(supabase);

  let query = dbClient
    .from("treatment_opportunities")
    .select("id, clinic_id, lead_id, service_category, proposed_value, accepted_value, collected_amount, status, loss_reason, proposed_at, decided_at, created_at, updated_at, lead:leads(id, name, phone, stage)")
    .eq("clinic_id", clinic.id);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(200);

  if (error) {
    console.error("Error fetching opportunities:", error.message);
    return [];
  }

  return (data as unknown as TreatmentOpportunity[]) || [];
}

export async function createTreatmentOpportunity(input: OpportunityCreateInput) {
  const { clinic, user } = await getAuthenticatedClinic();
  const activeCheck = assertActiveWorkspace(clinic);
  if (!activeCheck.canWrite) {
    return { error: activeCheck.error };
  }

  const supabase = createClient();
  const dbClient = getDbClient(supabase);

  const parsed = opportunityCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid opportunity data" };
  }

  const { data: opportunity, error } = await dbClient
    .from("treatment_opportunities")
    .insert({
      clinic_id: clinic.id,
      lead_id: parsed.data.lead_id,
      service_category: parsed.data.service_category || "General Dentistry",
      proposed_value: parsed.data.proposed_value,
      status: "proposed",
      proposed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !opportunity) {
    console.error("Create treatment opportunity error:", error?.message);
    return { error: error?.message || "Failed to create treatment opportunity." };
  }

  // Update lead stage to treatment_proposed
  await dbClient
    .from("leads")
    .update({
      stage: "treatment_proposed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.lead_id)
    .eq("clinic_id", clinic.id);

  // Log timeline event
  try {
    await dbClient.from("lead_events").insert({
      clinic_id: clinic.id,
      lead_id: parsed.data.lead_id,
      event_type: "opportunity_created",
      actor_id: user.id,
      metadata: {
        opportunity_id: opportunity.id,
        proposed_value: opportunity.proposed_value,
        service_category: opportunity.service_category,
      },
    });

    // Schedule treatment follow up task
    const dueAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    await dbClient.from("follow_up_tasks").insert({
      clinic_id: clinic.id,
      lead_id: parsed.data.lead_id,
      assigned_to: user.id,
      task_type: "treatment_follow_up",
      due_at: dueAt,
      status: "pending",
      notes: `Follow up on proposed ${opportunity.service_category || "treatment"} plan acceptance.`,
    });
  } catch (secErr) {
    console.warn("Secondary treatment event logging error:", secErr);
  }

  revalidatePath("/treatments");
  revalidatePath(`/leads/${parsed.data.lead_id}`);
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/follow-ups");
  revalidatePath("/appointments");
  revalidatePath("/reports");

  return { success: true, opportunity: opportunity as TreatmentOpportunity };
}

export async function updateTreatmentOpportunity(
  id: string,
  input: OpportunityUpdateInput
) {
  const { clinic, user } = await getAuthenticatedClinic();
  const activeCheck = assertActiveWorkspace(clinic);
  if (!activeCheck.canWrite) {
    return { error: activeCheck.error };
  }

  const supabase = createClient();
  const dbClient = getDbClient(supabase);

  const parsed = opportunityUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid update data" };
  }

  const { data: currentOpp, error: fetchErr } = await dbClient
    .from("treatment_opportunities")
    .select("*, lead:leads(*)")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (fetchErr || !currentOpp) {
    return { error: "Opportunity not found." };
  }

  const updates: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.accepted_value !== undefined) {
    updates.accepted_value = parsed.data.accepted_value;
  }
  if (parsed.data.collected_amount !== undefined) {
    updates.collected_amount = parsed.data.collected_amount;
  }
  if (parsed.data.loss_reason !== undefined) {
    updates.loss_reason = parsed.data.loss_reason;
  }
  if (["accepted", "declined", "collected"].includes(parsed.data.status)) {
    updates.decided_at = new Date().toISOString();
  }

  const { error: updateErr } = await dbClient
    .from("treatment_opportunities")
    .update(updates)
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (updateErr) {
    return { error: "Failed to update opportunity." };
  }

  // If accepted or collected, transition lead stage to 'won'
  if (["accepted", "collected", "partially_collected"].includes(parsed.data.status)) {
    await dbClient
      .from("leads")
      .update({
        stage: "won",
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentOpp.lead_id)
      .eq("clinic_id", clinic.id);
  }

  // If declined, update lead if loss reason provided
  if (parsed.data.status === "declined") {
    await dbClient
      .from("leads")
      .update({
        stage: "lost",
        lost_reason: parsed.data.loss_reason || "Treatment declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentOpp.lead_id)
      .eq("clinic_id", clinic.id);
  }

  // Record timeline event
  try {
    await dbClient.from("lead_events").insert({
      clinic_id: clinic.id,
      lead_id: currentOpp.lead_id,
      event_type: "opportunity_updated",
      actor_id: user.id,
      metadata: {
        opportunity_id: id,
        new_status: parsed.data.status,
        collected_amount: parsed.data.collected_amount ?? currentOpp.collected_amount,
        loss_reason: parsed.data.loss_reason || null,
      },
    });
  } catch (secErr) {
    console.warn("Secondary treatment update event logging error:", secErr);
  }

  revalidatePath("/treatments");
  revalidatePath(`/leads/${currentOpp.lead_id}`);
  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/follow-ups");
  revalidatePath("/appointments");
  revalidatePath("/reports");

  return { success: true };
}
