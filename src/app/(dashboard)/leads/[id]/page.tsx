import { getLeadById } from "@/app/actions/leads";
import { LeadDetailView } from "@/components/leads/lead-detail-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface LeadDetailPageProps {
  params: {
    id: string;
  };
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const data = await getLeadById(params.id);

  if (!data) {
    return (
      <div className="py-20 text-center space-y-4">
        <Users className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
        <h1 className="text-xl font-bold text-foreground">Enquiry Not Found</h1>
        <p className="text-sm text-muted-foreground">
          This patient enquiry does not exist or has been removed.
        </p>
        <Link href="/leads">
          <Button variant="outline" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <LeadDetailView
      lead={data.lead}
      events={data.events as any}
      tasks={data.tasks as any}
      appointments={data.appointments as any}
      opportunities={data.opportunities as any}
    />
  );
}
