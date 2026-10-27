"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-4 shadow-lg shadow-destructive/10">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Application Error
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        We encountered an unexpected error. Please try reloading the page or return to the main dashboard.
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => reset()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retry
        </Button>
        <Link href="/dashboard">
          <Button size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
