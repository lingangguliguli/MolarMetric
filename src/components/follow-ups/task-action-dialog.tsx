"use client";

import { useState } from "react";
import { completeTask, rescheduleTask } from "@/app/actions/follow-ups";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { FollowUpTask, TaskType } from "@/lib/types";

interface TaskActionDialogProps {
  task: FollowUpTask | null;
  mode: "complete" | "reschedule" | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TaskActionDialog({
  task,
  mode,
  onClose,
  onSuccess,
}: TaskActionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Complete Form State
  const [outcome, setOutcome] = useState("");
  const [scheduleNext, setScheduleNext] = useState(false);
  const [nextDueAt, setNextDueAt] = useState("");
  const [nextTaskType, setNextTaskType] = useState<TaskType>("follow_up");
  const [nextNotes, setNextNotes] = useState("");

  // Reschedule Form State
  const [newDueDate, setNewDueDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");

  if (!task || !mode) return null;

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!task) return;
    setLoading(true);
    setError(null);

    const result = await completeTask(
      task.id,
      outcome,
      scheduleNext
        ? {
            scheduleNext: true,
            nextDueAt: new Date(nextDueAt).toISOString(),
            nextTaskType,
            nextNotes,
          }
        : undefined
    );

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
      onClose();
    }
  }

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!task || !newDueDate) return;
    setLoading(true);
    setError(null);

    const result = await rescheduleTask(
      task.id,
      new Date(newDueDate).toISOString(),
      rescheduleReason
    );

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
      onClose();
    }
  }

  return (
    <Dialog open={!!mode} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            {mode === "complete" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Clock className="h-5 w-5 text-amber-600" />
            )}
            <DialogTitle>
              {mode === "complete" ? "Complete Follow-up Task" : "Reschedule Follow-up"}
            </DialogTitle>
          </div>
          <DialogDescription>
            Patient: <span className="font-semibold text-foreground">{task.lead?.name}</span> ({task.lead?.phone})
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {mode === "complete" ? (
          <form onSubmit={handleComplete} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="outcome">
                Call / Follow-up Outcome <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="outcome"
                placeholder="e.g. Patient answered, discussed RCT cost. Interested in booking for this Saturday."
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={scheduleNext}
                  onChange={(e) => setScheduleNext(e.target.checked)}
                  className="rounded border-border"
                />
                Schedule Next Follow-up Task
              </label>

              {scheduleNext && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Next Task Type</Label>
                    <Select
                      value={nextTaskType}
                      onValueChange={(v) => setNextTaskType(v as TaskType)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow_up">General Follow-up</SelectItem>
                        <SelectItem value="callback">Patient Callback</SelectItem>
                        <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
                        <SelectItem value="treatment_follow_up">Treatment Plan Decision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Next Due Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={nextDueAt}
                      onChange={(e) => setNextDueAt(e.target.value)}
                      required={scheduleNext}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Next Notes (Optional)</Label>
                    <Input
                      placeholder="Follow up on weekend availability"
                      value={nextNotes}
                      onChange={(e) => setNextNotes(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Record Outcome & Complete"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReschedule} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newDate">
                New Due Date & Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newDate"
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason for Reschedule</Label>
              <Input
                id="reason"
                placeholder="e.g. Patient requested callback tomorrow at 5 PM"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reschedule Task"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
