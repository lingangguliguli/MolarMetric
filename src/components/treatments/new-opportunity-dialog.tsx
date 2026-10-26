"use client";

import { useState } from "react";
import { createTreatmentOpportunity } from "@/app/actions/treatments";
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
import { Activity, IndianRupee, Loader2 } from "lucide-react";

interface NewOpportunityDialogProps {
  leadId: string;
  leadName: string;
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
  leadId,
  leadName,
  open,
  onOpenChange,
  onSuccess,
}: NewOpportunityDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [proposedValue, setProposedValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(proposedValue);
    if (!val || val <= 0) {
      setError("Please enter a valid treatment estimate.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createTreatmentOpportunity({
      lead_id: leadId,
      service_category: category,
      proposed_value: val,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
      setProposedValue("");
      if (onSuccess) onSuccess();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Activity className="h-5 w-5" />
            <DialogTitle>Propose Treatment Plan</DialogTitle>
          </div>
          <DialogDescription>
            Record proposed clinical procedure value for patient: <span className="font-semibold text-foreground">{leadName}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Treatment Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposedValue">
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
                className="pl-9 font-mono"
                value={proposedValue}
                onChange={(e) => setProposedValue(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically updates stage to &ldquo;Treatment Proposed&rdquo; and schedules a 48h decision follow-up task.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Save Treatment Plan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
