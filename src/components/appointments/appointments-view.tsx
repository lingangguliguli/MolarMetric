"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { generateWhatsAppUrl } from "@/lib/utils";

interface AppointmentsViewProps {
  initialAppointments: Appointment[];
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string }> = {
  booked: { label: "Booked", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  confirmed: { label: "Confirmed", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" },
  attended: { label: "Attended", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  missed: { label: "Missed", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/20" },
  rescheduled: { label: "Rescheduled", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" },
};

export function AppointmentsView({ initialAppointments }: AppointmentsViewProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = filter === "all"
    ? initialAppointments
    : initialAppointments.filter((a) => a.status === filter);

  async function handleStatusChange(id: string, status: AppointmentStatus, outcome?: string) {
    setUpdatingId(id);
    await updateAppointmentStatus(id, { status, outcome });
    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full font-medium transition-all ${
            filter === "all"
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All ({initialAppointments.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = initialAppointments.filter((a) => a.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as AppointmentStatus)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                filter === key
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Appointment Cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm border rounded-xl bg-card">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="font-medium text-foreground">No appointments found in this status.</p>
          <p className="text-xs mt-1">Book appointments from any patient enquiry profile.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => {
            const statusConfig = STATUS_CONFIG[appt.status] || STATUS_CONFIG.booked;
            const scheduledDate = new Date(appt.scheduled_at);
            const isToday =
              scheduledDate.toDateString() === new Date().toDateString();

            const waLink = appt.lead?.phone
              ? generateWhatsAppUrl(
                  appt.lead.phone,
                  `Hello ${appt.lead.name}, this is a reminder of your appointment at our clinic on ${scheduledDate.toLocaleDateString("en-IN")} at ${scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}.`
                )
              : "#";

            return (
              <Card
                key={appt.id}
                className={`border transition-all ${
                  isToday
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/leads/${appt.lead_id}`}
                        className="font-bold text-base text-foreground hover:text-primary transition-colors"
                      >
                        {appt.lead?.name || "Patient"}
                      </Link>
                      <Badge variant="outline" className={`text-[10px] font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </Badge>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono text-foreground font-medium">
                        {appt.lead?.phone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Clock className="h-3 w-3 text-primary" />
                        {scheduledDate.toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        Channel: {appt.booking_source?.replace("_", " ") || "Reception"}
                      </span>
                    </div>

                    {appt.outcome && (
                      <p className="text-xs text-muted-foreground mt-2 bg-muted/40 p-2 rounded-lg">
                        <span className="font-semibold text-foreground">Outcome Note:</span> {appt.outcome}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                    {appt.lead?.phone && (
                      <a
                        href={`tel:${appt.lead.phone}`}
                        className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                        title="Call"
                      >
                        <Phone className="h-3.5 w-3.5 text-primary" />
                      </a>
                    )}

                    {appt.lead?.phone && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                        title="WhatsApp Reminder"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </a>
                    )}

                    {appt.status !== "attended" && (
                      <Button
                        size="sm"
                        className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={updatingId === appt.id}
                        onClick={() => handleStatusChange(appt.id, "attended", "Patient arrived and was examined")}
                      >
                        {updatingId === appt.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Mark Attended
                      </Button>
                    )}

                    {appt.status === "booked" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-amber-700 dark:text-amber-400"
                        disabled={updatingId === appt.id}
                        onClick={() => handleStatusChange(appt.id, "missed", "Patient did not attend appointment")}
                      >
                        Missed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
