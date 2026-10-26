import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature, isCashfreeConfigured } from "@/lib/cashfree";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isCashfreeConfigured()) {
    return NextResponse.json(
      { error: "Cashfree billing is currently disabled." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json(
      { error: "Missing Cashfree signature or timestamp headers." },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);

  if (!isValid) {
    console.error("Cashfree webhook signature verification failed.");
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 401 }
    );
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventType = payload.type || payload.event || "PAYMENT_NOTIFICATION";

    const supabase = createServiceClient();

    // Record subscription event in database
    await supabase.from("subscription_events").insert({
      event_type: eventType,
      payload,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ status: "SUCCESS" });
  } catch (err: any) {
    console.error("Error processing Cashfree webhook:", err?.message);
    return NextResponse.json(
      { error: "Error processing webhook payload." },
      { status: 500 }
    );
  }
}
