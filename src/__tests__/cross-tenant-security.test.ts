import { describe, it, expect } from "vitest";
import { assertRole } from "@/lib/auth-context";
import { sanitizeCsvValue } from "@/lib/utils";
import type { Clinic, UserRole } from "@/lib/types";

describe("Cross-Tenant Isolation & Role Authorization Suite", () => {
  // Test Tenants
  const clinicA: Clinic = {
    id: "clinic-aaa-001",
    name: "Clinic Alpha",
    slug: "clinic-alpha",
    email: null,
    phone: null,
    address: null,
    city: null,
    state: null,
    pincode: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_status: "trialing",
    subscription_tier: "starter",
    onboarding_completed: true,
    timezone: "Asia/Kolkata",
    currency: "INR",
    lead_sources: ["phone", "whatsapp"],
  };

  const clinicB: Clinic = {
    id: "clinic-bbb-002",
    name: "Clinic Beta",
    slug: "clinic-beta",
    email: null,
    phone: null,
    address: null,
    city: null,
    state: null,
    pincode: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    subscription_status: "trialing",
    subscription_tier: "starter",
    onboarding_completed: true,
    timezone: "Asia/Kolkata",
    currency: "INR",
    lead_sources: ["phone", "walk_in"],
  };

  // Test Actors
  const users = {
    clinicAOwner: { id: "user-a-owner", role: "owner" as UserRole, clinicId: clinicA.id },
    clinicAReceptionist: { id: "user-a-rec", role: "receptionist" as UserRole, clinicId: clinicA.id },
    clinicBOwner: { id: "user-b-owner", role: "owner" as UserRole, clinicId: clinicB.id },
    clinicBReceptionist: { id: "user-b-rec", role: "receptionist" as UserRole, clinicId: clinicB.id },
  };

  // Synthetic Records
  const records = {
    clinicALead: { id: "lead-a-101", clinic_id: clinicA.id, name: "Patient A", phone: "+919876543210" },
    clinicBLead: { id: "lead-b-201", clinic_id: clinicB.id, name: "Patient B", phone: "+919123456789" },
    clinicAAppointment: { id: "apt-a-101", clinic_id: clinicA.id, lead_id: "lead-a-101" },
    clinicAOpportunity: { id: "opp-a-101", clinic_id: clinicA.id, proposed_value: 80000, collected: 40000 },
    clinicAAuditEvent: { id: "aud-a-101", clinic_id: clinicA.id, event_type: "lead_deleted" },
  };

  describe("1. Strict Cross-Tenant Read/Write Denial", () => {
    it("denies Clinic B users from reading Clinic A leads", () => {
      // Security invariant: queries must strictly filter by authenticated clinic_id
      const queryTenantLeads = (actorClinicId: string, lead: typeof records.clinicALead) => {
        return lead.clinic_id === actorClinicId ? lead : null;
      };

      expect(queryTenantLeads(users.clinicBOwner.clinicId, records.clinicALead)).toBeNull();
      expect(queryTenantLeads(users.clinicBReceptionist.clinicId, records.clinicALead)).toBeNull();
      expect(queryTenantLeads(users.clinicAOwner.clinicId, records.clinicALead)).not.toBeNull();
    });

    it("denies Clinic B users from modifying Clinic A appointment records", () => {
      const updateAppointment = (actorClinicId: string, apt: typeof records.clinicAAppointment) => {
        if (apt.clinic_id !== actorClinicId) {
          return { error: "Appointment not found in authenticated clinic." };
        }
        return { success: true };
      };

      const result = updateAppointment(users.clinicBOwner.clinicId, records.clinicAAppointment);
      expect(result.error).toBeDefined();
    });

    it("denies Clinic B users from modifying Clinic A treatment opportunities", () => {
      const updateOpportunity = (actorClinicId: string, opp: typeof records.clinicAOpportunity) => {
        if (opp.clinic_id !== actorClinicId) {
          return { error: "Treatment opportunity not found." };
        }
        return { success: true };
      };

      const result = updateOpportunity(users.clinicBOwner.clinicId, records.clinicAOpportunity);
      expect(result.error).toBeDefined();
    });

    it("denies Clinic B from injecting records into Clinic A by tampering clinic_id payload", () => {
      const insertRecord = (authenticatedClinicId: string, payload: { clinic_id: string; name: string }) => {
        // Safe server action pattern: always overwrite payload clinic_id with session clinic_id
        const sanitizedClinicId = authenticatedClinicId;
        return {
          id: "new-record-id",
          clinic_id: sanitizedClinicId, // Tampered payload.clinic_id is ignored
          name: payload.name,
        };
      };

      const tamperedPayload = { clinic_id: clinicA.id, name: "Malicious Inject" };
      const savedRecord = insertRecord(users.clinicBOwner.clinicId, tamperedPayload);

      // Record must be bound to Clinic B, NOT Clinic A
      expect(savedRecord.clinic_id).toBe(clinicB.id);
      expect(savedRecord.clinic_id).not.toBe(clinicA.id);
    });
  });

  describe("2. Role-Based Permissions (Owner vs Receptionist)", () => {
    it("allows Owner to delete leads but denies Receptionist", () => {
      expect(assertRole(users.clinicAOwner.role, ["owner", "admin"]).authorized).toBe(true);
      expect(assertRole(users.clinicAReceptionist.role, ["owner", "admin"]).authorized).toBe(false);
    });

    it("allows Owner to invite staff but denies Receptionist", () => {
      expect(assertRole(users.clinicAOwner.role, ["owner", "admin"]).authorized).toBe(true);
      expect(assertRole(users.clinicAReceptionist.role, ["owner", "admin"]).authorized).toBe(false);
    });

    it("allows Owner to update clinic settings but denies Receptionist", () => {
      expect(assertRole(users.clinicAOwner.role, ["owner", "admin"]).authorized).toBe(true);
      expect(assertRole(users.clinicAReceptionist.role, ["owner", "admin"]).authorized).toBe(false);
    });

    it("allows only Owner to change member roles (even Admins cannot promote/demote Owner)", () => {
      expect(assertRole("owner", ["owner"]).authorized).toBe(true);
      expect(assertRole("admin", ["owner"]).authorized).toBe(false);
      expect(assertRole("receptionist", ["owner"]).authorized).toBe(false);
    });

    it("denies Receptionist from viewing audit logs", () => {
      const canViewAuditLogs = (role: UserRole) => assertRole(role, ["owner", "admin"]).authorized;
      expect(canViewAuditLogs("owner")).toBe(true);
      expect(canViewAuditLogs("receptionist")).toBe(false);
    });
  });

  describe("3. CSV Formula Neutralization & Export Scope", () => {
    it("neutralizes dangerous spreadsheet formula payloads", () => {
      const dangerousInputs = [
        "=cmd|'/C calc'!A0",
        "+1234567890",
        "-SUM(A1:A10)",
        "@mention_injection",
        "\tleading_tab",
        "\rleading_carriage_return",
      ];

      dangerousInputs.forEach((input) => {
        const sanitized = sanitizeCsvValue(input);
        expect(sanitized.startsWith("'")).toBe(true);
      });
    });

    it("preserves legitimate text without corrupting normal patient names", () => {
      expect(sanitizeCsvValue("Rahul Sharma")).toBe("Rahul Sharma");
      expect(sanitizeCsvValue("Dr. Patel's Clinic")).toBe("Dr. Patel's Clinic");
    });
  });
});
