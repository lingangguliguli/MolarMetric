import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalise an Indian phone number to E.164 format (+91XXXXXXXXXX).
 * Handles common formats: 9876543210, 09876543210, +919876543210, 91 9876543210
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  // Already E.164 with country code
  if (/^\+91\d{10}$/.test(cleaned)) return cleaned;
  // Has 91 prefix without +
  if (/^91\d{10}$/.test(cleaned)) return `+${cleaned}`;
  // Has 0 prefix (trunk)
  if (/^0\d{10}$/.test(cleaned)) return `+91${cleaned.slice(1)}`;
  // Just 10 digits
  if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
  // Return as-is if we can't normalise
  return cleaned;
}

/**
 * Validate that a string is a valid Indian mobile number.
 */
export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^\+91[6-9]\d{9}$/.test(normalized);
}

/**
 * Format currency in INR.
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Safe division — returns 0 when denominator is 0.
 */
export function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Calculate percentage safely.
 */
export function safePercentage(part: number, whole: number): number {
  return safeDivide(part, whole) * 100;
}

/**
 * Generate a WhatsApp click-to-chat URL.
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhoneNumber(phone);
  // Remove the + for wa.me links
  const waNumber = normalized.startsWith("+")
    ? normalized.slice(1)
    : normalized;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${waNumber}?text=${encodedMessage}`;
}

/**
 * Sanitise a string for CSV export to mitigate formula injection.
 */
export function sanitizeCsvValue(value: string): string {
  const dangerous = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerous.some((ch) => value.startsWith(ch))) {
    return `'${value}`;
  }
  // Wrap in quotes if contains comma or newline
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
