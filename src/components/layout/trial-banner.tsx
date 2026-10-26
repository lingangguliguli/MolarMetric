"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight, AlertTriangle } from "lucide-react";
import { getSubscriptionInfo } from "@/lib/subscription";
import type { Clinic } from "@/lib/types";

interface TrialBannerProps {
  clinic: Clinic;
}

export function TrialBanner({ clinic }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const sub = getSubscriptionInfo(clinic);

  // If user is already on a paid plan, or dismissed, don't show
  if (!sub.isTrial || dismissed) return null;

  // If expired
  if (sub.isExpired) {
    return (
      <div className="bg-rose-950/40 border-b border-rose-500/30 px-4 py-2 sm:px-6 text-rose-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 animate-bounce" />
            <span className="font-semibold text-rose-300">Trial Period Ended</span>
            <span className="hidden sm:inline text-rose-200/80">
              — Your 14-day clinical trial has expired. Activate a Pro Plan to resume automated WhatsApp workflows.
            </span>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs shadow-xs transition-colors flex-shrink-0"
          >
            <span>Activate Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // If active trial with <= 5 days remaining, show gentle urgency banner
  if (sub.remainingDays <= 5) {
    return (
      <div className="bg-amber-950/30 border-b border-amber-500/30 px-4 py-2 sm:px-6 text-amber-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-white">
              {sub.remainingDays === 1 ? "Last Day of Trial!" : `${sub.remainingDays} Days Left on Your Free Trial`}
            </span>
            <span className="hidden sm:inline text-amber-200/70">
              — Enjoying MolarMetric? Upgrade to keep patient recovery pipeline and automated reminders active.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/settings"
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 hover:text-white font-semibold text-xs transition-colors"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-stone-400 hover:text-stone-200 p-1"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
