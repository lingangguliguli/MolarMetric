"use client";

import { useState } from "react";
import { createAppointment } from "@/app/actions/appointments";
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
import { Calendar, Loader2 } from "lucide-react";

interface NewAppointmentDialogProps {
  leadId: string;
  leadName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewAppointmentDialog({
  leadId,
  leadName,
  open,
  onOpenChange,
  onSuccess,
}: NewAppointmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scheduledAt, setScheduledAt] = useState("");
  const [bookingSource, setBookingSource] = useState("phone_call");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduledAt) return;
    setLoading(true);
    setError(null);

    const result = await createAppointment({
      lead_id: leadId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      booking_source: bookingSource,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
      setScheduledAt("");
      if (onSuccess) onSuccess();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Calendar className="h-5 w-5" />
            <DialogTitle>Book Clinic Appointment</DialogTitle>
          </div>
          <DialogDescription>
            Scheduling consultation for patient: <span className="font-semibold text-foreground">{leadName}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="scheduledAt">
              Date & Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Automatically advances lead stage to &ldquo;Appointment Booked&rdquo; and sets an appointment reminder task.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Booking Channel</Label>
            <Select value={bookingSource} onValueChange={setBookingSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone_call">Phone Call with Reception</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Conversation</SelectItem>
                <SelectItem value="walk_in">In-Person at Clinic Desk</SelectItem>
                <SelectItem value="website">Website Booking</SelectItem>
              </SelectContent>
            </Select>
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
                  Booking...
                </>
              ) : (
                "Confirm Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
