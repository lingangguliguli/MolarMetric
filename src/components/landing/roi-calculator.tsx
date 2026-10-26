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
    <div className="rounded-3xl border border-amber-500/20 bg-[#0B0F19] text-white shadow-[0_0_60px_-15px_rgba(245,158,11,0.12)] p-6 sm:p-10 transition-all">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Interactive Practice Assessment
        </div>
        <h3 className="text-2xl sm:text-4xl font-serif tracking-tight text-white">
          Calculate Your Clinic&apos;s Revenue Leakage
        </h3>
        <p className="text-sm text-stone-300 mt-2.5 max-w-xl mx-auto leading-relaxed">
          Adjust the sliders to simulate your monthly patient enquiry volume and case values to see how much uncollected revenue MolarMetric can recover.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders on Left */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Monthly Enquiries */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Monthly Patient Enquiries (Calls, WhatsApp, Walk-ins)
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
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>30 (Boutique)</span>
              <span>250 (Multi-Chair)</span>
              <span>500+ (High Volume)</span>
            </div>
          </div>

          {/* Slider 2: Average Case Value */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Average Case / Treatment Value (INR)
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
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>₹5k (Routine)</span>
              <span>₹45k (Implants & RCT)</span>
              <span>₹1 Lakh (Smile Makeovers / Aligners)</span>
            </div>
          </div>

          {/* Slider 3: Current Conversion Rate */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-stone-200">
                Current Estimated Enquiry-to-Treatment Rate
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
              className="w-full accent-amber-400 h-2 bg-stone-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>10% (Unstructured Reception)</span>
              <span>20% (Typical Reception)</span>
              <span>45% (High Performer)</span>
            </div>
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
                  Recoverable Monthly Revenue
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono mt-1">
                  +{formatCurrency(recoveredRevenue)}
                  <span className="text-xs font-normal text-stone-400 ml-1.5 font-sans">/ month</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-stone-300">
                  <span>Current Baseline Revenue:</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(currentRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span>With MolarMetric ({targetConversion}% conversion):</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(potentialRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-amber-300 font-bold pt-2.5 border-t border-stone-800 text-sm">
                  <span>Annualized Recovery Gain:</span>
                  <span className="font-mono text-base font-extrabold">+{formatCurrency(annualRecovered)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20">
                    Claim This Revenue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-center text-stone-400 mt-2.5 font-medium">
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
