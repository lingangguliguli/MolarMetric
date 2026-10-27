"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic, assertActiveWorkspace } from "@/lib/auth-context";
import {
  appointmentCreateSchema,
  appointmentUpdateSchema,
  type AppointmentCreateInput,
  type AppointmentUpdateInput,
} from "@/lib/validations";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getAppointments(params: {
  status?: AppointmentStatus | "all";
  fromDate?: string;
  toDate?: string;
}) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  let query = supabase
    .from("appointments")
    .select("id, clinic_id, lead_id, scheduled_at, duration_minutes, status, booking_source, notes, created_at, lead:leads(id, name, phone, stage, service_interest)")
    .eq("clinic_id", clinic.id);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.fromDate) {
    query = query.gte("scheduled_at", params.fromDate);
  }

  if (params.toDate) {
    query = query.lte("scheduled_at", params.toDate);
  }

  const { data, error } = await query.order("scheduled_at", { ascending: true }).limit(200);

  if (error) {
    console.error("Error fetching appointments:", error.message);
    return [];
  }

  return (data as unknown as Appointment[]) || [];
}

export async function createAppointment(input: AppointmentCreateInput) {
  const { clinic, user } = await getAuthenticatedClinic();
  const activeCheck = assertActiveWorkspace(clinic);
  if (!activeCheck.canWrite) {
    return { error: activeCheck.error };
  }

  const supabase = createClient();

  const parsed = appointmentCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid appointment data" };
  }

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      clinic_id: clinic.id,
      lead_id: parsed.data.lead_id,
      scheduled_at: parsed.data.scheduled_at,
      status: "booked",
      booking_source: parsed.data.booking_source || "reception",
    })
    .select("*")
    .single();

  if (error || !appointment) {
    return { error: "Failed to create appointment." };
  }

  // Update lead stage to appointment_booked
  await supabase
    .from("leads")
    .update({
      stage: "appointment_booked",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.lead_id);

  // Log timeline event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: parsed.data.lead_id,
    event_type: "appointment_booked",
    actor_id: user.id,
    metadata: {
      appointment_id: appointment.id,
      scheduled_at: appointment.scheduled_at,
    },
  });

  // Schedule an appointment reminder task 24 hours prior to appointment
  const scheduledTime = new Date(parsed.data.scheduled_at).getTime();
  const reminderTime = new Date(Math.max(Date.now(), scheduledTime - 24 * 60 * 60 * 1000)).toISOString();

  await supabase.from("follow_up_tasks").insert({
    clinic_id: clinic.id,
    lead_id: parsed.data.lead_id,
    assigned_to: user.id,
    task_type: "appointment_reminder",
    due_at: reminderTime,
    status: "pending",
    notes: `Confirm appointment scheduled for ${new Date(parsed.data.scheduled_at).toLocaleString("en-IN")}.`,
  });

  revalidatePath("/appointments");
  revalidatePath(`/leads/${parsed.data.lead_id}`);
  revalidatePath("/dashboard");

  return { success: true, appointment: appointment as Appointment };
}

export async function updateAppointmentStatus(
  id: string,
  input: AppointmentUpdateInput
) {
  const { clinic, user } = await getAuthenticatedClinic();
  const activeCheck = assertActiveWorkspace(clinic);
  if (!activeCheck.canWrite) {
    return { error: activeCheck.error };
  }

  const supabase = createClient();

  const parsed = appointmentUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid status update" };
  }

  const { data: currentAppointment, error: fetchErr } = await supabase
    .from("appointments")
    .select("*, lead:leads(*)")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .single();

  if (fetchErr || !currentAppointment) {
    return { error: "Appointment not found." };
  }

  const updates: Record<string, unknown> = {
    status: parsed.data.status,
    outcome: parsed.data.outcome || null,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.rescheduled_to) {
    updates.scheduled_at = parsed.data.rescheduled_to;
    updates.rescheduled_from = currentAppointment.scheduled_at;
  }

  const { error: updateErr } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id);

  if (updateErr) {
    return { error: "Failed to update appointment status." };
  }

  // If attended, update lead stage to attended
  if (parsed.data.status === "attended") {
    await supabase
      .from("leads")
      .update({
        stage: "attended",
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentAppointment.lead_id);
  }

  // Record appointment outcome event in lead timeline
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: currentAppointment.lead_id,
    event_type: "appointment_outcome",
    actor_id: user.id,
    metadata: {
      appointment_id: id,
      new_status: parsed.data.status,
      outcome: parsed.data.outcome || null,
    },
  });

  revalidatePath("/appointments");
  revalidatePath(`/leads/${currentAppointment.lead_id}`);
  revalidatePath("/dashboard");

  return { success: true };
}
