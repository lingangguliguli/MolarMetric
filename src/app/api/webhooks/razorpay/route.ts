import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, isRazorpayConfigured } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Billing features currently disabled." },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret unconfigured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature header." },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret);

  if (!isValid) {
    console.error("Razorpay webhook signature verification failed.");
    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 401 }
    );
  }

  try {
    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabase = createServiceClient();

    // Log subscription / billing event
    await supabase.from("subscription_events").insert({
      event_type: eventType,
      payload,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Razorpay webhook:", err?.message);
    return NextResponse.json(
      { error: "Webhook processing error." },
      { status: 500 }
    );
  }
}
