"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        An error occurred while loading this section of your clinic workspace. Your patient data is safe.
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          className="gap-2"
        >
          Reload Page
        </Button>
      </div>
    </div>
  );
}
