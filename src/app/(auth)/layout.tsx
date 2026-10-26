import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#070A11]">
      {/* Left panel — luxury clinical branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#080C14] relative overflow-hidden text-white flex-col justify-between p-12 border-r border-stone-800/80">
        {/* Subtle amber ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <BrandLogo size="md" />
        </div>

        <div className="relative z-10 max-w-md space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-amber-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Practice Performance Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight font-normal">
            Where Patient Enquiries Become Confirmed Chairside Revenue
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Eliminate reception leakage, coordinate surgical callbacks, and realize full collections on high-value implants, aligners, and cosmetic dentistry.
          </p>

          <div className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-stone-300">
              Multi-tenant isolated PostgreSQL security with role-based clinical permissions.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-stone-500 border-t border-white/[0.06] pt-6">
          <span>MolarMetric Enterprise • India</span>
          <span>Cashfree & UPI Verified</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
