import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/60 rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-muted/40 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-36 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-primary/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-3.5 w-28 bg-muted/60 rounded animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-muted/40 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-7 w-20 bg-muted/70 rounded animate-pulse" />
              <div className="h-3 w-36 bg-muted/30 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Metrics / Funnel Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/60 bg-card/50">
          <CardHeader>
            <div className="h-5 w-48 bg-muted/60 rounded animate-pulse" />
            <div className="h-3.5 w-72 bg-muted/30 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[100, 80, 60, 45, 30].map((width, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-muted/40 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-muted/40 rounded animate-pulse" />
                </div>
                <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full bg-primary/30 rounded-full animate-pulse"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Card Skeleton */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <div className="h-5 w-40 bg-muted/60 rounded animate-pulse" />
            <div className="h-3.5 w-56 bg-muted/30 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="space-y-1">
                  <div className="h-3.5 w-24 bg-muted/50 rounded animate-pulse" />
                  <div className="h-2.5 w-16 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-muted/40 rounded-full animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table Skeleton */}
      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <div className="h-5 w-44 bg-muted/60 rounded animate-pulse" />
          <div className="h-3.5 w-64 bg-muted/30 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted/50 animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-32 bg-muted/60 rounded animate-pulse" />
                    <div className="h-2.5 w-20 bg-muted/30 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
