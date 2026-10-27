export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-300">
        {/* Animated Brand Logo Placeholder */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10">
            <div className="w-6 h-6 rounded-lg bg-primary animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-xl border border-primary/20 animate-ping opacity-25" />
        </div>

        <div className="space-y-1.5 text-center">
          <p className="text-sm font-semibold tracking-wide text-foreground">
            MolarMetric OS
          </p>
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading practice workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
