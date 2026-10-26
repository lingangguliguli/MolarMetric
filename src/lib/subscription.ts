import type { Clinic } from "@/lib/types";

export interface SubscriptionInfo {
  tier: string;
  status: "trialing" | "active" | "past_due" | "canceled" | "expired";
  isTrial: boolean;
  isPaid: boolean;
  isExpired: boolean;
  remainingDays: number;
  totalTrialDays: number;
  trialEndsAt: Date;
  formattedExpiresAt: string;
  trialPercentRemaining: number;
}

/**
 * Calculates current trial / subscription status for a clinic workspace.
 * Automatically gives every new clinic a 14-day free trial based on created_at or trial_ends_at.
 */
export function getSubscriptionInfo(clinic: Clinic): SubscriptionInfo {
  const createdDate = new Date(clinic.created_at || Date.now());
  const trialEndsAt = clinic.trial_ends_at
    ? new Date(clinic.trial_ends_at)
    : new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  const now = new Date();
  const diffMs = trialEndsAt.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const isPaid = clinic.subscription_status === "active";
  const isTrial = !isPaid;
  const isExpired = isTrial && remainingDays <= 0;

  let status: "trialing" | "active" | "past_due" | "canceled" | "expired" = "trialing";
  if (isPaid) {
    status = "active";
  } else if (clinic.subscription_status === "past_due") {
    status = "past_due";
  } else if (clinic.subscription_status === "canceled") {
    status = "canceled";
  } else if (isExpired) {
    status = "expired";
  }

  // 14 days total trial
  const totalTrialDays = 14;
  const trialPercentRemaining = Math.min(
    100,
    Math.max(0, Math.round((remainingDays / totalTrialDays) * 100))
  );

  const tier =
    clinic.subscription_tier || (isPaid ? "Pro Plan" : "14-Day Pro Trial");

  return {
    tier,
    status,
    isTrial,
    isPaid,
    isExpired,
    remainingDays,
    totalTrialDays,
    trialEndsAt,
    formattedExpiresAt: trialEndsAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    trialPercentRemaining,
  };
}
