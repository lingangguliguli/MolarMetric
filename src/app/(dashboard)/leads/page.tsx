import { getLeads } from "@/app/actions/leads";
import { LeadsTableView } from "@/components/leads/leads-table-view";
import { Users } from "lucide-react";
import type { LeadStage, LeadSource } from "@/lib/types";

interface LeadsPageProps {
  searchParams: {
    stage?: string;
    source?: string;
    search?: string;
    page?: string;
  };
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const stage = (searchParams.stage as LeadStage | "all") || "all";
  const source = (searchParams.source as LeadSource | "all") || "all";
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10);

  const leadsData = await getLeads({
    stage,
    source,
    search,
    page,
    pageSize: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Users className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Patient Enquiries & Leads
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Enquiry Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track, follow up, and advance patient enquiries across your clinic&apos;s revenue pipeline.
        </p>
      </div>

      <LeadsTableView
        initialData={leadsData}
        currentStage={stage}
        currentSource={source}
        currentSearch={search}
      />
    </div>
  );
}
