import { z } from "zod";

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy to continue.",
    }),
    plan: z.enum(["boutique", "multichair", "group"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Clinic / Onboarding Schemas
// ============================================================================

export const clinicSetupSchema = z.object({
  name: z
    .string()
    .min(2, "Clinic name must be at least 2 characters")
    .max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode")
    .optional()
    .or(z.literal("")),
  timezone: z.string().default("Asia/Kolkata"),
  currency: z.string().default("INR"),
  lead_sources: z
    .array(
      z.enum([
        "google",
        "instagram",
        "facebook",
        "website",
        "whatsapp",
        "referral",
        "walk_in",
        "phone",
        "other",
      ])
    )
    .default(["phone", "walk_in", "whatsapp"]),
});

// ============================================================================
// Lead Schemas
// ============================================================================

export const leadCreateSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(200),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  source: z.enum([
    "google",
    "instagram",
    "facebook",
    "website",
    "whatsapp",
    "referral",
    "walk_in",
    "phone",
    "other",
  ]),
  source_detail: z.string().optional(),
  service_interest: z.string().optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  consent_whatsapp: z.boolean().default(true),
  consent_sms: z.boolean().default(false),
  consent_email: z.boolean().default(false),
});

export const leadUpdateSchema = leadCreateSchema.partial().extend({
  stage: z
    .enum([
      "new",
      "contacted",
      "interested",
      "appointment_booked",
      "attended",
      "treatment_proposed",
      "won",
      "lost",
    ])
    .optional(),
  lost_reason: z.string().optional(),
  opted_out: z.boolean().optional(),
});

// ============================================================================
// Follow-Up Task Schemas
// ============================================================================

export const taskCreateSchema = z.object({
  lead_id: z.string().uuid(),
  assigned_to: z.string().uuid().optional().nullable(),
  task_type: z.enum([
    "first_contact",
    "follow_up",
    "callback",
    "appointment_reminder",
    "reschedule",
    "treatment_follow_up",
    "general",
  ]),
  due_at: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const taskCompleteSchema = z.object({
  outcome: z.string().min(1, "Please describe the outcome").max(500),
});

// ============================================================================
// Appointment Schemas
// ============================================================================

export const appointmentCreateSchema = z.object({
  lead_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  booking_source: z.string().optional(),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum([
    "booked",
    "confirmed",
    "rescheduled",
    "attended",
    "missed",
    "cancelled",
  ]),
  outcome: z.string().optional(),
  rescheduled_to: z.string().datetime().optional(),
});

// ============================================================================
// Treatment Opportunity Schemas
// ============================================================================

export const opportunityCreateSchema = z.object({
  lead_id: z.string().uuid(),
  service_category: z.string().optional(),
  proposed_value: z.number().positive("Proposed value must be positive"),
});

export const opportunityUpdateSchema = z.object({
  status: z.enum([
    "proposed",
    "pending_decision",
    "accepted",
    "declined",
    "partially_collected",
    "collected",
  ]),
  accepted_value: z.number().nonnegative().optional().nullable(),
  collected_amount: z.number().nonnegative().optional(),
  loss_reason: z.string().optional(),
});

// ============================================================================
// Message Template Schemas
// ============================================================================

export const templateCreateSchema = z.object({
  name: z.string().min(1).max(100),
  body: z.string().min(1).max(1024),
  variables: z.array(z.string()).default([]),
  purpose: z.string().optional(),
});

// ============================================================================
// Invitation Schemas
// ============================================================================

export const invitationCreateSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["admin", "receptionist"]),
});

// ============================================================================
// Type Exports
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClinicSetupInput = z.infer<typeof clinicSetupSchema>;
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskCompleteInput = z.infer<typeof taskCompleteSchema>;
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type OpportunityCreateInput = z.infer<typeof opportunityCreateSchema>;
export type OpportunityUpdateInput = z.infer<typeof opportunityUpdateSchema>;
export type TemplateCreateInput = z.infer<typeof templateCreateSchema>;
export type InvitationCreateInput = z.infer<typeof invitationCreateSchema>;
