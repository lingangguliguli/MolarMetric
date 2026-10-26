import Link from "next/link";
import { getDashboardData } from "@/app/actions/analytics";
import { getFollowUpQueue } from "@/app/actions/follow-ups";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  CalendarCheck,
  AlertCircle,
  ArrowRight,
  ListTodo,
  IndianRupee,
} from "lucide-react";

export default async function DashboardPage() {
  const [data, taskQueue] = await Promise.all([
    getDashboardData("30d"),
    getFollowUpQueue(),
  ]);

  const { kpis, funnelData, sourcePerformance, revenueByCategory, recentLeads } = data;

  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Revenue Recovery Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time enquiry flow, follow-up coordination, and revenue conversion metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/follow-ups">
            <Button variant="outline" size="sm" className="gap-2">
              <ListTodo className="h-4 w-4" />
              Follow-up Queue
              {taskQueue.stats.overdueCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                  {taskQueue.stats.overdueCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/leads">
            <Button size="sm" className="gap-1.5">
              <Users className="h-4 w-4" />
              All Enquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Action Banner (if overdue tasks exist) */}
      {taskQueue.stats.overdueCount > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                {taskQueue.stats.overdueCount} follow-up {taskQueue.stats.overdueCount === 1 ? "task is" : "tasks are"} past due!
              </p>
              <p className="text-xs opacity-90">
                Patients who receive follow-up calls within 24 hours are 3.8x more likely to confirm appointments.
              </p>
            </div>
          </div>
          <Link href="/follow-ups">
            <Button size="sm" variant="outline" className="bg-white whitespace-nowrap text-xs">
              Open Queue
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: New Enquiries */}
        <Card className="border-border/60 hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              New Enquiries (30d)
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.newEnquiries}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="font-medium text-foreground">
                {kpis.awaitingFirstContact}
              </span>{" "}
              awaiting first contact
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: First Response Time */}
        <Card className="border-border/60 hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg First Response
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.avgFirstResponseMinutes ? `${kpis.avgFirstResponseMinutes}m` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: Under 15 minutes
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Booking & Attendance */}
        <Card className="border-border/60 hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.attendanceRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.appointmentsAttended} of {kpis.appointmentsBooked} attended
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Collected Revenue */}
        <Card className="border-border/60 hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Revenue Collected
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(kpis.totalCollections)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(kpis.acceptedOpportunityValue)} accepted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Funnel & Source Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Enquiry-to-Revenue Conversion Funnel
                </CardTitle>
                <CardDescription>
                  Tracking patient progression from initial contact to clinical collection.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                30 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage) => (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">{stage.stage}</span>
                    <span className="text-muted-foreground font-mono">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, stage.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel / Source Attribution */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Lead Source Performance
            </CardTitle>
            <CardDescription>
              Where your highest-value patients originate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sourcePerformance.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No enquiry channels recorded yet.
              </p>
            ) : (
              <div className="space-y-3.5">
                {sourcePerformance.map((src) => (
                  <div
                    key={src.source}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-foreground capitalize block">
                        {src.source.replace("_", " ")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {src.leads} enquiries
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground block">
                        {src.won} converted
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {src.conversionRate}% rate
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Treatment Opportunities & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treatment Revenue by Category */}
        <Card className="border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Treatment Revenue
                </CardTitle>
                <CardDescription>By clinical category.</CardDescription>
              </div>
              <Link href="/treatments">
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  View All
                </Button>
              </Link>
            </div>
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
                    className="p-3 rounded-xl border border-border/50 bg-card/60 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-foreground">{cat.category}</span>
                      <span className="text-emerald-600 font-semibold">
                        {formatCurrency(cat.collected)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Proposed: {formatCurrency(cat.proposed)}</span>
                      <span>Accepted: {formatCurrency(cat.accepted)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enquiries Table */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Patient Enquiries
                </CardTitle>
                <CardDescription>
                  Latest incoming leads requiring follow-up.
                </CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  View All Enquiries
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No enquiries recorded yet.</p>
                <p className="text-xs mt-1">
                  Use the &ldquo;+ New Enquiry&rdquo; button above to log your first lead.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors block text-sm"
                      >
                        {lead.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5 text-muted-foreground text-[11px]">
                        <span className="font-mono">{lead.phone}</span>
                        <span>•</span>
                        <span className="capitalize">{lead.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px] capitalize font-medium">
                        {lead.stage.replace("_", " ")}
                      </Badge>
                      <Link href={`/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          View
                        </Button>
                      </Link>
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
