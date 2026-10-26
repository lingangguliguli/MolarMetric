// ============================================================================
// Domain Types for Dental Revenue Recovery OS
// ============================================================================

export type UserRole = "owner" | "admin" | "receptionist";

export type MembershipStatus = "active" | "inactive" | "removed";

export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export type LeadStage =
  | "new"
  | "contacted"
  | "interested"
  | "appointment_booked"
  | "attended"
  | "treatment_proposed"
  | "won"
  | "lost";

export type LeadSource =
  | "google"
  | "instagram"
  | "facebook"
  | "website"
  | "whatsapp"
  | "referral"
  | "walk_in"
  | "phone"
  | "other";

export type TaskType =
  | "first_contact"
  | "follow_up"
  | "callback"
  | "appointment_reminder"
  | "reschedule"
  | "treatment_follow_up"
  | "general";

export type TaskStatus = "pending" | "completed" | "cancelled" | "overdue";

export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "rescheduled"
  | "attended"
  | "missed"
  | "cancelled";

export type OpportunityStatus =
  | "proposed"
  | "pending_decision"
  | "accepted"
  | "declined"
  | "partially_collected"
  | "collected";

export type LeadEventType =
  | "created"
  | "stage_changed"
  | "assigned"
  | "contact_attempted"
  | "follow_up_scheduled"
  | "follow_up_completed"
  | "follow_up_rescheduled"
  | "appointment_booked"
  | "appointment_outcome"
  | "opportunity_created"
  | "opportunity_updated"
  | "note_added"
  | "preference_updated"
  | "whatsapp_draft_prepared";

export type AuditEventType =
  | "invitation_created"
  | "invitation_accepted"
  | "role_changed"
  | "member_removed"
  | "data_exported"
  | "settings_changed"
  | "lead_deleted"
  | "clinic_updated"
  | "ownership_transferred";

// ============================================================================
// Database Row Types
// ============================================================================

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  timezone: string;
  currency: string;
  lead_sources: LeadSource[];
  onboarding_completed: boolean;
  subscription_tier?: string;
  subscription_status?: "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "expired";
  trial_ends_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface ClinicMembership {
  id: string;
  clinic_id: string;
  user_id: string;
  role: UserRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  clinic?: Clinic;
  profile?: Profile;
}

export interface Lead {
  id: string;
  clinic_id: string;
  name: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  source_detail: string | null;
  service_interest: string | null;
  assigned_to: string | null;
  stage: LeadStage;
  first_contact_at: string | null;
  consent_whatsapp: boolean;
  consent_sms: boolean;
  consent_email: boolean;
  opted_out: boolean;
  lost_reason: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  assigned_profile?: Profile;
}

export interface FollowUpTask {
  id: string;
  clinic_id: string;
  lead_id: string;
  assigned_to: string | null;
  task_type: TaskType;
  due_at: string;
  status: TaskStatus;
  completed_at: string | null;
  outcome: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
  assigned_profile?: Profile;
}

export interface LeadEvent {
  id: string;
  clinic_id: string;
  lead_id: string;
  event_type: LeadEventType;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  // Joined
  actor_profile?: Profile;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  lead_id: string;
  scheduled_at: string;
  status: AppointmentStatus;
  booking_source: string | null;
  outcome: string | null;
  rescheduled_from: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
}

export interface TreatmentOpportunity {
  id: string;
  clinic_id: string;
  lead_id: string;
  service_category: string | null;
  proposed_value: number;
  accepted_value: number | null;
  collected_amount: number;
  status: OpportunityStatus;
  proposed_at: string;
  decided_at: string | null;
  loss_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
}

export interface Campaign {
  id: string;
  clinic_id: string;
  name: string;
  source: LeadSource;
  external_id: string | null;
  start_date: string | null;
  end_date: string | null;
  spend: number | null;
  spend_is_estimated: boolean;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  clinic_id: string;
  name: string;
  body: string;
  variables: string[];
  purpose: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  clinic_id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  status: InvitationStatus;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  // Joined
  clinic?: Clinic;
}

export interface AuditEvent {
  id: string;
  clinic_id: string;
  actor_id: string | null;
  event_type: AuditEventType;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DailyMotivation {
  id: number;
  message: string;
  category: string;
}

export interface DailyMotivationRecord {
  id: string;
  user_id: string;
  local_date: string; // YYYY-MM-DD
  message_id: number;
  displayed_at: string;
  dismissed_at: string | null;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardKPIs {
  newEnquiries: number;
  avgFirstResponseMinutes: number | null;
  awaitingFirstContact: number;
  overdueFollowUps: number;
  appointmentsBooked: number;
  appointmentsAttended: number;
  bookingConversionRate: number;
  attendanceRate: number;
  treatmentAcceptanceRate: number;
  acceptedOpportunityValue: number;
  totalCollections: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
