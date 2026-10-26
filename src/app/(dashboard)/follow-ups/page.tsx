import { getFollowUpQueue } from "@/app/actions/follow-ups";
import { TaskQueueView } from "@/components/follow-ups/task-queue-view";
import { ListTodo } from "lucide-react";

export default async function FollowUpsPage() {
  const queue = await getFollowUpQueue();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <ListTodo className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Receptionist Action Queue
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Follow-up Task Queue
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Coordinate calls, messages, and reminders. Ensure zero enquiries slip through the cracks.
        </p>
      </div>

      <TaskQueueView initialQueue={queue} />
    </div>
  );
}
