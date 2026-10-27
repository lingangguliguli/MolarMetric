"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/app/actions/appointments";
import { createLead, getClinicLeadsList } from "@/app/actions/leads";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2, UserPlus, Users, Search } from "lucide-react";

export interface LeadOption {
  id: string;
  name: string;
  phone: string;
  service_interest?: string | null;
  stage?: string;
}

interface NewAppointmentDialogProps {
  leadId?: string;
  leadName?: string;
  leads?: LeadOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewAppointmentDialog({
  leadId: initialLeadId,
  leadName: initialLeadName,
  leads: initialLeads,
  open,
  onOpenChange,
  onSuccess,
}: NewAppointmentDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mode: "existing" or "new"
  const [mode, setMode] = useState<"existing" | "new">(initialLeadId ? "existing" : "existing");
  const [leadsList, setLeadsList] = useState<LeadOption[]>(initialLeads || []);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Selected lead
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId || "");
  const [searchFilter, setSearchFilter] = useState("");

  // New lead fields
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newService, setNewService] = useState("");

  // Appointment fields
  const [scheduledAt, setScheduledAt] = useState("");
  const [bookingSource, setBookingSource] = useState("phone_call");

  // Keep selectedLeadId in sync if initialLeadId changes
  useEffect(() => {
    if (initialLeadId) {
      setSelectedLeadId(initialLeadId);
      setMode("existing");
    }
  }, [initialLeadId]);

  // Load clinic leads if not provided and no initial lead
  useEffect(() => {
    if (open && !initialLeadId && (!initialLeads || initialLeads.length === 0)) {
      setLoadingLeads(true);
      getClinicLeadsList()
        .then((data) => {
          setLeadsList(data);
          if (data.length > 0 && !selectedLeadId) {
            setSelectedLeadId(data[0].id);
          } else if (data.length === 0) {
            setMode("new");
          }
        })
        .finally(() => setLoadingLeads(false));
    } else if (initialLeads && initialLeads.length > 0) {
      setLeadsList(initialLeads);
      if (!selectedLeadId && !initialLeadId) {
        setSelectedLeadId(initialLeads[0].id);
      }
    }
  }, [open, initialLeadId, initialLeads]);

  // Filtered leads for search
  const filteredLeads = leadsList.filter((l) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.service_interest && l.service_interest.toLowerCase().includes(q))
    );
  });

  const currentLeadName = initialLeadName || leadsList.find((l) => l.id === selectedLeadId)?.name;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduledAt) {
      setError("Please select appointment date and time.");
      return;
    }

    setLoading(true);
    setError(null);

    let effectiveLeadId = selectedLeadId;

    try {
      // If creating a new lead inline
      if (!initialLeadId && mode === "new") {
        if (!newName.trim() || !newPhone.trim()) {
          setError("Patient name and 10-digit mobile phone are required.");
          setLoading(false);
          return;
        }

        const leadRes = await createLead({
          name: newName.trim(),
          phone: newPhone.trim(),
          source: "phone",
          service_interest: newService.trim() || undefined,
          consent_whatsapp: true,
          consent_sms: false,
          consent_email: false,
        });

        if (leadRes.error || !leadRes.lead) {
          setError(leadRes.error || "Failed to create patient enquiry.");
          setLoading(false);
          return;
        }

        effectiveLeadId = leadRes.lead.id;
      }

      if (!effectiveLeadId) {
        setError("Please select an existing patient enquiry or enter new patient details.");
        setLoading(false);
        return;
      }

      const result = await createAppointment({
        lead_id: effectiveLeadId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        booking_source: bookingSource,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setLoading(false);
        onOpenChange(false);
        setScheduledAt("");
        setNewName("");
        setNewPhone("");
        setNewService("");
        router.refresh();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error("New appointment submission error:", err);
      setError(err?.message || "Failed to book appointment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Calendar className="h-5 w-5" />
            <DialogTitle>Book Clinic Appointment</DialogTitle>
          </div>
          <DialogDescription>
            {initialLeadId ? (
              <>
                Scheduling consultation for patient:{" "}
                <span className="font-semibold text-foreground">{currentLeadName}</span>
              </>
            ) : (
              "Schedule a consultation for an existing enquiry or log a new patient visit."
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection (only shown when not pre-scoped to a specific lead) */}
          {!initialLeadId && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Patient Information</Label>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setMode("existing")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      mode === "existing"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Users className="inline h-3.5 w-3.5 mr-1" />
                    Existing Enquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("new")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      mode === "new"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserPlus className="inline h-3.5 w-3.5 mr-1" />
                    + New Patient
                  </button>
                </div>
              </div>

              {mode === "existing" ? (
                <div className="space-y-2">
                  {leadsList.length > 5 && (
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Filter by patient name or phone..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-8 h-8 text-xs"
                      />
                    </div>
                  )}

                  {loadingLeads ? (
                    <div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading patient enquiries...
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="p-3 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                      No matching patient enquiries found. Switch to &ldquo;+ New Patient&rdquo; to create one.
                    </div>
                  ) : (
                    <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select patient enquiry..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {filteredLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id} className="text-xs">
                            <span className="font-semibold text-foreground">{lead.name}</span>
                            <span className="text-muted-foreground ml-2 font-mono">({lead.phone})</span>
                            {lead.service_interest && (
                              <span className="text-primary/80 ml-2">• {lead.service_interest}</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <Label htmlFor="new-patient-name" className="text-xs">
                        Patient Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="new-patient-name"
                        placeholder="e.g. Priya Patel"
                        className="h-8 text-xs"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required={mode === "new"}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new-patient-phone" className="text-xs">
                        Mobile Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="new-patient-phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        className="h-8 text-xs font-mono"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        required={mode === "new"}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-patient-service" className="text-xs">
                      Treatment Concern / Requirement (Optional)
                    </Label>
                    <Input
                      id="new-patient-service"
                      placeholder="e.g. Root Canal, Teeth Whitening, Toothache"
                      className="h-8 text-xs"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This will create a new patient enquiry and immediately schedule their appointment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Appointment Schedule Details */}
          <div className="space-y-1.5">
            <Label htmlFor="scheduledAt" className="text-xs">
              Appointment Date & Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              className="h-9 text-xs"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Automatically advances patient status to &ldquo;Appointment Booked&rdquo; and syncs with Follow-up reminders.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Booking Channel</Label>
            <Select value={bookingSource} onValueChange={setBookingSource}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone_call" className="text-xs">Phone Call with Reception</SelectItem>
                <SelectItem value="whatsapp" className="text-xs">WhatsApp Conversation</SelectItem>
                <SelectItem value="walk_in" className="text-xs">In-Person at Clinic Desk</SelectItem>
                <SelectItem value="website" className="text-xs">Website Booking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="text-xs gap-1.5">
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Calendar className="h-3.5 w-3.5" />
                  Confirm Appointment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
