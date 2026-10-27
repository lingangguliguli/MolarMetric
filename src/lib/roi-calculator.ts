/**
 * Pure ROI Calculation Utility for MolarMetric Practice Assessment
 * 
 * Provides transparent, capped, and guarded revenue recovery calculations
 * with zero risk of NaN, Infinity, or negative recovery values.
 */

export const DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS = 16;
export const MAX_CONVERSION_RATE_CAP = 60; // Hard cap on simulated conversion rate

export interface RoiCalculationInput {
  enquiries: number;
  avgTicket: number;
  currentConversion: number; // e.g. 20 for 20%
  upliftPoints?: number;     // e.g. 16 percentage points
}

export interface RoiCalculationResult {
  baselineConversion: number;
  effectiveUplift: number;
  projectedConversion: number;
  currentRevenue: number;
  potentialRevenue: number;
  recoveredMonthlyRevenue: number;
  annualRecoveredRevenue: number;
  isCapped: boolean;
}

/**
 * Calculates hypothetical revenue recovery estimates.
 * Results are illustrative projections based on transparent assumptions,
 * not guaranteed financial results.
 */
export function calculateRoi(input: RoiCalculationInput): RoiCalculationResult {
  // 1. Sanitize and validate inputs
  const enquiries = Number.isFinite(input.enquiries) ? Math.max(0, Math.round(input.enquiries)) : 0;
  const avgTicket = Number.isFinite(input.avgTicket) ? Math.max(0, Math.round(input.avgTicket)) : 0;
  const rawConversion = Number.isFinite(input.currentConversion) ? Math.max(0, input.currentConversion) : 0;
  const baselineConversion = Math.min(MAX_CONVERSION_RATE_CAP, Math.round(rawConversion));

  const uplift = Number.isFinite(input.upliftPoints) && input.upliftPoints !== undefined
    ? Math.max(0, input.upliftPoints)
    : DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS;

  // 2. Project conversion with strict 60% cap
  const uncappedProjected = baselineConversion + uplift;
  const projectedConversion = Math.min(MAX_CONVERSION_RATE_CAP, uncappedProjected);
  const effectiveUplift = Math.max(0, projectedConversion - baselineConversion);
  const isCapped = uncappedProjected > MAX_CONVERSION_RATE_CAP;

  // 3. Compute baseline and potential revenue
  const currentRevenue = Math.round(enquiries * (baselineConversion / 100) * avgTicket);
  const potentialRevenue = Math.round(enquiries * (projectedConversion / 100) * avgTicket);
  const recoveredMonthlyRevenue = Math.max(0, potentialRevenue - currentRevenue);
  const annualRecoveredRevenue = recoveredMonthlyRevenue * 12;

  return {
    baselineConversion,
    effectiveUplift,
    projectedConversion,
    currentRevenue,
    potentialRevenue,
    recoveredMonthlyRevenue,
    annualRecoveredRevenue,
    isCapped,
  };
}
