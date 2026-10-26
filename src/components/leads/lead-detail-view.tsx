"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { transitionLeadStage, addLeadNote } from "@/app/actions/leads";
import { WhatsAppDraftDialog } from "./whatsapp-draft-dialog";
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog";
import { NewOpportunityDialog } from "@/components/treatments/new-opportunity-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  MessageSquare,
  Calendar,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { Lead, LeadStage, LeadEvent, FollowUpTask, Appointment, TreatmentOpportunity } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LeadDetailViewProps {
  lead: Lead;
  events: LeadEvent[];
  tasks: FollowUpTask[];
  appointments: Appointment[];
  opportunities: TreatmentOpportunity[];
}

const STAGES: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New Enquiry" },
  { id: "contacted", label: "Contacted" },
  { id: "interested", label: "Interested" },
  { id: "appointment_booked", label: "Appt Booked" },
  { id: "attended", label: "Attended Clinic" },
  { id: "treatment_proposed", label: "Treatment Proposed" },
  { id: "won", label: "Won / Treated" },
  { id: "lost", label: "Lost" },
];

export function LeadDetailView({
  lead,
  events,
  tasks,
  appointments,
  opportunities,
}: LeadDetailViewProps) {
  const router = useRouter();

  // Dialog states
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [opportunityOpen, setOpportunityOpen] = useState(false);

  // Stage change state
  const [transitioning, setTransitioning] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  async function handleStageChange(newStage: LeadStage) {
    if (newStage === lead.stage) return;
    setTransitioning(true);
    await transitionLeadStage(lead.id, newStage);
    setTransitioning(false);
    router.refresh();
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    await addLeadNote(lead.id, noteText);
    setAddingNote(false);
    setNoteText("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/leads"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Enquiries
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-foreground shadow-xs"
          >
            <Phone className="h-3.5 w-3.5 text-primary" />
            Call Patient
          </a>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
            onClick={() => setWhatsappOpen(true)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={() => setAppointmentOpen(true)}
          >
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Book Appointment
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setOpportunityOpen(true)}
          >
            <Activity className="h-3.5 w-3.5" />
            Propose Treatment
          </Button>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
                <Badge variant="outline" className="text-xs uppercase font-semibold capitalize bg-primary/10 text-primary border-primary/20">
                  {lead.stage.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="font-mono text-sm text-foreground font-semibold">
                  {lead.phone}
                </span>
                {lead.email && <span>{lead.email}</span>}
                <span>•</span>
                <span className="capitalize">Source: {lead.source.replace("_", " ")}</span>
                {lead.service_interest && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground">
                      Interest: {lead.service_interest}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl space-y-1">
              <div>
                <span className="font-medium text-foreground">Enquiry Received:</span>{" "}
                {new Date(lead.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <div>
                <span className="font-medium text-foreground">First Contact:</span>{" "}
                {lead.first_contact_at
                  ? new Date(lead.first_contact_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Pending first contact"}
              </div>
            </div>
          </div>

          {/* Pipeline Stage Progression Stepper */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              Pipeline Stage Progression
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {STAGES.map((stg) => {
                const isCurrent = lead.stage === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => handleStageChange(stg.id)}
                    disabled={transitioning}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
                    }`}
                  >
                    {stg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs: Timeline, Appointments & Treatments, Tasks */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-[450px]">
          <TabsTrigger value="timeline" className="text-xs">
            Activity Trail ({events.length})
          </TabsTrigger>
          <TabsTrigger value="clinical" className="text-xs">
            Clinical Plans ({opportunities.length + appointments.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            Tasks ({tasks.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Timeline & Notes */}
        <TabsContent value="timeline" className="space-y-6 mt-4">
          {/* Quick Note Add Form */}
          <Card className="border-border/60">
            <CardContent className="p-4">
              <form onSubmit={handleAddNote} className="space-y-3">
                <Textarea
                  placeholder="Record an interaction note, patient concern, medical history note, or callback agreement..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                  className="text-xs"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={addingNote || !noteText.trim()}
                    className="gap-1.5 text-xs"
                  >
                    {addingNote ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Add Activity Note
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Chronological Timeline */}
          <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-border/60 ml-2">
            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No events logged yet.</p>
            ) : (
              events.map((evt) => (
                <div key={evt.id} className="relative pl-6 pb-2">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                  <div className="p-3.5 rounded-xl border border-border/60 bg-card text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground capitalize">
                        {evt.event_type.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        {new Date(evt.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    {evt.event_type === "note_added" && (
                      <p className="text-foreground/90 mt-1 whitespace-pre-wrap">
                        {(evt.metadata as any)?.note}
                      </p>
                    )}

                    {evt.event_type === "stage_changed" && (
                      <p className="text-muted-foreground">
                        Moved from{" "}
                        <span className="font-semibold text-foreground">
                          {(evt.metadata as any)?.from_stage}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-primary">
                          {(evt.metadata as any)?.to_stage}
                        </span>
                      </p>
                    )}

                    {evt.event_type === "whatsapp_draft_prepared" && (
                      <p className="text-muted-foreground">
                        WhatsApp template &ldquo;{(evt.metadata as any)?.template_name}&rdquo; generated.
                      </p>
                    )}

                    {evt.event_type === "opportunity_created" && (
                      <p className="text-emerald-600 font-semibold">
                        Treatment Plan Proposed: {formatCurrency((evt.metadata as any)?.proposed_value || 0)} ({(evt.metadata as any)?.service_category})
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Clinical Appointments & Treatments */}
        <TabsContent value="clinical" className="space-y-6 mt-4">
          {/* Opportunities Section */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Treatment Opportunities
                  </CardTitle>
                  <CardDescription>
                    Proposed clinical procedures, accepted quotes, and collected fees.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setOpportunityOpen(true)}
                >
                  + Add Procedure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {opportunities.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No treatment proposals created yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {opp.service_category}
                          </span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {opp.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-muted-foreground">
                          <span>Proposed: {formatCurrency(opp.proposed_value)}</span>
                          {opp.accepted_value && (
                            <span className="text-foreground font-medium">
                              Accepted: {formatCurrency(opp.accepted_value)}
                            </span>
                          )}
                          <span className="text-emerald-600 font-semibold">
                            Collected: {formatCurrency(opp.collected_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointments Section */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Scheduled Appointments
                  </CardTitle>
                  <CardDescription>
                    Consultations and clinic visits recorded for this patient.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setAppointmentOpen(true)}
                >
                  + Book Visit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No appointments booked yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-sm text-foreground block">
                          {new Date(appt.scheduled_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span className="text-muted-foreground capitalize">
                          Source: {appt.booking_source || "reception"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize font-semibold">
                        {appt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Tasks */}
        <TabsContent value="tasks" className="mt-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Follow-up Tasks</CardTitle>
              <CardDescription>
                Tasks assigned for communicating with this patient.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No tasks recorded.
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground capitalize">
                            {t.task_type.replace("_", " ")}
                          </span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {t.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-0.5">
                          Due: {new Date(t.due_at).toLocaleString("en-IN")}
                        </p>
                        {t.notes && <p className="text-muted-foreground mt-1">{t.notes}</p>}
                        {t.outcome && (
                          <p className="text-emerald-600 font-medium mt-1">
                            Outcome: {t.outcome}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
      <WhatsAppDraftDialog
        leadId={lead.id}
        leadName={lead.name}
        leadPhone={lead.phone}
        open={whatsappOpen}
        onOpenChange={setWhatsappOpen}
      />

      <NewAppointmentDialog
        leadId={lead.id}
        leadName={lead.name}
        open={appointmentOpen}
        onOpenChange={setAppointmentOpen}
        onSuccess={() => router.refresh()}
      />

      <NewOpportunityDialog
        leadId={lead.id}
        leadName={lead.name}
        open={opportunityOpen}
        onOpenChange={setOpportunityOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
