"use client";

import { useState } from "react";
import {
  ListTodo,
  TrendingUp,
  MessageSquare,
  Activity,
  CheckCircle2,
  Clock,
  Phone,
  IndianRupee,
  Shield,
  Sparkles,
} from "lucide-react";

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"queue" | "funnel" | "whatsapp" | "cases">("queue");

  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950 text-white shadow-2xl overflow-hidden">
      {/* Top Window Bar */}
      <div className="px-6 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4 bg-stone-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-stone-400 ml-2">
            MolarMetric OS v1.0 — Apex Dental Care & Implant Center
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "queue"
                ? "bg-stone-800 text-white shadow-xs font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Reception Queue
          </button>
          <button
            onClick={() => setActiveTab("funnel")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "funnel"
                ? "bg-stone-800 text-white shadow-xs font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Conversion Funnel
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "whatsapp"
                ? "bg-stone-800 text-white shadow-xs font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            WhatsApp Protocol
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "cases"
                ? "bg-stone-800 text-white shadow-xs font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Treatment Acceptance
          </button>
        </div>
      </div>

      {/* Main Preview Body */}
      <div className="p-6 sm:p-8 min-h-[420px] bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900/50">
        {activeTab === "queue" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Daily Reception Action Queue</h4>
                <p className="text-xs text-stone-400">Smart triage prioritizing enquiries with highest clinical intent.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2 Past Due
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Pooja Verma",
                  phone: "+91 98201 44521",
                  tag: "Full Mouth Implants",
                  value: "₹2,40,000",
                  status: "OVERDUE (2h)",
                  urgent: true,
                  note: "Called from Google Ad. Interested in Nobel Biocare implants. Needs Saturday consultation slot.",
                },
                {
                  name: "Vikram Malhotra",
                  phone: "+91 97110 33819",
                  tag: "Clear Aligners",
                  value: "₹1,25,000",
                  status: "Due at 3:30 PM",
                  urgent: false,
                  note: "WhatsApp enquiry regarding 3D digital scan. Follow up on appointment time.",
                },
                {
                  name: "Ananya Deshmukh",
                  phone: "+91 98450 78210",
                  tag: "Root Canal + Zirconia Crown",
                  value: "₹18,500",
                  status: "Due at 5:00 PM",
                  urgent: false,
                  note: "Reported tooth sensitivity on lower molar. Confirm walk-in availability.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`p-4 rounded-xl border transition-all ${
                    item.urgent
                      ? "border-rose-500/30 bg-rose-950/20"
                      : "border-stone-800/80 bg-stone-900/40 hover:border-stone-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.name}</span>
                        <span className="text-[11px] font-mono text-stone-400">{item.phone}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{item.note}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-xs font-bold text-emerald-400 font-mono block">{item.value}</span>
                        <span className="text-[10px] text-stone-500 font-medium">{item.status}</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700">
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "funnel" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Clinical Conversion Velocity</h4>
                <p className="text-xs text-stone-400">Tracking drop-offs across the 6 surgical stages of revenue recovery.</p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Overall Recovery Rate: 38.4%
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { stage: "1. Incoming Patient Inquiries", count: 184, rate: 100, bar: 100, color: "bg-stone-500" },
                { stage: "2. First Contact Achieved (< 15 mins)", count: 162, rate: 88, bar: 88, color: "bg-blue-500" },
                { stage: "3. Clinical Consultation Booked", count: 114, rate: 62, bar: 62, color: "bg-indigo-500" },
                { stage: "4. Attended Chairside Examination", count: 98, rate: 53, bar: 53, color: "bg-amber-500" },
                { stage: "5. Comprehensive Treatment Proposed", count: 86, rate: 47, bar: 47, color: "bg-purple-500" },
                { stage: "6. Treatment Won & Collections Realized", count: 71, rate: 38, bar: 38, color: "bg-emerald-500" },
              ].map((step) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-300 font-medium">{step.stage}</span>
                    <span className="font-mono text-stone-400">
                      {step.count} patients ({step.rate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800/80">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all duration-700`}
                      style={{ width: `${step.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "whatsapp" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Zero-API WhatsApp Merge Protocol</h4>
                <p className="text-xs text-stone-400">Generate high-conversion personalized drafts directly into your official WhatsApp Desktop/Web.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Instant wa.me Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/50 space-y-3">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  Template: Appointment Confirmation & Clinic Route
                </span>
                <div className="p-3.5 rounded-xl border border-stone-700/60 bg-stone-950 font-sans text-xs leading-relaxed text-stone-200">
                  Hello <span className="text-amber-400 font-semibold">Dr. Ananya</span>, your dental consultation at <span className="text-amber-400 font-semibold">Apex Dental & Implant Center</span> is confirmed for <span className="text-amber-400 font-semibold">Saturday, Oct 31 at 11:30 AM</span>.<br /><br />
                  Dr. Arjun has reserved 45 minutes for your 3D CBCT scan & smile assessment.<br /><br />
                  Location: <span className="text-stone-400 underline">maps.google.com/?q=ApexDental</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500 font-mono">
                  <span>Dynamic Merge Tags: 4</span>
                  <span>Compliance: Verified</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/50 space-y-3">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  Template: Treatment Quote Follow-up
                </span>
                <div className="p-3.5 rounded-xl border border-stone-700/60 bg-stone-950 font-sans text-xs leading-relaxed text-stone-200">
                  Hello <span className="text-amber-400 font-semibold">Rahul Sharma</span>, following your consultation on Thursday, our clinical coordinator prepared your treatment breakdown for <span className="text-amber-400 font-semibold">Clear Aligners</span>.<br /><br />
                  We also have 0% EMI options through our healthcare financing desk. Would you like us to share the plan PDF?
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500 font-mono">
                  <span>Dynamic Merge Tags: 3</span>
                  <span>Compliance: Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cases" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Clinical Case Acceptance Matrix</h4>
                <p className="text-xs text-stone-400">Distinguishing proposed quotes from actual cash collections in bank.</p>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                ₹18.4L Collected this Month
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40">
                <span className="text-[11px] text-stone-400 uppercase font-medium">Proposed Quotes</span>
                <span className="text-xl font-bold text-white block mt-1 font-mono">₹34,50,000</span>
                <span className="text-[11px] text-stone-500">across 32 treatment plans</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <span className="text-[11px] text-amber-300 uppercase font-medium">Accepted Value</span>
                <span className="text-xl font-bold text-amber-400 block mt-1 font-mono">₹24,80,000</span>
                <span className="text-[11px] text-amber-300/70">71.8% case acceptance</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[11px] text-emerald-300 uppercase font-medium">Realized Collections</span>
                <span className="text-xl font-bold text-emerald-400 block mt-1 font-mono">₹18,40,000</span>
                <span className="text-[11px] text-emerald-300/70">74.2% collected in chair</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
