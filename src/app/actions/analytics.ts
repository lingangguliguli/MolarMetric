"use server";

import { createClient, getDbClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { safeDivide, safePercentage } from "@/lib/utils";
import type { DashboardKPIs } from "@/lib/types";

export interface AnalyticsReportData {
  kpis: DashboardKPIs & {
    closedEnquiries: number;
    wonEnquiries: number;
  };
  funnelData: { stage: string; count: number; percentage: number }[];
  sourcePerformance: { source: string; leads: number; won: number; conversionRate: number }[];
  revenueByCategory: { category: string; proposed: number; accepted: number; collected: number }[];
  recentLeads: Array<{
    id: string;
    name: string;
    phone: string;
    source: string;
    stage: string;
    service_interest?: string;
    first_contact_at?: string | null;
    created_at: string;
  }>;
  firstAwaitingLead?: {
    id: string;
    name: string;
    phone: string;
    source: string;
    service_interest?: string;
  } | null;
}

export async function getDashboardData(timeRange: "7d" | "30d" | "90d" | "all" = "30d"): Promise<AnalyticsReportData> {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();
  const dbClient = getDbClient(supabase);

  const now = new Date();
  let fromDate: string | null = null;

  if (timeRange === "7d") {
    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (timeRange === "30d") {
    fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (timeRange === "90d") {
    fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }

  // 1. Prepare leads query
  let leadsQuery = dbClient
    .from("leads")
    .select("id, stage, source, created_at, first_contact_at, name, phone, service_interest")
    .eq("clinic_id", clinic.id)
    .or("archived.eq.false,archived.is.null");

  if (fromDate) {
    leadsQuery = leadsQuery.gte("created_at", fromDate);
  }

  // 2. Prepare appointments query
  let apptsQuery = dbClient
    .from("appointments")
    .select("id, status, scheduled_at")
    .eq("clinic_id", clinic.id);

  if (fromDate) {
    apptsQuery = apptsQuery.gte("scheduled_at", fromDate);
  }

  // 3. Prepare treatment opportunities query
  let oppsQuery = dbClient
    .from("treatment_opportunities")
    .select("id, status, proposed_value, accepted_value, collected_amount, service_category")
    .eq("clinic_id", clinic.id);

  if (fromDate) {
    oppsQuery = oppsQuery.gte("created_at", fromDate);
  }

  // Execute all 4 independent database queries concurrently
  const [leadsRes, overdueRes, apptsRes, oppsRes] = await Promise.all([
    leadsQuery.order("created_at", { ascending: false }),
    dbClient
      .from("follow_up_tasks")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinic.id)
      .eq("status", "pending")
      .lt("due_at", now.toISOString()),
    apptsQuery,
    oppsQuery,
  ]);

  const leads: any[] = (leadsRes.data as any[]) || [];
  const overdueCount = overdueRes.count || 0;
  const appointments: any[] = (apptsRes.data as any[]) || [];
  const opportunities: any[] = (oppsRes.data as any[]) || [];

  // Calculate KPIs
  const newEnquiries = leads.length;
  const awaitingFirstContact = leads.filter((l: any) => l.stage === "new" && !l.first_contact_at).length;

  // First response time calculation
  let totalResponseMinutes = 0;
  let respondedCount = 0;
  leads.forEach((l: any) => {
    if (l.first_contact_at && l.created_at) {
      const diffMs = new Date(l.first_contact_at).getTime() - new Date(l.created_at).getTime();
      if (diffMs > 0) {
        totalResponseMinutes += diffMs / (1000 * 60);
        respondedCount++;
      }
    }
  });
  const avgFirstResponseMinutes = respondedCount > 0 ? Math.round(totalResponseMinutes / respondedCount) : null;

  const appointmentsBooked = appointments.length;
  const appointmentsAttended = appointments.filter((a: any) => a.status === "attended").length;

  const bookingConversionRate = Math.round(safePercentage(appointmentsBooked, newEnquiries));
  const attendanceRate = Math.round(safePercentage(appointmentsAttended, appointmentsBooked));

  const totalAcceptedOpps = opportunities.filter((o: any) =>
    ["accepted", "collected", "partially_collected"].includes(o.status)
  ).length;
  const treatmentAcceptanceRate = Math.round(safePercentage(totalAcceptedOpps, opportunities.length));

  const acceptedOpportunityValue = opportunities.reduce(
    (acc: number, o: any) => acc + (o.accepted_value || 0),
    0
  );
  const totalCollections = opportunities.reduce(
    (acc: number, o: any) => acc + (o.collected_amount || 0),
    0
  );

  // Conversion Funnel Data
  const stageCounts: Record<string, number> = {
    new: leads.length,
    contacted: leads.filter((l: any) => l.stage !== "new").length,
    booked: appointmentsBooked,
    attended: appointmentsAttended,
    treatment_proposed: opportunities.length,
    won: leads.filter((l: any) => l.stage === "won").length,
  };

  const funnelData = [
    { stage: "All Enquiries", count: stageCounts.new, percentage: 100 },
    { stage: "Contacted", count: stageCounts.contacted, percentage: Math.round(safePercentage(stageCounts.contacted, stageCounts.new)) },
    { stage: "Appointment Booked", count: stageCounts.booked, percentage: Math.round(safePercentage(stageCounts.booked, stageCounts.new)) },
    { stage: "Attended Clinic", count: stageCounts.attended, percentage: Math.round(safePercentage(stageCounts.attended, stageCounts.new)) },
    { stage: "Treatment Plan", count: stageCounts.treatment_proposed, percentage: Math.round(safePercentage(stageCounts.treatment_proposed, stageCounts.new)) },
    { stage: "Won / Paid", count: stageCounts.won, percentage: Math.round(safePercentage(stageCounts.won, stageCounts.new)) },
  ];

  // Source Performance breakdown
  const sourceGroups: Record<string, { total: number; won: number }> = {};
  leads.forEach((l: any) => {
    const src = l.source || "other";
    if (!sourceGroups[src]) sourceGroups[src] = { total: 0, won: 0 };
    sourceGroups[src].total += 1;
    if (l.stage === "won") sourceGroups[src].won += 1;
  });

  const sourcePerformance = Object.entries(sourceGroups).map(([source, stats]) => ({
    source,
    leads: stats.total,
    won: stats.won,
    conversionRate: Math.round(safePercentage(stats.won, stats.total)),
  })).sort((a, b) => b.leads - a.leads);

  // Revenue by Category breakdown
  const catGroups: Record<string, { proposed: number; accepted: number; collected: number }> = {};
  opportunities.forEach((o: any) => {
    const cat = o.service_category || "General Dentistry";
    if (!catGroups[cat]) catGroups[cat] = { proposed: 0, accepted: 0, collected: 0 };
    catGroups[cat].proposed += o.proposed_value || 0;
    catGroups[cat].accepted += o.accepted_value || 0;
    catGroups[cat].collected += o.collected_amount || 0;
  });

  const revenueByCategory = Object.entries(catGroups).map(([category, vals]) => ({
    category,
    ...vals,
  })).sort((a, b) => b.collected - a.collected);

  const closedEnquiries = leads.filter((l: any) => l.stage === "won" || l.stage === "lost").length;
  const wonEnquiries = leads.filter((l: any) => l.stage === "won").length;
  const awaitingLead = leads.find((l: any) => l.stage === "new" && !l.first_contact_at);

  return {
    kpis: {
      newEnquiries,
      avgFirstResponseMinutes,
      awaitingFirstContact,
      overdueFollowUps: overdueCount || 0,
      appointmentsBooked,
      appointmentsAttended,
      bookingConversionRate,
      attendanceRate,
      treatmentAcceptanceRate,
      acceptedOpportunityValue,
      totalCollections,
      closedEnquiries,
      wonEnquiries,
    },
    funnelData,
    sourcePerformance,
    revenueByCategory,
    firstAwaitingLead: awaitingLead
      ? {
          id: awaitingLead.id,
          name: awaitingLead.name,
          phone: awaitingLead.phone,
          source: awaitingLead.source,
          service_interest: (awaitingLead as any).service_interest || undefined,
        }
      : null,
    recentLeads: leads.slice(0, 10).map((l: any) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      source: l.source,
      stage: l.stage,
      service_interest: (l as any).service_interest || undefined,
      first_contact_at: l.first_contact_at,
      created_at: l.created_at,
    })),
  };
}
