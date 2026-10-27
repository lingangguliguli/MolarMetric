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
  ArrowUpRight,
  ListTodo,
  IndianRupee,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default async function DashboardPage() {
  const [data, taskQueue] = await Promise.all([
    getDashboardData("30d"),
    getFollowUpQueue(),
  ]);

  const { kpis, funnelData, sourcePerformance, revenueByCategory, recentLeads, firstAwaitingLead } = data;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Revenue Recovery Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time enquiry flow, receptionist follow-up coordination, and revenue conversion metrics.
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
              All Enquiries ({kpis.newEnquiries})
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Highlight: Enquiry Awaiting First Response */}
      {firstAwaitingLead && (
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-foreground">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  1 Enquiry Awaiting Response
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/20 text-primary border-primary/30">
                  Needs First Callback
                </Badge>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                Patient: <span className="underline decoration-primary/40 underline-offset-2">{firstAwaitingLead.name}</span>
                <span className="font-mono text-xs text-muted-foreground ml-2">({firstAwaitingLead.phone})</span>
                {firstAwaitingLead.service_interest && (
                  <span className="text-muted-foreground font-normal ml-2">
                    • Requirement: <strong className="text-foreground">{firstAwaitingLead.service_interest}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <a href={`tel:${firstAwaitingLead.phone}`}>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs bg-background/50 hover:bg-background">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Call Patient
              </Button>
            </a>
            <Link href={`/leads/${firstAwaitingLead.id}`}>
              <Button size="sm" className="gap-1.5 text-xs font-bold shadow-sm">
                Open Patient Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Critical Overdue Action Banner (if overdue tasks exist) */}
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
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold whitespace-nowrap text-xs shadow-sm">
              Open Queue
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Primary KPI Grid (Every Card is Fully Clickable & Navigable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Enquiries */}
        <Link
          href="/leads"
          className="group block focus:outline-none"
        >
          <Card className="border-border/60 group-hover:border-primary/60 transition-all duration-200 group-hover:shadow-md cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                Total Enquiries (30d)
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {kpis.newEnquiries}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between flex-wrap gap-1">
                <span className={kpis.awaitingFirstContact > 0 ? "font-semibold text-amber-500" : ""}>
                  {kpis.awaitingFirstContact} awaiting response
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {kpis.closedEnquiries} closed ({kpis.wonEnquiries} won)
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* KPI 2: First Response Time */}
        <Link href="/follow-ups" className="group block focus:outline-none">
          <Card className="border-border/60 group-hover:border-blue-500/60 transition-all duration-200 group-hover:shadow-md cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                Avg First Response
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {kpis.avgFirstResponseMinutes ? `${kpis.avgFirstResponseMinutes}m` : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>Target: Under 15m</span>
                <span className="text-[11px] text-blue-500 font-medium">Open Queue →</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* KPI 3: Booking & Attendance */}
        <Link href="/appointments" className="group block focus:outline-none">
          <Card className="border-border/60 group-hover:border-emerald-500/60 transition-all duration-200 group-hover:shadow-md cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                Attendance Rate
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {kpis.attendanceRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>{kpis.appointmentsAttended} of {kpis.appointmentsBooked} attended</span>
                <span className="text-[11px] text-emerald-500 font-medium">Calendar →</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* KPI 4: Collected Revenue */}
        <Link href="/treatments" className="group block focus:outline-none">
          <Card className="border-border/60 group-hover:border-amber-500/60 transition-all duration-200 group-hover:shadow-md cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-amber-500 transition-colors flex items-center gap-1.5">
                Revenue Realized
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <IndianRupee className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(kpis.totalCollections)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>{formatCurrency(kpis.acceptedOpportunityValue)} accepted</span>
                <span className="text-[11px] text-amber-500 font-medium">Pipeline →</span>
              </p>
            </CardContent>
          </Card>
        </Link>
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
                  Click any stage to inspect matching patient records.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                30 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              {funnelData.map((stage) => {
                let stageHref = "/leads";
                if (stage.stage === "Contacted") stageHref = "/leads?stage=contacted";
                else if (stage.stage === "Appointment Booked") stageHref = "/appointments";
                else if (stage.stage === "Attended Clinic") stageHref = "/appointments?status=attended";
                else if (stage.stage === "Treatment Plan") stageHref = "/treatments";
                else if (stage.stage === "Won / Paid") stageHref = "/leads?stage=won";

                return (
                  <Link
                    key={stage.stage}
                    href={stageHref}
                    className="group block p-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {stage.stage}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {stage.count} enquiries ({stage.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, stage.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
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
              <div className="space-y-3">
                {sourcePerformance.map((src) => (
                  <Link
                    key={src.source}
                    href={`/leads?source=${src.source}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors text-xs block group"
                  >
                    <div>
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors capitalize block">
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
                  </Link>
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
                  <Link
                    key={cat.category}
                    href="/treatments"
                    className="block p-3 rounded-xl border border-border/50 bg-card/60 hover:border-primary/40 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-foreground font-semibold">{cat.category}</span>
                      <span className="text-emerald-600 font-semibold">
                        {formatCurrency(cat.collected)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Proposed: {formatCurrency(cat.proposed)}</span>
                      <span>Accepted: {formatCurrency(cat.accepted)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enquiries Table (Instant Access to Requirements & Patient Profile) */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Patient Enquiries
                </CardTitle>
                <CardDescription>
                  Click any enquiry to view clinical history, requirements, and treatment plans.
                </CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  View All Enquiries ({kpis.newEnquiries})
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
                  Use the &ldquo;+ New Enquiry&rdquo; button to log your first patient inquiry.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-muted/30 p-2.5 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {lead.name}
                          <ArrowRight className="h-3 w-3 opacity-70" />
                        </Link>
                        {!lead.first_contact_at && lead.stage === "new" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300">
                            Awaiting Response
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground text-[11px]">
                        <span className="font-mono text-foreground font-medium">{lead.phone}</span>
                        <span>•</span>
                        <span className="capitalize">{lead.source}</span>
                        {lead.service_interest && (
                          <>
                            <span>•</span>
                            <span className="text-foreground font-semibold">
                              Interest: {lead.service_interest}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize font-medium">
                        {lead.stage.replace("_", " ")}
                      </Badge>
                      <a href={`tel:${lead.phone}`} title="Call Patient">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </a>
                      <Link href={`/leads/${lead.id}`}>
                        <Button size="sm" variant="secondary" className="h-7 px-2.5 text-xs font-semibold">
                          Open Profile
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
