import { getMessageTemplates } from "@/app/actions/templates";
import { TemplatesView } from "@/components/templates/templates-view";
import { MessageSquare } from "lucide-react";

export default async function TemplatesPage() {
  const templates = await getMessageTemplates();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Patient Communication
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          WhatsApp Message Templates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Standardized WhatsApp messages with merge fields for welcome greetings, appointment reminders, and recall follow-ups.
        </p>
      </div>

      <TemplatesView initialTemplates={templates} />
    </div>
  );
}
