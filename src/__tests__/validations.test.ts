import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  clinicSetupSchema,
  leadCreateSchema,
  opportunityCreateSchema,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  it("validates login schema properly", () => {
    const valid = loginSchema.safeParse({
      email: "doctor@clinic.com",
      password: "StrongPassword1",
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: "not-an-email",
      password: "StrongPassword1",
    });
    expect(invalidEmail.success).toBe(false);
  });

  it("validates register schema requiring password complexity, terms acceptance, and matching confirmation", () => {
    const valid = registerSchema.safeParse({
      name: "Dr. Arjun Patel",
      email: "arjun@apexdental.in",
      password: "SecurePassword123",
      confirmPassword: "SecurePassword123",
      termsAccepted: true,
    });
    expect(valid.success).toBe(true);

    const missingTerms = registerSchema.safeParse({
      name: "Dr. Arjun Patel",
      email: "arjun@apexdental.in",
      password: "SecurePassword123",
      confirmPassword: "SecurePassword123",
      termsAccepted: false,
    });
    expect(missingTerms.success).toBe(false);

    const mismatch = registerSchema.safeParse({
      name: "Dr. Arjun Patel",
      email: "arjun@apexdental.in",
      password: "SecurePassword123",
      confirmPassword: "DifferentPassword123",
      termsAccepted: true,
    });
    expect(mismatch.success).toBe(false);

    const simplePassword = registerSchema.safeParse({
      name: "Dr. Arjun Patel",
      email: "arjun@apexdental.in",
      password: "password",
      confirmPassword: "password",
      termsAccepted: true,
    });
    expect(simplePassword.success).toBe(false);
  });

  it("validates clinic setup schema with pincode format", () => {
    const valid = clinicSetupSchema.safeParse({
      name: "Apex Dental Center",
      city: "Mumbai",
      pincode: "400001",
    });
    expect(valid.success).toBe(true);

    const invalidPincode = clinicSetupSchema.safeParse({
      name: "Apex Dental Center",
      pincode: "123", // Needs 6 digits
    });
    expect(invalidPincode.success).toBe(false);
  });

  it("validates lead create schema requiring valid name and phone", () => {
    const valid = leadCreateSchema.safeParse({
      name: "Pooja Verma",
      phone: "9876543210",
      source: "whatsapp",
    });
    expect(valid.success).toBe(true);

    const missingPhone = leadCreateSchema.safeParse({
      name: "Pooja Verma",
      phone: "",
      source: "whatsapp",
    });
    expect(missingPhone.success).toBe(false);
  });

  it("validates opportunity create schema requiring positive proposed value", () => {
    const valid = opportunityCreateSchema.safeParse({
      lead_id: "00000000-0000-0000-0000-000000000000",
      service_category: "Dental Implants",
      proposed_value: 45000,
    });
    expect(valid.success).toBe(true);

    const negativeValue = opportunityCreateSchema.safeParse({
      lead_id: "00000000-0000-0000-0000-000000000000",
      proposed_value: -100,
    });
    expect(negativeValue.success).toBe(false);
  });
});
