"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  calculateRoi,
  DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS,
  MAX_CONVERSION_RATE_CAP,
} from "@/lib/roi-calculator";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RoiCalculator() {
  const [enquiries, setEnquiries] = useState(120);
  const [avgTicket, setAvgTicket] = useState(25000); // INR 25k (routine mix of restorative, RCT, crowns, implants)
  const [currentConversion, setCurrentConversion] = useState(20); // 20%
  const [upliftPoints] = useState(DEFAULT_ILLUSTRATIVE_UPLIFT_PERCENT_POINTS);

  const result = calculateRoi({
    enquiries,
    avgTicket,
    currentConversion,
    upliftPoints,
  });

  return (
    <div className="rounded-3xl border border-amber-500/20 bg-[#0B0F19] text-white shadow-[0_0_60px_-15px_rgba(245,158,11,0.12)] p-6 sm:p-10 transition-all">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Interactive Practice Assessment
        </div>
        <h3 className="text-2xl sm:text-4xl font-serif tracking-tight text-white">
          Simulate Your Practice Revenue Potential
        </h3>
        <p className="text-sm text-stone-300 mt-2.5 max-w-xl mx-auto leading-relaxed">
          Adjust the parameters below to model prospective enquiry volume and treatment values under transparent assumptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders on Left */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Enquiries */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Monthly Patient Enquiries (Calls, Walk-ins, Online)
              </span>
              <span className="font-mono font-bold text-amber-300 bg-stone-800/90 border border-stone-700/80 px-3 py-1 rounded-lg text-sm shadow-inner">
                {enquiries} enquiries
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="500"
              step="10"
              value={enquiries}
              onChange={(e) => setEnquiries(Number(e.target.value))}
              aria-label="Monthly Patient Enquiries"
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>30 (Boutique)</span>
              <span>120 (Standard)</span>
              <span>500 (High Volume)</span>
            </div>
          </div>

          {/* Slider 2: Average Case Value */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Average Treatment Value (INR)
              </span>
              <span className="font-mono font-bold text-amber-300 bg-stone-800/90 border border-stone-700/80 px-3 py-1 rounded-lg text-sm shadow-inner">
                {formatCurrency(avgTicket)}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              aria-label="Average Treatment Value in INR"
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>₹5k (Routine)</span>
              <span>₹25k (RCT & Crowns)</span>
              <span>₹1 Lakh (Implants & Aligners)</span>
            </div>
          </div>

          {/* Slider 3: Current Conversion Rate */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Assumed Baseline Conversion Rate
              </span>
              <span className="font-mono font-bold text-amber-300 bg-stone-800/90 border border-stone-700/80 px-3 py-1 rounded-lg text-sm shadow-inner">
                {currentConversion}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="5"
              value={currentConversion}
              onChange={(e) => setCurrentConversion(Number(e.target.value))}
              aria-label="Baseline Conversion Rate"
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>10% (Low follow-up)</span>
              <span>20% (Typical)</span>
              <span>45% (High performer)</span>
            </div>
          </div>

          {/* Model Transparency Note */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-stone-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-300 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Assessment Model Assumptions</span>
            </div>
            <p>
              • Baseline conversion rate: <strong>{result.baselineConversion}%</strong>
              <br />
              • Illustrative model uplift assumption: <strong>+{result.effectiveUplift}%</strong> (capped at {MAX_CONVERSION_RATE_CAP}% maximum simulated rate)
              <br />
              • Results are hypothetical models, not guaranteed revenue or performance assurances.
            </p>
          </div>
        </div>

        {/* Dynamic Card Output on Right */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-stone-900 via-stone-950 to-[#070A11] text-white p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                  Illustrative Monthly Recovery Potential
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono mt-1">
                  +{formatCurrency(result.recoveredMonthlyRevenue)}
                  <span className="text-xs font-normal text-stone-400 ml-1.5 font-sans">/ month</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-stone-300">
                  <span>Simulated Baseline ({result.baselineConversion}%):</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(result.currentRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span>Projected ({result.projectedConversion}% conversion):</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(result.potentialRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-amber-300 font-bold pt-2.5 border-t border-stone-800 text-sm">
                  <span>Annualized Recovery Model:</span>
                  <span className="font-mono text-base font-extrabold">+{formatCurrency(result.annualRecoveredRevenue)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register?plan=multichair">
                  <Button className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20">
                    Join Limited Supervised Pilot
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-stone-400 mt-2.5 font-medium">
                  Free during supervised pilot • 1–3 clinics only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
