import crypto from "crypto";

export interface CashfreeCustomer {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customer: CashfreeCustomer;
  returnUrl?: string;
  orderNote?: string;
}

export function isCashfreeConfigured(): boolean {
  return !!(
    process.env.CASHFREE_APP_ID &&
    process.env.CASHFREE_SECRET_KEY
  );
}

export function getCashfreeBaseUrl(): string {
  const env = (process.env.CASHFREE_ENVIRONMENT || "SANDBOX").toUpperCase();
  return env === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export function getCashfreePublicConfig() {
  return {
    appId: process.env.CASHFREE_APP_ID || null,
    environment: (process.env.CASHFREE_ENVIRONMENT || "SANDBOX").toLowerCase(),
    enabled: isCashfreeConfigured(),
    currency: "INR",
  };
}

/**
 * Verify Cashfree Webhook signature.
 * Cashfree creates signature: HMAC-SHA256(timestamp + rawBody, secret_key) -> base64
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secretKey?: string
): boolean {
  const secret = secretKey || process.env.CASHFREE_SECRET_KEY;
  if (!signature || !timestamp || !secret) {
    return false;
  }

  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataToSign)
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );
  } catch (err) {
    console.error("Cashfree webhook signature verification error:", err);
    return false;
  }
}

/**
 * Helper to initiate Cashfree Payment Session via Cashfree PG REST API
 */
export async function createCashfreeOrder(params: CreateOrderParams) {
  if (!isCashfreeConfigured()) {
    throw new Error("Cashfree credentials are not configured in environment variables.");
  }

  const appId = process.env.CASHFREE_APP_ID!;
  const secretKey = process.env.CASHFREE_SECRET_KEY!;
  const apiVersion = process.env.CASHFREE_API_VERSION || "2023-08-01";
  const baseUrl = getCashfreeBaseUrl();

  const body = {
    order_id: params.orderId,
    order_amount: params.orderAmount,
    order_currency: params.orderCurrency || "INR",
    customer_details: {
      customer_id: params.customer.customerId,
      customer_name: params.customer.customerName,
      customer_email: params.customer.customerEmail,
      customer_phone: params.customer.customerPhone,
    },
    order_meta: {
      return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?order_id={order_id}`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/cashfree`,
    },
    order_note: params.orderNote || "MolarMetric Clinic SaaS Subscription",
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": apiVersion,
      "x-client-id": appId,
      "x-client-secret": secretKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Cashfree order");
  }

  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    orderStatus: data.order_status,
  };
}
