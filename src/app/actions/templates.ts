"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { templateCreateSchema, type TemplateCreateInput } from "@/lib/validations";
import { generateWhatsAppUrl } from "@/lib/utils";
import type { MessageTemplate } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getMessageTemplates(): Promise<MessageTemplate[]> {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("message_templates")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching templates:", error.message);
    return [];
  }

  return (data as MessageTemplate[]) || [];
}

export async function createMessageTemplate(input: TemplateCreateInput) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const parsed = templateCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid template data" };
  }

  // Extract variables from body if not supplied
  const detectedVariables = Array.from(
    parsed.data.body.matchAll(/\{\{([^}]+)\}\}/g)
  ).map((m) => m[1].trim());

  const variables = Array.from(new Set([...(parsed.data.variables || []), ...detectedVariables]));

  const { data: template, error } = await supabase
    .from("message_templates")
    .insert({
      clinic_id: clinic.id,
      name: parsed.data.name,
      body: parsed.data.body,
      variables,
      purpose: parsed.data.purpose || null,
      active: true,
    })
    .select("*")
    .single();

  if (error || !template) {
    return { error: "Failed to create template." };
  }

  revalidatePath("/templates");
  return { success: true, template: template as MessageTemplate };
}

export async function updateMessageTemplate(
  id: string,
  input: Partial<TemplateCreateInput> & { active?: boolean }
) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name) updates.name = input.name;
  if (input.purpose !== undefined) updates.purpose = input.purpose;
  if (input.active !== undefined) updates.active = input.active;
  if (input.body) {
    updates.body = input.body;
    const detected = Array.from(input.body.matchAll(/\{\{([^}]+)\}\}/g)).map((m) => m[1].trim());
    updates.variables = Array.from(new Set(detected));
  }

  const { error } = await supabase
    .from("message_templates")
    .update(updates)
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (error) {
    return { error: "Failed to update template." };
  }

  revalidatePath("/templates");
  return { success: true };
}

export async function deleteMessageTemplate(id: string) {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const { error } = await supabase
    .from("message_templates")
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinic.id);

  if (error) {
    return { error: "Failed to delete template." };
  }

  revalidatePath("/templates");
  return { success: true };
}

export async function generateWhatsAppDraft(
  templateId: string,
  leadId: string,
  customVars: Record<string, string> = {}
) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const [{ data: template }, { data: lead }] = await Promise.all([
    supabase.from("message_templates").select("*").eq("id", templateId).eq("clinic_id", clinic.id).single(),
    supabase.from("leads").select("*").eq("id", leadId).eq("clinic_id", clinic.id).single(),
  ]);

  if (!template || !lead) {
    return { error: "Template or patient enquiry not found." };
  }

  const replacements: Record<string, string> = {
    patient_name: lead.name,
    clinic_name: clinic.name,
    service_interest: lead.service_interest || "dental consultation",
    clinic_phone: clinic.phone || "",
    ...customVars,
  };

  let renderedBody = template.body;
  Object.entries(replacements).forEach(([key, val]) => {
    renderedBody = renderedBody.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val);
  });

  const whatsappUrl = generateWhatsAppUrl(lead.phone, renderedBody);

  // Record audit timeline event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: lead.id,
    event_type: "whatsapp_draft_prepared",
    actor_id: user.id,
    metadata: {
      template_id: templateId,
      template_name: template.name,
      message_preview: renderedBody.slice(0, 100),
    },
  });

  return {
    success: true,
    renderedBody,
    whatsappUrl,
    phone: lead.phone,
    patientName: lead.name,
  };
}
