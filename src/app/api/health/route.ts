import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const startTime = Date.now();
  let dbStatus: "connected" | "unavailable" | "unconfigured" = "unconfigured";
  let latencyMs: number | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("your-project")) {
      const supabase = createClient();
      const { error } = await supabase
        .from("daily_motivations")
        .select("id")
        .limit(1);

      latencyMs = Date.now() - startTime;
      dbStatus = error ? "unavailable" : "connected";
    }
  } catch (err) {
    dbStatus = "unavailable";
  }

  const isHealthy = dbStatus === "connected" || dbStatus === "unconfigured";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      app: "MolarMetric",
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database: {
        status: dbStatus,
        latencyMs,
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
