import { describe, it, expect } from "vitest";
import {
  normalizePhoneNumber,
  isValidIndianPhone,
  formatCurrency,
  safeDivide,
  safePercentage,
  generateWhatsAppUrl,
  sanitizeCsvValue,
} from "@/lib/utils";

describe("Phone Number Normalization & Validation", () => {
  it("normalizes a 10-digit number to E.164 +91 format", () => {
    expect(normalizePhoneNumber("9876543210")).toBe("+919876543210");
  });

  it("handles numbers with 0 trunk prefix", () => {
    expect(normalizePhoneNumber("09876543210")).toBe("+919876543210");
  });

  it("handles numbers with 91 prefix without plus", () => {
    expect(normalizePhoneNumber("919876543210")).toBe("+919876543210");
  });

  it("preserves numbers already starting with +91", () => {
    expect(normalizePhoneNumber("+919876543210")).toBe("+919876543210");
  });

  it("strips spaces, dashes, and parentheses", () => {
    expect(normalizePhoneNumber("+91 (987) 654-3210")).toBe("+919876543210");
  });

  it("validates legitimate Indian mobile numbers (starts with 6, 7, 8, 9)", () => {
    expect(isValidIndianPhone("9876543210")).toBe(true);
    expect(isValidIndianPhone("8123456789")).toBe(true);
    expect(isValidIndianPhone("7012345678")).toBe(true);
    expect(isValidIndianPhone("6301234567")).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidIndianPhone("1234567890")).toBe(false);
    expect(isValidIndianPhone("5551234567")).toBe(false);
    expect(isValidIndianPhone("98765")).toBe(false);
  });
});

describe("Financial Utilities & Safe Math", () => {
  it("formats Indian Rupee currency correctly", () => {
    const formatted = formatCurrency(25000);
    expect(formatted).toContain("25,000");
  });

  it("safeDivide returns 0 when denominator is 0", () => {
    expect(safeDivide(500, 0)).toBe(0);
    expect(safeDivide(0, 0)).toBe(0);
    expect(safeDivide(100, 4)).toBe(25);
  });

  it("safePercentage calculates safe rates", () => {
    expect(safePercentage(20, 100)).toBe(20);
    expect(safePercentage(1, 0)).toBe(0);
  });
});

describe("WhatsApp URL Generation", () => {
  it("creates a properly encoded wa.me URL", () => {
    const url = generateWhatsAppUrl("9876543210", "Hello Rahul, welcome!");
    expect(url).toBe("https://wa.me/919876543210?text=Hello%20Rahul%2C%20welcome!");
  });
});

describe("CSV Formula Injection Sanitization", () => {
  it("prefixes dangerous characters with a single quote to prevent Excel formula execution", () => {
    expect(sanitizeCsvValue("=cmd|'/C calc'!A0")).toBe("'=cmd|'/C calc'!A0");
    expect(sanitizeCsvValue("+12345")).toBe("'+12345");
    expect(sanitizeCsvValue("-250")).toBe("'-250");
    expect(sanitizeCsvValue("@mention")).toBe("'@mention");
  });

  it("escapes commas and quotation marks", () => {
    expect(sanitizeCsvValue('Apex Clinic, "Best"')).toBe('"Apex Clinic, ""Best"""');
  });

  it("leaves regular text untouched", () => {
    expect(sanitizeCsvValue("Rahul Sharma")).toBe("Rahul Sharma");
  });
});
