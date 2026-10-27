"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { taskCreateSchema, taskCompleteSchema, type TaskCreateInput } from "@/lib/validations";
import type { FollowUpTask, TaskType } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface TaskQueueResult {
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
}

export async function getFollowUpQueue(): Promise<TaskQueueResult> {
  const { clinic } = await getAuthenticatedClinic();
  const supabase = createClient();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
  const nowIso = now.toISOString();

  const taskColumns = "id, clinic_id, lead_id, title, type, priority, status, due_at, completed_at, outcome, outcome_notes, created_at, lead:leads(id, name, phone, stage, service_interest)";

  // Fetch pending tasks and completed today tasks concurrently
  const [pendingRes, completedRes] = await Promise.all([
    supabase
      .from("follow_up_tasks")
      .select(taskColumns)
      .eq("clinic_id", clinic.id)
      .eq("status", "pending")
      .order("due_at", { ascending: true })
      .limit(250),
    supabase
      .from("follow_up_tasks")
      .select(taskColumns)
      .eq("clinic_id", clinic.id)
      .eq("status", "completed")
      .gte("completed_at", startOfDay)
      .lte("completed_at", endOfDay)
      .order("completed_at", { ascending: false })
      .limit(100),
  ]);

  if (pendingRes.error) {
    console.error("Error fetching pending tasks:", pendingRes.error.message);
  }
  if (completedRes.error) {
    console.error("Error fetching completed tasks:", completedRes.error.message);
  }

  const tasks = (pendingRes.data as unknown as FollowUpTask[]) || [];
  const completed = (completedRes.data as unknown as FollowUpTask[]) || [];

  const overdue: FollowUpTask[] = [];
  const dueToday: FollowUpTask[] = [];
  const upcoming: FollowUpTask[] = [];

  tasks.forEach((task) => {
    const dueTime = new Date(task.due_at).getTime();
    const currentTime = now.getTime();
    const endOfDayTime = new Date(endOfDay).getTime();

    if (dueTime < currentTime) {
      overdue.push(task);
    } else if (dueTime <= endOfDayTime) {
      dueToday.push(task);
    } else {
      upcoming.push(task);
    }
  });

  return {
    overdue,
    dueToday,
    upcoming,
    completedToday: completed,
    stats: {
      totalPending: tasks.length,
      overdueCount: overdue.length,
      dueTodayCount: dueToday.length,
      completedTodayCount: completed.length,
    },
  };
}

export async function createTask(input: TaskCreateInput) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const parsed = taskCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid task input" };
  }

  const { data: task, error } = await supabase
    .from("follow_up_tasks")
    .insert({
      clinic_id: clinic.id,
      lead_id: parsed.data.lead_id,
      assigned_to: parsed.data.assigned_to || user.id,
      task_type: parsed.data.task_type,
      due_at: parsed.data.due_at,
      status: "pending",
      notes: parsed.data.notes || null,
    })
    .select("*")
    .single();

  if (error || !task) {
    return { error: "Failed to schedule task." };
  }

  // Log timeline event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: parsed.data.lead_id,
    event_type: "follow_up_scheduled",
    actor_id: user.id,
    metadata: {
      task_id: task.id,
      task_type: task.task_type,
      due_at: task.due_at,
    },
  });

  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${parsed.data.lead_id}`);
  revalidatePath("/dashboard");

  return { success: true, task: task as FollowUpTask };
}

export async function completeTask(
  taskId: string,
  outcome: string,
  nextAction?: {
    scheduleNext?: boolean;
    nextDueAt?: string;
    nextTaskType?: TaskType;
    nextNotes?: string;
  }
) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const parsed = taskCompleteSchema.safeParse({ outcome });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Outcome notes are required." };
  }

  const { data: task, error: fetchErr } = await supabase
    .from("follow_up_tasks")
    .select("*, lead:leads(*)")
    .eq("id", taskId)
    .eq("clinic_id", clinic.id)
    .single();

  if (fetchErr || !task) {
    return { error: "Task not found." };
  }

  const completedAt = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("follow_up_tasks")
    .update({
      status: "completed",
      completed_at: completedAt,
      outcome: parsed.data.outcome,
      updated_at: completedAt,
    })
    .eq("id", taskId);

  if (updateErr) {
    return { error: "Failed to mark task as completed." };
  }

  // Record timeline event
  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: task.lead_id,
    event_type: "follow_up_completed",
    actor_id: user.id,
    metadata: {
      task_id: taskId,
      outcome: parsed.data.outcome,
      task_type: task.task_type,
    },
  });

  // Optionally schedule follow up next task
  if (nextAction?.scheduleNext && nextAction.nextDueAt && nextAction.nextTaskType) {
    await supabase.from("follow_up_tasks").insert({
      clinic_id: clinic.id,
      lead_id: task.lead_id,
      assigned_to: user.id,
      task_type: nextAction.nextTaskType,
      due_at: nextAction.nextDueAt,
      status: "pending",
      notes: nextAction.nextNotes || null,
    });
  }

  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${task.lead_id}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function rescheduleTask(taskId: string, newDueAt: string, reason?: string) {
  const { clinic, user } = await getAuthenticatedClinic();
  const supabase = createClient();

  const { data: task, error: fetchErr } = await supabase
    .from("follow_up_tasks")
    .select("lead_id, due_at")
    .eq("id", taskId)
    .eq("clinic_id", clinic.id)
    .single();

  if (fetchErr || !task) {
    return { error: "Task not found." };
  }

  const { error: updateErr } = await supabase
    .from("follow_up_tasks")
    .update({
      due_at: newDueAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (updateErr) {
    return { error: "Failed to reschedule task." };
  }

  await supabase.from("lead_events").insert({
    clinic_id: clinic.id,
    lead_id: task.lead_id,
    event_type: "follow_up_rescheduled",
    actor_id: user.id,
    metadata: {
      task_id: taskId,
      old_due_at: task.due_at,
      new_due_at: newDueAt,
      reason: reason || null,
    },
  });

  revalidatePath("/follow-ups");
  revalidatePath(`/leads/${task.lead_id}`);

  return { success: true };
}
