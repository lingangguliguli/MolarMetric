"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RoiCalculator() {
  const [enquiries, setEnquiries] = useState(120);
  const [avgTicket, setAvgTicket] = useState(25000); // INR 25k (typical mix of RCT, crowns, implants)
  const [currentConversion, setCurrentConversion] = useState(20); // 20%

  // Calculations:
  // Target conversion with MolarMetric follow-up protocol is typically 35-42%
  const targetConversion = Math.min(50, currentConversion + 16);
  const currentRevenue = enquiries * (currentConversion / 100) * avgTicket;
  const potentialRevenue = enquiries * (targetConversion / 100) * avgTicket;
  const recoveredRevenue = Math.max(0, potentialRevenue - currentRevenue);
  const annualRecovered = recoveredRevenue * 12;

  return (
    <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10 transition-all">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Practice Assessment
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif tracking-tight text-stone-900 dark:text-stone-100">
          Calculate Your Clinic&apos;s Revenue Leakage
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
          Adjust the sliders to reflect your monthly enquiry volume and clinical case averages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders on Left */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Enquiries */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Monthly Patient Enquiries (Calls, WhatsApp, Walk-ins)
              </span>
              <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md text-sm">
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
              className="w-full accent-stone-900 dark:accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>30 (Boutique)</span>
              <span>250 (Multi-Chair)</span>
              <span>500+ (High Volume)</span>
            </div>
          </div>

          {/* Slider 2: Average Case Value */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Average Case / Treatment Value (INR)
              </span>
              <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md text-sm">
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
              className="w-full accent-stone-900 dark:accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>₹5k (Routine)</span>
              <span>₹45k (Implants & RCT)</span>
              <span>₹1 Lakh (Smile Makeovers / Aligners)</span>
            </div>
          </div>

          {/* Slider 3: Current Conversion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-stone-700 dark:text-stone-300">
                Current Estimated Enquiry-to-Treatment Rate
              </span>
              <span className="font-mono font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md text-sm">
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
              className="w-full accent-stone-900 dark:accent-amber-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>10% (Unstructured)</span>
              <span>20% (Typical Reception)</span>
              <span>45% (High Performer)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Card Output on Right */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 text-white p-6 sm:p-7 shadow-xl relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 block">
                  Recoverable Monthly Revenue
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-1">
                  +{formatCurrency(recoveredRevenue)}
                  <span className="text-xs font-normal text-stone-400 ml-1">/ mo</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Current Baseline Revenue:</span>
                  <span className="font-mono font-semibold">{formatCurrency(currentRevenue)}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>With MolarMetric ({targetConversion}% conversion):</span>
                  <span className="font-mono font-semibold text-emerald-400">{formatCurrency(potentialRevenue)}</span>
                </div>
                <div className="flex justify-between text-amber-300 font-bold pt-2 border-t border-stone-800">
                  <span>Annualized Recovery Gain:</span>
                  <span className="font-mono text-sm">+{formatCurrency(annualRecovered)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button className="w-full h-11 bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md">
                    Claim This Revenue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-stone-500 mt-2">
                  Zero setup fee • 14-day full operational trial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
