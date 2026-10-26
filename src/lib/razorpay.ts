import crypto from "crypto";

export function isRazorpayConfigured(): boolean {
  return !!(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET
  );
}

export function getRazorpayPublicConfig() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || null,
    enabled: isRazorpayConfigured(),
    currency: "INR",
  };
}

/**
 * Verify Razorpay Webhook signature to ensure authenticity.
 */
export function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expected, "utf-8")
    );
  } catch {
    return false;
  }
}
