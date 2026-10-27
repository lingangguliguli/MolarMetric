"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTreatmentOpportunity } from "@/app/actions/treatments";
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
import { Activity, IndianRupee, Loader2, Users, UserPlus, Search } from "lucide-react";

export interface LeadOption {
  id: string;
  name: string;
  phone: string;
  service_interest?: string | null;
  stage?: string;
}

interface NewOpportunityDialogProps {
  leadId?: string;
  leadName?: string;
  leads?: LeadOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SERVICE_CATEGORIES = [
  "Dental Implants",
  "Orthodontics / Aligners",
  "Root Canal Treatment (RCT)",
  "Crown & Bridge Prosthetics",
  "Cosmetic Veneers & Smile Design",
  "Teeth Whitening",
  "Periodontal Surgery",
  "Pediatric Dental Care",
  "General Dentistry & Cleanings",
];

export function NewOpportunityDialog({
  leadId: initialLeadId,
  leadName: initialLeadName,
  leads: initialLeads,
  open,
  onOpenChange,
  onSuccess,
}: NewOpportunityDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Patient selection mode
  const [mode, setMode] = useState<"existing" | "new">(initialLeadId ? "existing" : "existing");
  const [leadsList, setLeadsList] = useState<LeadOption[]>(initialLeads || []);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Selected lead
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId || "");
  const [searchFilter, setSearchFilter] = useState("");

  // New lead fields
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Treatment plan fields
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [proposedValue, setProposedValue] = useState("");

  useEffect(() => {
    if (initialLeadId) {
      setSelectedLeadId(initialLeadId);
      setMode("existing");
    }
  }, [initialLeadId]);

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
    const val = parseFloat(proposedValue);
    if (!val || val <= 0) {
      setError("Please enter a valid treatment estimate.");
      return;
    }

    setLoading(true);
    setError(null);

    let effectiveLeadId = selectedLeadId;

    try {
      if (!initialLeadId && mode === "new") {
        if (!newName.trim() || !newPhone.trim()) {
          setError("Patient name and 10-digit mobile phone are required.");
          setLoading(false);
          return;
        }

        const leadRes = await createLead({
          name: newName.trim(),
          phone: newPhone.trim(),
          source: "walk_in",
          service_interest: category,
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

      const result = await createTreatmentOpportunity({
        lead_id: effectiveLeadId,
        service_category: category,
        proposed_value: val,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setLoading(false);
        onOpenChange(false);
        setProposedValue("");
        setNewName("");
        setNewPhone("");
        router.refresh();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error("Treatment proposal error:", err);
      setError(err?.message || "Failed to propose treatment plan.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Activity className="h-5 w-5" />
            <DialogTitle>Propose Treatment Plan</DialogTitle>
          </div>
          <DialogDescription>
            {initialLeadId ? (
              <>
                Record proposed clinical procedure value for patient:{" "}
                <span className="font-semibold text-foreground">{currentLeadName}</span>
              </>
            ) : (
              "Create a clinical treatment proposal for an existing patient or add a new patient plan."
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection (if not scoped to a specific lead) */}
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
                      <Label htmlFor="opp-patient-name" className="text-xs">
                        Patient Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="opp-patient-name"
                        placeholder="e.g. Rahul Sharma"
                        className="h-8 text-xs"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required={mode === "new"}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="opp-patient-phone" className="text-xs">
                        Mobile Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="opp-patient-phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        className="h-8 text-xs font-mono"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        required={mode === "new"}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    This will log a patient enquiry and propose this treatment plan in one step.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposedValue" className="text-xs">
              Estimated / Proposed Fee (INR ₹) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="proposedValue"
                type="number"
                min="100"
                step="100"
                placeholder="45000"
                className="pl-9 font-mono h-9 text-xs"
                value={proposedValue}
                onChange={(e) => setProposedValue(e.target.value)}
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automatically advances patient stage to &ldquo;Treatment Proposed&rdquo; and sets a 48h decision follow-up task.
            </p>
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
                  Recording...
                </>
              ) : (
                <>
                  <Activity className="h-3.5 w-3.5" />
                  Save Treatment Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
