import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { ProductPreview } from "@/components/landing/product-preview";
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Activity,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Lock,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070A11] text-stone-100 selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Subtle Amber Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070A11]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-stone-950 font-black text-sm tracking-tighter">M</span>
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
                MolarMetric
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-400/90 uppercase block mt-0.5">
                Dental Revenue OS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-stone-300">
            <a href="#roi-calculator" className="hover:text-amber-400 transition-colors">
              Revenue Assessment
            </a>
            <a href="#system" className="hover:text-amber-400 transition-colors">
              Clinical Workflow
            </a>
            <a href="#features" className="hover:text-amber-400 transition-colors">
              OS Capabilities
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Plans & Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-stone-300 hover:text-white hover:bg-white/[0.06]"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="text-xs font-semibold bg-white hover:bg-stone-100 text-stone-950 rounded-lg px-4 shadow-sm"
              >
                Start Trial
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-300 mb-8 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Engineered Exclusively for Indian Dental Clinics
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-white leading-[1.08] font-normal">
            Turn Leaked Patient Enquiries into{" "}
            <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              Recovered Clinical Revenue
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Indian dental practices lose 35–45% of potential implant, aligner, and smile makeover revenue to chaotic reception follow-ups. MolarMetric coordinates triage, WhatsApp reminders, and case acceptance with surgical precision.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl shadow-lg shadow-amber-500/25"
              >
                Launch 14-Day Free Practice Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#roi-calculator" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 text-sm text-stone-200 border-stone-800 hover:bg-stone-900 rounded-xl"
              >
                Calculate Revenue Leakage
              </Button>
            </a>
          </div>

          {/* Social Proof strip */}
          <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-stone-400">
            <div>
              <span className="block text-2xl font-bold font-mono text-white">₹6.4 Cr+</span>
              <span className="text-xs uppercase tracking-wider text-stone-500 mt-0.5 block">
                Recovered Treatment Value
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-mono text-white">&lt; 8 mins</span>
              <span className="text-xs uppercase tracking-wider text-stone-500 mt-0.5 block">
                Avg Reception Response Time
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-mono text-white">93.8%</span>
              <span className="text-xs uppercase tracking-wider text-stone-500 mt-0.5 block">
                Consultation Show-up Rate
              </span>
            </div>
            <div>
              <span className="block text-2xl font-bold font-mono text-white">180+</span>
              <span className="text-xs uppercase tracking-wider text-stone-500 mt-0.5 block">
                Premier Indian Clinics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Operational System Preview */}
      <section id="system" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold block mb-2">
            The MolarMetric Operating System
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            Designed for Front-Desk Speed & Clinical Clarity
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Explore the live interface your receptionists and clinical coordinators use daily.
          </p>
        </div>

        <ProductPreview />
      </section>

      {/* Interactive ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RoiCalculator />
      </section>

      {/* Bento Grid Architecture */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold block mb-2">
            Architectural Precision
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            Everything Required to Modernize Your Practice
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Eliminate phone confusion, missed callbacks, and uncollected treatment quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Smart Daily Queue */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Reception Daily Action Queue</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Smart triage categorizes overdue follow-ups, today&apos;s callbacks, and upcoming reminders so receptionists never wonder who to call next.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Automated outcome notes & reschedule triggers
            </div>
          </div>

          {/* Bento 2: WhatsApp Merge Protocol */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Instant WhatsApp Merge Protocol</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Send personalized appointment confirmations, route directions, and quote follow-ups via official wa.me protocols without paying Meta BSP messaging charges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-emerald-400">
              ✓ Zero Meta BSP markups • Instant one-click drafts
            </div>
          </div>

          {/* Bento 3: Financial Case Acceptance */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Treatment Acceptance Matrix</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Separate proposed clinical quotes from accepted cases and actual cash collected chairside. Identify exactly why high-ticket implants or aligner cases get declined.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-indigo-300">
              ✓ Procedure breakdown & collection milestone tracking
            </div>
          </div>

          {/* Bento 4: Phone Normalization & Duplication Shield */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Indian Number Normalization</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Standardizes 10-digit mobile numbers with or without 0 or +91 prefixes and flags duplicate enquiries automatically across all clinic staff.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Strict E.164 +91 phone formatting
            </div>
          </div>

          {/* Bento 5: Isolated Multi-Tenant RLS */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Postgres Row Level Privacy</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Patient records and financial collections are isolated per clinic at the database engine level via Postgres RLS policies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-rose-300">
              ✓ Tamper-evident audit trail & CSV sanitize
            </div>
          </div>

          {/* Bento 6: Staff Motivation Protocol */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Front Desk Motivation Engine</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                90+ tailored daily inspirations specifically written for dental receptionists, keeping your front desk energetic, empathetic, and focused.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Daily rotation without repeat fatigue
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold block mb-2">
            Transparent Practice Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            Invest in Pure Revenue Recovery
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Single recovering implant case pays for an entire year of MolarMetric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Boutique */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/30 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-stone-400 block mb-1">
                Boutique Practice
              </span>
              <h3 className="text-xl font-serif text-white">Single Chair Clinic</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">₹2,499</span>
                <span className="text-xs text-stone-400 ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Up to 150 patient enquiries / mo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Daily Reception Queue & Outcome Notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  WhatsApp Merge Template Generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  2 Staff Accounts (Owner + Receptionist)
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register">
                <Button variant="outline" className="w-full text-xs font-bold border-stone-700 hover:bg-stone-800">
                  Select Boutique
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 2: Multi-Chair Premier (Featured) */}
          <div className="p-8 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              Most Popular in India
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block mb-1">
                High-Volume Clinical
              </span>
              <h3 className="text-xl font-serif text-white">Multi-Chair Practice</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">₹4,999</span>
                <span className="text-xs text-stone-400 ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Unlimited patient enquiries & leads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Clinical Treatment Acceptance Matrix
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Full Funnel Conversion & Attribution Reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Up to 6 Staff & Receptionist Accounts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Priority India Support via WhatsApp
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register">
                <Button className="w-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md">
                  Start Multi-Chair Trial
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 3: Dental Group */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/30 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-stone-400 block mb-1">
                Dental Group & Hospital
              </span>
              <h3 className="text-xl font-serif text-white">Multi-Branch Group</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">₹9,999</span>
                <span className="text-xs text-stone-400 ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Multiple Clinic Branches & Central Reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Unlimited Staff & Dedicated Account Lead
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Custom Treatment Procedure Catalog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Direct Cashfree Gateway Integration
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register">
                <Button variant="outline" className="w-full text-xs font-bold border-stone-700 hover:bg-stone-800">
                  Contact Dental Group
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cashfree Badge Strip */}
        <div className="mt-12 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>
            Secure Indian Payments Powered by <strong>Cashfree Payments</strong> — Supports UPI, RuPay, NetBanking & Corporate Cards.
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-stone-950 font-bold text-xs">M</span>
            </div>
            <span className="text-sm font-semibold text-white">MolarMetric OS</span>
            <span className="text-xs text-stone-500">— Dental Revenue Recovery Platform</span>
          </div>

          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} MolarMetric. Engineered for India&apos;s leading dental practices.
          </p>
        </div>
      </footer>
    </div>
  );
}
