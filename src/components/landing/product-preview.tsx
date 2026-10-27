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
  Info,
} from "lucide-react";

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"queue" | "funnel" | "whatsapp" | "cases">("queue");
  const [demoActionNotice, setDemoActionNotice] = useState<string | null>(null);

  const demoQueue = [
    {
      id: "demo-1",
      name: "Sample Patient A (Illustrative)",
      phone: "+91 99999 00001",
      tag: "Full Arch Implants",
      value: "₹2,40,000",
      status: "OVERDUE (2h)",
      urgent: true,
      note: "Sample enquiry. Interested in implant consultation. Preferred slot: Saturday morning.",
    },
    {
      id: "demo-2",
      name: "Sample Patient B (Illustrative)",
      phone: "+91 99999 00002",
      tag: "Clear Aligners",
      value: "₹1,25,000",
      status: "Due at 3:30 PM",
      urgent: false,
      note: "Sample enquiry regarding 3D digital scan and case timeline.",
    },
    {
      id: "demo-3",
      name: "Sample Patient C (Illustrative)",
      phone: "+91 99999 00003",
      tag: "Root Canal + Zirconia Crown",
      value: "₹18,500",
      status: "Due at 5:00 PM",
      urgent: false,
      note: "Sample enquiry for tooth sensitivity on molar. Confirm appointment schedule.",
    },
  ];

  const overdueCount = demoQueue.filter((item) => item.urgent).length;

  function triggerDemoAction(message: string) {
    setDemoActionNotice(message);
    setTimeout(() => {
      setDemoActionNotice((prev) => (prev === message ? null : prev));
    }, 3500);
  }

  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950 text-white shadow-2xl overflow-hidden">
      {/* Top Window Bar */}
      <div className="px-6 py-4 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4 bg-stone-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-stone-400 ml-2">
            MolarMetric OS — Supervised Pilot Preview
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Sample Data
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
            Conversion Stages
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "whatsapp"
                ? "bg-stone-800 text-white shadow-xs font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            WhatsApp Drafts
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

      {/* Demo Action Toast Notice */}
      {demoActionNotice && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>{demoActionNotice}</span>
        </div>
      )}

      {/* Main Preview Body */}
      <div className="p-6 sm:p-8 min-h-[420px] bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900/50">
        {activeTab === "queue" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Daily Reception Action Queue</h4>
                <p className="text-xs text-stone-400">
                  Sample interface demonstrating structured front-desk triage. All records are synthetic.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {overdueCount} Past Due
              </span>
            </div>

            <div className="space-y-3">
              {demoQueue.map((item) => (
                <div
                  key={item.id}
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
                      <button
                        onClick={() =>
                          triggerDemoAction(
                            `[Demo Preview] Pre-populating WhatsApp web draft for ${item.name}. Staff reviews and sends manually.`
                          )
                        }
                        aria-label={`Open WhatsApp click-to-chat draft for ${item.name}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp Draft
                      </button>
                      <button
                        onClick={() =>
                          triggerDemoAction(
                            `[Demo Preview] Simulated marking follow-up complete for ${item.name}. Real clinic records are unaffected.`
                          )
                        }
                        aria-label={`Mark follow-up complete for ${item.name}`}
                        className="px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700"
                      >
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
                <h4 className="font-semibold text-sm text-stone-200">Clinical Conversion Stages</h4>
                <p className="text-xs text-stone-400">
                  Tracking enquiry progression across 6 distinct clinical coordination stages (illustrative sample).
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Sample Funnel Model
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { stage: "1. Incoming Patient Inquiries", count: 184, rate: 100, bar: 100, color: "bg-stone-500" },
                { stage: "2. First Contact Attempted", count: 162, rate: 88, bar: 88, color: "bg-blue-500" },
                { stage: "3. Clinical Consultation Scheduled", count: 114, rate: 62, bar: 62, color: "bg-indigo-500" },
                { stage: "4. Chairside Examination Attended", count: 98, rate: 53, bar: 53, color: "bg-amber-500" },
                { stage: "5. Comprehensive Treatment Proposed", count: 86, rate: 47, bar: 47, color: "bg-purple-500" },
                { stage: "6. Treatment Accepted & Documented", count: 71, rate: 38, bar: 38, color: "bg-emerald-500" },
              ].map((step) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-300 font-medium">{step.stage}</span>
                    <span className="font-mono text-stone-400">
                      {step.count} sample records ({step.rate}%)
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
                <h4 className="font-semibold text-sm text-stone-200">One-Click WhatsApp Draft Generator</h4>
                <p className="text-xs text-stone-400">
                  Pre-fills personalized templates into official wa.me chat links. Staff review and manually send every message.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Manual Click-to-Chat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/50 space-y-3">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  Template Draft: Appointment Confirmation
                </span>
                <div className="p-3.5 rounded-xl border border-stone-700/60 bg-stone-950 font-sans text-xs leading-relaxed text-stone-200">
                  Hello <span className="text-amber-400 font-semibold">[Patient Name]</span>, your dental consultation at <span className="text-amber-400 font-semibold">[Clinic Name]</span> is confirmed for <span className="text-amber-400 font-semibold">[Date & Time]</span>.<br /><br />
                  Location: <span className="text-stone-400 underline">[Clinic Map Link]</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-400 font-mono">
                  <span>Dynamic Merge Tags: 3</span>
                  <span className="text-amber-300">Staff reviews before sending</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/50 space-y-3">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  Template Draft: Treatment Plan Follow-up
                </span>
                <div className="p-3.5 rounded-xl border border-stone-700/60 bg-stone-950 font-sans text-xs leading-relaxed text-stone-200">
                  Hello <span className="text-amber-400 font-semibold">[Patient Name]</span>, following your dental examination, our team prepared your treatment plan breakdown for <span className="text-amber-400 font-semibold">[Procedure Name]</span>.<br /><br />
                  Would you like us to share the plan details or answer any questions?
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-400 font-mono">
                  <span>Dynamic Merge Tags: 2</span>
                  <span className="text-amber-300">Staff reviews before sending</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cases" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="font-semibold text-sm text-stone-200">Treatment Financial Matrix</h4>
                <p className="text-xs text-stone-400">
                  Illustrative breakdown separating proposed clinical quotes from accepted cases and recorded collections.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-stone-400">
                Sample Financial Model
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40">
                <span className="text-[11px] text-stone-400 uppercase font-medium">Sample Proposed Quotes</span>
                <span className="text-xl font-bold text-white block mt-1 font-mono">₹3,45,000</span>
                <span className="text-[11px] text-stone-500">across sample treatment plans</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <span className="text-[11px] text-amber-300 uppercase font-medium">Sample Accepted Value</span>
                <span className="text-xl font-bold text-amber-400 block mt-1 font-mono">₹2,48,000</span>
                <span className="text-[11px] text-amber-300/70">Sample simulated acceptance</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[11px] text-emerald-300 uppercase font-medium">Sample Recorded Collections</span>
                <span className="text-xl font-bold text-emerald-400 block mt-1 font-mono">₹1,84,000</span>
                <span className="text-[11px] text-emerald-300/70">Sample chairside collections</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
