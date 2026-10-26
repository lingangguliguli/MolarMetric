"use client";

import { useState } from "react";
import { dismissDailyMotivation } from "@/app/actions/motivation";
import { Sparkles, X } from "lucide-react";

interface MotivationBannerProps {
  initialMotivation: {
    id: string;
    message: string;
    category: string;
  } | null;
}

export function MotivationBanner({ initialMotivation }: MotivationBannerProps) {
  const [motivation, setMotivation] = useState(initialMotivation);
  const [dismissed, setDismissed] = useState(false);

  if (!motivation || dismissed) return null;

  async function handleDismiss() {
    setDismissed(true);
    if (motivation?.id) {
      await dismissDailyMotivation(motivation.id);
    }
  }

  return (
    <div className="bg-gradient-to-r from-champagne/20 via-primary/10 to-champagne/15 border-b border-champagne/30 px-4 py-2 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="font-semibold text-primary uppercase text-[10px] tracking-wider bg-white/70 px-2 py-0.5 rounded shadow-2xs">
            {motivation.category}
          </span>
          <p className="text-foreground/90 font-medium truncate">
            &ldquo;{motivation.message}&rdquo;
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors flex-shrink-0"
          title="Dismiss for today"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
