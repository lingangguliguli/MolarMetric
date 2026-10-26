"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  CalendarCheck,
  IndianRupee,
  Clock,
} from "lucide-react";
import type { AnalyticsReportData } from "@/app/actions/analytics";
import { formatCurrency, safePercentage } from "@/lib/utils";

interface ReportsViewProps {
  initialData: AnalyticsReportData;
  currentTimeRange: "7d" | "30d" | "90d" | "all";
}

export function ReportsView({ initialData, currentTimeRange }: ReportsViewProps) {
  const router = useRouter();
  const [range, setRange] = useState(currentTimeRange);

  const { kpis, funnelData, sourcePerformance, revenueByCategory } = initialData;

  function handleRangeChange(newRange: "7d" | "30d" | "90d" | "all") {
    setRange(newRange);
    router.push(`/reports?range=${newRange}`);
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl border border-border bg-muted p-1 text-xs">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                range === r
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "7d" && "Last 7 Days"}
              {r === "30d" && "Last 30 Days"}
              {r === "90d" && "Last 90 Days"}
              {r === "all" && "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Conversion Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">{kpis.newEnquiries}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.awaitingFirstContact} awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Booking Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">{kpis.bookingConversionRate}%</span>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.appointmentsBooked} consultations booked
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">{kpis.attendanceRate}%</span>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.appointmentsAttended} attended clinic
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Total Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(kpis.totalCollections)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              from {formatCurrency(kpis.acceptedOpportunityValue)} accepted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Conversion Funnel */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Stage-by-Stage Conversion Funnel
          </CardTitle>
          <CardDescription>
            Where patient drop-offs occur between initial enquiry and collected fees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, idx) => (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">
                    Step {idx + 1}: {stage.stage}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">
                      {stage.count} patients
                    </span>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(3, stage.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Channel & Treatment Revenue Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Attribution */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Channel Attribution & ROI</CardTitle>
            <CardDescription>
              Comparing inquiry volume and conversion rates across marketing sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sourcePerformance.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No channel data recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {sourcePerformance.map((src) => (
                  <div
                    key={src.source}
                    className="p-3 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground capitalize block">
                        {src.source.replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground">
                        {src.leads} total enquiries
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground block">
                        {src.won} converted to treatments
                      </span>
                      <span className="text-emerald-600 font-medium">
                        {src.conversionRate}% overall win rate
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Treatment Revenue Matrix */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Treatment Category Breakdown</CardTitle>
            <CardDescription>
              Proposed estimate vs actual clinical collection by procedure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByCategory.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No treatment opportunities proposed yet.
              </p>
            ) : (
              <div className="space-y-3">
                {revenueByCategory.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-foreground">{cat.category}</span>
                      <span className="text-emerald-600">
                        {formatCurrency(cat.collected)} collected
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Proposed: {formatCurrency(cat.proposed)}</span>
                      <span>Accepted: {formatCurrency(cat.accepted)}</span>
                      <span>
                        Realized:{" "}
                        {Math.round(safePercentage(cat.collected, cat.proposed))}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
