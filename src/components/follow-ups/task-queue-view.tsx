"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskActionDialog } from "./task-action-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import type { FollowUpTask } from "@/lib/types";
import type { TaskQueueResult } from "@/app/actions/follow-ups";
import { generateWhatsAppUrl } from "@/lib/utils";

interface TaskQueueViewProps {
  initialQueue: {
    overdue: FollowUpTask[];
    dueToday: FollowUpTask[];
    upcoming: FollowUpTask[];
    completedToday: FollowUpTask[];
    stats: {
      totalPending: number;
      overdueCount: number;
      dueTodayCount: number;
      completedTodayCount: number;
    };
  };
}

export function TaskQueueView({ initialQueue }: TaskQueueViewProps) {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null);
  const [dialogMode, setDialogMode] = useState<"complete" | "reschedule" | null>(null);

  const { overdue, dueToday, upcoming, completedToday, stats } = initialQueue;

  function renderTaskList(tasks: FollowUpTask[], isCompleted = false) {
    if (tasks.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground text-sm">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
          <p className="font-medium">No tasks in this queue.</p>
          <p className="text-xs mt-1">You are all caught up!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasks.map((task) => {
          const isOverdue =
            task.status === "pending" && new Date(task.due_at) < new Date();
          const whatsappUrl = task.lead?.phone
            ? generateWhatsAppUrl(
                task.lead.phone,
                `Hello ${task.lead.name}, this is regarding your dental enquiry at our clinic. Let us know when would be a convenient time to speak!`
              )
            : "#";

          return (
            <Card
              key={task.id}
              className={`border transition-all ${
                isOverdue
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/leads/${task.lead_id}`}
                      className="font-bold text-base text-foreground hover:text-primary transition-colors truncate"
                    >
                      {task.lead?.name || "Patient"}
                    </Link>
                    <Badge variant="outline" className="text-[10px] capitalize font-medium">
                      {task.task_type.replace("_", " ")}
                    </Badge>
                    {isOverdue && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive text-destructive-foreground">
                        OVERDUE
                      </span>
                    )}
                    {task.status === "completed" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono text-foreground font-medium">
                      {task.lead?.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(task.due_at).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {task.lead?.service_interest && (
                      <>
                        <span>•</span>
                        <span>Interest: {task.lead.service_interest}</span>
                      </>
                    )}
                  </div>

                  {task.notes && (
                    <p className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg mt-2">
                      <span className="font-semibold text-foreground">Note:</span> {task.notes}
                    </p>
                  )}

                  {task.outcome && (
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2 rounded-lg mt-2">
                      <span className="font-semibold">Outcome:</span> {task.outcome}
                    </p>
                  )}
                </div>

                {/* Task Actions */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                    {task.lead?.phone && (
                      <a
                        href={`tel:${task.lead.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-foreground"
                      >
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        Call
                      </a>
                    )}

                    {task.lead?.phone && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => {
                        setSelectedTask(task);
                        setDialogMode("reschedule");
                      }}
                    >
                      Reschedule
                    </Button>

                    <Button
                      size="sm"
                      className="text-xs h-8 gap-1"
                      onClick={() => {
                        setSelectedTask(task);
                        setDialogMode("complete");
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Complete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5">
          <span className="text-xs font-semibold text-destructive block">Overdue Tasks</span>
          <span className="text-2xl font-bold text-destructive mt-0.5 block">
            {stats.overdueCount}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block">Due Today</span>
          <span className="text-2xl font-bold text-foreground mt-0.5 block">
            {stats.dueTodayCount}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-xs font-semibold text-muted-foreground block">Upcoming</span>
          <span className="text-2xl font-bold text-foreground mt-0.5 block">
            {upcoming.length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">Completed Today</span>
          <span className="text-2xl font-bold text-emerald-600 mt-0.5 block">
            {stats.completedTodayCount}
          </span>
        </div>
      </div>

      {/* Tabs for Task Lists */}
      <Tabs defaultValue={stats.overdueCount > 0 ? "overdue" : "dueToday"} className="w-full">
        <TabsList className="grid grid-cols-4 w-full sm:w-[500px]">
          <TabsTrigger value="overdue" className="text-xs">
            Overdue ({stats.overdueCount})
          </TabsTrigger>
          <TabsTrigger value="dueToday" className="text-xs">
            Today ({stats.dueTodayCount})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Done ({stats.completedTodayCount})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="overdue">
            {renderTaskList(overdue)}
          </TabsContent>
          <TabsContent value="dueToday">
            {renderTaskList(dueToday)}
          </TabsContent>
          <TabsContent value="upcoming">
            {renderTaskList(upcoming)}
          </TabsContent>
          <TabsContent value="completed">
            {renderTaskList(completedToday, true)}
          </TabsContent>
        </div>
      </Tabs>

      {/* Action Dialog */}
      <TaskActionDialog
        task={selectedTask}
        mode={dialogMode}
        onClose={() => {
          setSelectedTask(null);
          setDialogMode(null);
        }}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
