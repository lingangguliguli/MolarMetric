import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#070A11] text-stone-200 selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Subtle Amber Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070A11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <BrandLogo size="md" />
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-stone-400 hover:text-white hover:bg-white/[0.06] gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Lawyer Review Notice Banner */}
        <div className="mb-10 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-amber-300">
              Notice: Draft Document — Pending Legal Review
            </span>
            <p className="mt-0.5 text-stone-300">
              Draft - get lawyer review before launch. This document is a preliminary operational draft prepared for Indian dental clinic pilots under applicable laws (including Digital Personal Data Protection Act, 2023 and Information Technology Act, 2000). Placeholders marked with [[PLACEHOLDER]] must be confirmed by qualified legal counsel.
            </p>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="border-b border-white/[0.08] pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
            {title}
          </h1>
          <p className="text-stone-400 text-sm mt-2">{subtitle}</p>
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-stone-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version: 1.0 (Pilot Draft)</span>
          </div>
        </div>

        {/* Document Body */}
        <div className="prose prose-invert max-w-none text-stone-300 space-y-8 text-sm leading-relaxed">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} MolarMetric. Engineered for Indian dental clinics.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-amber-400">Privacy</Link>
          <Link href="/terms" className="hover:text-amber-400">Terms</Link>
          <Link href="/dpa" className="hover:text-amber-400">DPA</Link>
          <Link href="/contact" className="hover:text-amber-400">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
