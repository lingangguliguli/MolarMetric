"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { transitionLeadStage, addLeadNote, deleteLead } from "@/app/actions/leads";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Phone,
  MessageSquare,
  Calendar,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Loader2,
  AlertTriangle,
  Trash2,
  IndianRupee,
  ShieldAlert,
} from "lucide-react";
import type { Lead, LeadStage, LeadEvent, FollowUpTask, Appointment, TreatmentOpportunity, UserRole } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface LeadDetailViewProps {
  lead: Lead;
  events: LeadEvent[];
  tasks: FollowUpTask[];
  appointments: Appointment[];
  opportunities: TreatmentOpportunity[];
  currentUserRole?: UserRole;
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
  currentUserRole = "receptionist",
}: LeadDetailViewProps) {
  const router = useRouter();

  // Dialog states
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Loading states
  const [transitioning, setTransitioning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Financial calculations
  const totalProposed = opportunities.reduce((acc, o) => acc + (o.proposed_value || 0), 0);
  const totalAccepted = opportunities.reduce((acc, o) => acc + (o.accepted_value || 0), 0);
  const totalCollected = opportunities.reduce((acc, o) => acc + (o.collected_amount || 0), 0);
  const pendingBalance = Math.max(0, totalAccepted - totalCollected);

  const canDelete = currentUserRole === "owner" || currentUserRole === "admin";

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

  async function handleDeleteConfirm() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteLead(lead.id);
      if (result.error) {
        setDeleteError(result.error);
        setDeleting(false);
      } else {
        setDeleteConfirmOpen(false);
        router.push("/leads");
      }
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete enquiry.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
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
            className="gap-1.5 text-xs font-semibold"
            onClick={() => setOpportunityOpen(true)}
          >
            <Activity className="h-3.5 w-3.5" />
            Propose Treatment
          </Button>

          {/* Owner-Only Delete Button */}
          {canDelete && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/60"
              onClick={() => setDeleteConfirmOpen(true)}
              title="Delete Enquiry (Owner Only)"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Patient Header Card */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{lead.name}</h1>
                <Badge variant="outline" className="text-xs uppercase font-semibold capitalize bg-primary/10 text-primary border-primary/20">
                  {lead.stage.replace("_", " ")}
                </Badge>
                {lead.stage === "won" && (
                  <Badge variant="outline" className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Won / Closed Case
                  </Badge>
                )}
                {lead.stage === "lost" && (
                  <Badge variant="outline" className="text-xs font-semibold bg-slate-500/10 text-slate-400 border-slate-500/20">
                    Lost ({lead.lost_reason || "Declined"})
                  </Badge>
                )}
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
                    <span className="font-semibold text-primary">
                      Interest: {lead.service_interest}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-xl space-y-1.5 flex-shrink-0">
              <div>
                <span className="font-medium text-foreground">Enquiry Received:</span>{" "}
                {new Date(lead.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <div>
                <span className="font-medium text-foreground">First Contact:</span>{" "}
                {lead.first_contact_at ? (
                  <span className="text-emerald-600 font-semibold">
                    {new Date(lead.first_contact_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                ) : (
                  <span className="text-amber-500 font-semibold">Awaiting first contact</span>
                )}
              </div>
            </div>
          </div>

          {/* Prominent Revenue & Clinical Resolution Overview */}
          <div className="mt-6 p-4 rounded-xl border border-border/70 bg-card/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Proposed Treatment
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(totalProposed)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {opportunities.length} {opportunities.length === 1 ? "procedure" : "procedures"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Accepted Quote
              </span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(totalAccepted)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Agreed clinical fee
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block">
                Revenue Collected
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(totalCollected)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Realized to clinic
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 block">
                Pending Balance
              </span>
              <span className={`text-lg font-bold ${pendingBalance > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
                {formatCurrency(pendingBalance)}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {pendingBalance > 0 ? "Due upon visit" : "Fully settled"}
              </span>
            </div>
          </div>

          {/* Pipeline Stage Progression Stepper */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pipeline Stage Progression (Click to Advance)
              </Label>
              {transitioning && (
                <span className="text-xs text-primary flex items-center gap-1 font-semibold">
                  <Loader2 className="h-3 w-3 animate-spin" /> Updating stage...
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {STAGES.map((stg) => {
                const isCurrent = lead.stage === stg.id;
                return (
                  <button
                    key={stg.id}
                    onClick={() => handleStageChange(stg.id)}
                    disabled={transitioning}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border cursor-pointer ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/30"
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
                  placeholder="Record an interaction note, patient concern, clinical requirement, or agreed callback time..."
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
                    Treatment Opportunities & Revenue
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
                  No treatment proposals created yet. Click &ldquo;+ Add Procedure&rdquo; to propose treatment.
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
                  No appointments booked yet. Click &ldquo;+ Book Visit&rdquo; to schedule a consultation.
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
                Communication and callback tasks assigned for this patient.
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
                            {(t.task_type || "follow_up").replace(/_/g, " ")}
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

      {/* Owner Confirmation Dialog for Deleting Lead */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">
              Permanently Delete Patient Enquiry?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{lead.name}</strong> ({lead.phone})?
              All associated consultations, treatment plans, follow-up tasks, and activity notes will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              {deleteError}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="text-xs gap-1.5"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
