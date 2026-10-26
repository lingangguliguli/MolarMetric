import { getDashboardData } from "@/app/actions/analytics";
import { ReportsView } from "@/components/reports/reports-view";
import { BarChart3 } from "lucide-react";

interface ReportsPageProps {
  searchParams: {
    range?: string;
  };
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const range = (searchParams.range as "7d" | "30d" | "90d" | "all") || "30d";
  const data = await getDashboardData(range);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Operational Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Conversion Analytics & Funnel Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed metrics on enquiry-to-appointment conversion, marketing channel efficacy, and treatment revenue realization.
        </p>
      </div>

      <ReportsView initialData={data} currentTimeRange={range} />
    </div>
  );
}
