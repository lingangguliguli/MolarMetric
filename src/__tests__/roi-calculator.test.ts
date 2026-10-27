import { describe, it, expect } from "vitest";
import {
  calculateRoi,
  DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS,
  MAX_CONVERSION_RATE_CAP,
} from "@/lib/roi-calculator";

describe("ROI Calculator Unit Tests", () => {
  const baselines = [10, 20, 45];
  const enquiries = [30, 120, 500];
  const standardTicket = 25000;

  // 1. Test all 9 combinations (10%, 20%, 45% x 30, 120, 500)
  describe("All 9 baseline & enquiry combinations", () => {
    baselines.forEach((baseline) => {
      enquiries.forEach((enquiryCount) => {
        it(`calculates correctly for baseline ${baseline}% and ${enquiryCount} enquiries`, () => {
          const result = calculateRoi({
            enquiries: enquiryCount,
            avgTicket: standardTicket,
            currentConversion: baseline,
          });

          // Verify baseline conversion is preserved
          expect(result.baselineConversion).toBe(baseline);

          // Verify projected conversion is baseline + 16% (or capped at 60%)
          const expectedProjected = Math.min(60, baseline + DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS);
          expect(result.projectedConversion).toBe(expectedProjected);

          // Check effective uplift
          expect(result.effectiveUplift).toBe(expectedProjected - baseline);

          // Check revenue calculations are mathematical integers >= 0
          expect(result.currentRevenue).toBeGreaterThanOrEqual(0);
          expect(result.potentialRevenue).toBeGreaterThanOrEqual(result.currentRevenue);
          expect(result.recoveredMonthlyRevenue).toBe(result.potentialRevenue - result.currentRevenue);
          expect(result.annualRecoveredRevenue).toBe(result.recoveredMonthlyRevenue * 12);
          expect(Number.isFinite(result.recoveredMonthlyRevenue)).toBe(true);
        });
      });
    });
  });

  // 2. Strict 60% cap verification
  describe("Strict 60% conversion cap enforcement", () => {
    it("caps high baseline + uplift at exactly 60%", () => {
      // 50% baseline + 16% uplift = 66% without cap -> must cap at 60%
      const result = calculateRoi({
        enquiries: 100,
        avgTicket: 20000,
        currentConversion: 50,
      });

      expect(result.projectedConversion).toBe(MAX_CONVERSION_RATE_CAP);
      expect(result.effectiveUplift).toBe(10); // 60 - 50 = 10
      expect(result.isCapped).toBe(true);
    });

    it("caps when baseline itself exceeds 60%", () => {
      const result = calculateRoi({
        enquiries: 100,
        avgTicket: 20000,
        currentConversion: 75,
      });

      expect(result.baselineConversion).toBe(60);
      expect(result.projectedConversion).toBe(60);
      expect(result.effectiveUplift).toBe(0);
      expect(result.recoveredMonthlyRevenue).toBe(0);
    });
  });

  // 3. Zero enquiries handling
  describe("Zero enquiries boundary", () => {
    it("returns zero revenue when enquiries = 0", () => {
      const result = calculateRoi({
        enquiries: 0,
        avgTicket: 35000,
        currentConversion: 20,
      });

      expect(result.currentRevenue).toBe(0);
      expect(result.potentialRevenue).toBe(0);
      expect(result.recoveredMonthlyRevenue).toBe(0);
      expect(result.annualRecoveredRevenue).toBe(0);
    });
  });

  // 4. Invalid inputs, negative values, and NaN/Infinity guards
  describe("Invalid, negative, and edge case guards", () => {
    it("handles negative enquiries gracefully without negative revenue", () => {
      const result = calculateRoi({
        enquiries: -50,
        avgTicket: 25000,
        currentConversion: 20,
      });

      expect(result.currentRevenue).toBe(0);
      expect(result.recoveredMonthlyRevenue).toBe(0);
      expect(result.annualRecoveredRevenue).toBe(0);
    });

    it("handles negative ticket values gracefully", () => {
      const result = calculateRoi({
        enquiries: 100,
        avgTicket: -25000,
        currentConversion: 20,
      });

      expect(result.currentRevenue).toBe(0);
      expect(result.recoveredMonthlyRevenue).toBe(0);
    });

    it("handles negative conversion rate gracefully", () => {
      const result = calculateRoi({
        enquiries: 100,
        avgTicket: 25000,
        currentConversion: -15,
      });

      expect(result.baselineConversion).toBe(0);
      expect(result.projectedConversion).toBe(16);
      expect(result.recoveredMonthlyRevenue).toBeGreaterThan(0);
    });

    it("safely guards against NaN or Infinity without crashing", () => {
      const result = calculateRoi({
        enquiries: NaN,
        avgTicket: Infinity,
        currentConversion: NaN,
      });

      expect(Number.isFinite(result.currentRevenue)).toBe(true);
      expect(Number.isFinite(result.recoveredMonthlyRevenue)).toBe(true);
      expect(Number.isFinite(result.annualRecoveredRevenue)).toBe(true);
      expect(result.recoveredMonthlyRevenue).toBe(0);
    });
  });

  // 5. Rounding precision
  describe("Rounding precision", () => {
    it("rounds all revenues to whole integers without floating artifacts", () => {
      const result = calculateRoi({
        enquiries: 33,
        avgTicket: 17350,
        currentConversion: 17,
      });

      expect(Number.isInteger(result.currentRevenue)).toBe(true);
      expect(Number.isInteger(result.potentialRevenue)).toBe(true);
      expect(Number.isInteger(result.recoveredMonthlyRevenue)).toBe(true);
      expect(Number.isInteger(result.annualRecoveredRevenue)).toBe(true);
    });
  });
});
