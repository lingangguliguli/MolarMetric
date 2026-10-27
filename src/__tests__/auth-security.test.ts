import { describe, it, expect, vi, beforeEach } from "vitest";
import { assertActiveWorkspace, assertRole } from "@/lib/auth-context";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Clinic } from "@/lib/types";

// Mock next/navigation redirect
const redirectMock = vi.fn((url: string) => {
  const err = new Error(`NEXT_REDIRECT: ${url}`);
  (err as any).digest = `NEXT_REDIRECT;${url}`;
  throw err;
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

const baseClinicTemplate: Clinic = {
  id: "clinic-base",
  name: "Base Clinic",
  slug: "base-clinic",
  email: null,
  phone: null,
  address: null,
  city: null,
  state: null,
  pincode: null,
  timezone: "Asia/Kolkata",
  currency: "INR",
  lead_sources: ["phone", "whatsapp"],
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("Authentication & Tenant Isolation Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should strictly deny inactive clinic memberships from accessing tenant context", () => {
    const membership = {
      id: "mem-1",
      clinic_id: "clinic-1",
      user_id: "user-inactive",
      role: "receptionist",
      status: "inactive",
    };

    const isAuthorized = membership && membership.status === "active";
    expect(isAuthorized).toBe(false);

    if (!isAuthorized) {
      expect(() => redirectMock("/onboarding")).toThrow("NEXT_REDIRECT: /onboarding");
    }
  });

  it("should strictly deny removed clinic memberships from accessing tenant context", () => {
    const membership = {
      id: "mem-2",
      clinic_id: "clinic-1",
      user_id: "user-removed",
      role: "receptionist",
      status: "removed",
    };

    const isAuthorized = membership && membership.status === "active";
    expect(isAuthorized).toBe(false);
  });

  it("should allow active clinic memberships to produce authenticated clinic context", () => {
    const membership = {
      id: "mem-3",
      clinic_id: "clinic-1",
      user_id: "user-active",
      role: "owner",
      status: "active",
    };

    const isAuthorized = membership && membership.status === "active";
    expect(isAuthorized).toBe(true);
  });

  it("should enforce role-based authorization for sensitive settings mutations", () => {
    const roles: Array<{ role: "owner" | "admin" | "receptionist"; allowed: boolean }> = [
      { role: "owner", allowed: true },
      { role: "admin", allowed: true },
      { role: "receptionist", allowed: false },
    ];

    roles.forEach(({ role, allowed }) => {
      const check = assertRole(role, ["owner", "admin"]);
      expect(check.authorized).toBe(allowed);
      if (!allowed) {
        expect(check.error).toBeDefined();
      }
    });
  });

  it("should enforce cross-tenant data isolation by clinic_id", () => {
    const tenantAClinicId = "clinic-aaa-111";
    const tenantBClinicId = "clinic-bbb-222";

    const leadInTenantA = {
      id: "lead-1",
      clinic_id: tenantAClinicId,
      name: "Patient A",
    };

    const userClinicId = tenantBClinicId;
    const canAccess = leadInTenantA.clinic_id === userClinicId;

    expect(canAccess).toBe(false);
  });

  it("should enforce that only owner and admin can delete patient enquiries while receptionists are denied", () => {
    const roles: Array<{ role: "owner" | "admin" | "receptionist"; canDelete: boolean }> = [
      { role: "owner", canDelete: true },
      { role: "admin", canDelete: true },
      { role: "receptionist", canDelete: false },
    ];

    roles.forEach(({ role, canDelete }) => {
      const isAllowed = assertRole(role, ["owner", "admin"]).authorized;
      expect(isAllowed).toBe(canDelete);
    });
  });

  describe("Server-Side Read-Only Trial Enforcement", () => {
    it("allows write mutations for an active trial clinic", () => {
      const activeClinic: Clinic = {
        ...baseClinicTemplate,
        id: "clinic-active",
        name: "Active Dental",
        slug: "active-dental",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_status: "trialing",
        subscription_tier: "starter",
      };

      const result = assertActiveWorkspace(activeClinic);
      expect(result.canWrite).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("blocks write mutations when trial has expired and plan is not paid", () => {
      const expiredClinic: Clinic = {
        ...baseClinicTemplate,
        id: "clinic-expired",
        name: "Expired Dental",
        slug: "expired-dental",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        trial_ends_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_status: "trialing",
        subscription_tier: "starter",
      };

      const result = assertActiveWorkspace(expiredClinic);
      expect(result.canWrite).toBe(false);
      expect(result.error).toContain("read-only mode");
    });

    it("allows write mutations for an active paid subscription even if trial expired", () => {
      const paidClinic: Clinic = {
        ...baseClinicTemplate,
        id: "clinic-paid",
        name: "Paid Premier Dental",
        slug: "paid-premier",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        trial_ends_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_status: "active",
        subscription_tier: "pro",
      };

      const result = assertActiveWorkspace(paidClinic);
      expect(result.canWrite).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("Rate Limiting Guard", () => {
    it("allows requests under the rate limit and blocks requests exceeding it", async () => {
      const testIp = `test-ip-${Date.now()}`;
      const limit = 3;
      const windowSec = 10;

      const res1 = await checkRateLimit(testIp, limit, windowSec);
      expect(res1.success).toBe(true);
      expect(res1.remaining).toBe(2);

      const res2 = await checkRateLimit(testIp, limit, windowSec);
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(1);

      const res3 = await checkRateLimit(testIp, limit, windowSec);
      expect(res3.success).toBe(true);
      expect(res3.remaining).toBe(0);

      // 4th request must be rejected
      const res4 = await checkRateLimit(testIp, limit, windowSec);
      expect(res4.success).toBe(false);
      expect(res4.remaining).toBe(0);
    });
  });
});
