import { getLeads } from "@/app/actions/leads";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { LeadsTableView } from "@/components/leads/leads-table-view";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";
import { Users } from "lucide-react";
import type { LeadStage, LeadSource } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  const [leadsData, { role }] = await Promise.all([
    getLeads({
      stage,
      source,
      search,
      page,
      pageSize: 20,
    }),
    getAuthenticatedClinic(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <NewLeadDialog />
      </div>

      <LeadsTableView
        initialData={leadsData}
        currentStage={stage}
        currentSource={source}
        currentSearch={search}
        currentUserRole={role}
      />
    </div>
  );
}
