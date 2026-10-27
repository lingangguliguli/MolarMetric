import { getTreatmentOpportunities } from "@/app/actions/treatments";
import { getClinicLeadsList } from "@/app/actions/leads";
import { TreatmentsView } from "@/components/treatments/treatments-view";
import { Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TreatmentsPage() {
  const [opportunities, clinicLeads] = await Promise.all([
    getTreatmentOpportunities({}),
    getClinicLeadsList(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Activity className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Clinical Revenue Pipeline
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Treatment Opportunities & Collections
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track proposed clinical case values, patient acceptance rates, and actual collections.
        </p>
      </div>

      <TreatmentsView
        initialOpportunities={opportunities}
        leadsList={clinicLeads}
      />
    </div>
  );
}
