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
import { BrandLogo } from "@/components/ui/brand-logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070A11] text-stone-100 selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Subtle Amber Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070A11]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <BrandLogo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-stone-300">
            <a href="#roi-calculator" className="hover:text-amber-400 transition-colors">
              Revenue Assessment
            </a>
            <a href="#system" className="hover:text-amber-400 transition-colors">
              Clinical Workflow
            </a>
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Capabilities
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Pilot Plans
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
            <Link href="/register?plan=multichair">
              <Button
                size="sm"
                className="text-xs font-semibold bg-white hover:bg-stone-100 text-stone-950 rounded-lg px-4 shadow-sm"
              >
                Join Pilot
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
              Recorded Clinical Outcomes
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Unstructured reception follow-ups and missed callbacks cause dental practices to lose prospective implant, aligner, and smile makeover patients. MolarMetric coordinates enquiry triage, manual WhatsApp draft outreach, and chairside case tracking with structured clarity.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?plan=multichair" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl shadow-lg shadow-amber-500/25"
              >
                Join Limited Supervised Pilot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#roi-calculator" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-6 text-sm text-stone-200 border-stone-800 hover:bg-stone-900 rounded-xl"
              >
                Simulate Practice Potential
              </Button>
            </a>
          </div>

          {/* Honest Value Strip — Non-numeric, substantiated architecture highlights */}
          <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-stone-400">
            <div>
              <span className="block text-lg font-bold text-white font-serif">Indian Clinic Focus</span>
              <span className="text-xs uppercase tracking-wider text-stone-400 mt-1 block">
                Tailored for Single & Multi-Chair
              </span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white font-serif">Structured Triage</span>
              <span className="text-xs uppercase tracking-wider text-stone-400 mt-1 block">
                Daily Front-Desk Queue
              </span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white font-serif">Manual wa.me Drafts</span>
              <span className="text-xs uppercase tracking-wider text-stone-400 mt-1 block">
                Staff Reviews Before Sending
              </span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white font-serif">Tenant Isolation</span>
              <span className="text-xs uppercase tracking-wider text-stone-400 mt-1 block">
                PostgreSQL Row Level Privacy
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
            Explore the interface designed for receptionists and clinical coordinators.
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
            Everything Required to Coordinate Practice Follow-ups
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
                Triage categorizes overdue follow-ups, scheduled callbacks, and consultation reminders so receptionists know who to call next.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Structured outcome logging & reschedule tracking
            </div>
          </div>

          {/* Bento 2: WhatsApp Merge Protocol */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">One-Click WhatsApp Drafts</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Generate pre-filled message drafts via official wa.me protocols. Staff review and manually send each message with zero third-party markups.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-emerald-400">
              ✓ Manual click-to-chat • Staff reviews before sending
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
                Record proposed clinical quotes, accepted treatment plans, and chairside cash collections with complete audit clarity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-indigo-300">
              ✓ Separate proposed quotes from realized collections
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
                Standardizes 10-digit Indian mobile numbers with or without 0 or +91 prefixes and flags duplicate enquiries within your clinic.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Strict E.164 +91 phone formatting & clinic-scoped duplicate check
            </div>
          </div>

          {/* Bento 5: Isolated Multi-Tenant RLS */}
          <div className="p-8 rounded-3xl border border-stone-800 bg-stone-900/40 backdrop-blur-md flex flex-col justify-between hover:border-stone-700 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">PostgreSQL Row Level Privacy</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Clinic enquiry records and financial entries are isolated per practice using database-enforced Row Level Security (RLS) policies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-rose-300">
              ✓ Strict clinic boundaries & CSV formula injection protection
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
                90+ tailored daily inspirations specifically written for dental receptionists, helping front desk staff maintain empathetic, proactive patient communication.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-300">
              ✓ Daily rotation without repeat fatigue
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Supervised Pilot Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold block mb-2">
            Supervised Pilot Program
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            Free During Supervised Pilot
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            MolarMetric is currently operating a supervised pilot for 1–3 selected dental clinics in India. Standard commercial subscription plans will be introduced upon pilot conclusion.
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
                <span className="text-3xl font-extrabold text-white font-mono">Free</span>
                <span className="text-xs text-stone-400 ml-1.5">(Supervised Pilot)</span>
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
                  WhatsApp Manual Draft Generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  2 Staff Accounts (Owner + Receptionist)
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register?plan=boutique">
                <Button variant="outline" className="w-full text-xs font-bold border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800">
                  Join Pilot (Boutique)
                </Button>
              </Link>
            </div>
          </div>

          {/* Tier 2: Multi-Chair Premier (Featured) */}
          <div className="p-8 rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              Pilot Recommended
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400 block mb-1">
                High-Volume Clinical
              </span>
              <h3 className="text-xl font-serif text-white">Multi-Chair Practice</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white font-mono">Free</span>
                <span className="text-xs text-stone-400 ml-1.5">(Supervised Pilot)</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Full Patient Enquiry Lifecycle Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Clinical Treatment Acceptance Matrix
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Attribution & Conversion Reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Up to 6 Staff & Receptionist Accounts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Direct Founder Onboarding & Support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/register?plan=multichair">
                <Button className="w-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md">
                  Join Pilot (Multi-Chair)
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
                <span className="text-3xl font-extrabold text-white font-mono">Custom</span>
                <span className="text-xs text-stone-400 ml-1.5">(By Consultation)</span>
              </div>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Multiple Clinic Branches & Central Reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Role-based permissions & audit history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Custom Treatment Procedure Catalog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Supervised Data Import Support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/contact?interest=group">
                <Button variant="outline" className="w-full text-xs font-bold border-stone-700 text-stone-200 hover:text-white hover:bg-stone-800">
                  Contact Dental Group Desk
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Supervised Pilot Notice */}
        <div className="mt-12 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>
            Pilot terms: Workspace access is complimentary for verified pilot clinics. Customer data is strictly isolated under PostgreSQL RLS and exportable at any time.
          </span>
        </div>
      </section>

      {/* Footer with Legal & Trust Links */}
      <footer className="border-t border-stone-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" showText={false} />
            <span className="text-sm font-semibold text-white">MolarMetric OS</span>
            <span className="text-xs text-stone-400">— Dental Revenue Recovery Platform</span>
          </div>

          {/* Legal and Information Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-stone-400">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
              Refund Policy
            </Link>
            <Link href="/dpa" className="hover:text-amber-400 transition-colors">
              Data Processing Agreement
            </Link>
            <Link href="/security" className="hover:text-amber-400 transition-colors">
              Security
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} MolarMetric. Built for Indian dental clinics.
          </p>
        </div>
      </footer>
    </div>
  );
}
