import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg text-foreground tracking-tight">
                MolarMetric
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-1.5 text-sm text-foreground/80 mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              Purpose-built for dental clinics in India
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              Turn every patient enquiry into{" "}
              <span className="text-primary">booked revenue</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track enquiries from Google, Instagram, WhatsApp and walk-ins.
              Coordinate follow-ups. Record appointments and treatment outcomes.
              Understand what drives your clinic&apos;s growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Subtle decorative element */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-champagne/5 blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
              Everything you need to recover lost revenue
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              From the first enquiry to collected payment — a complete operational platform
              for your dental practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Enquiry Management",
                desc: "Capture leads from every source. Track pipeline stages. Never lose a prospective patient.",
              },
              {
                icon: Calendar,
                title: "Follow-up Coordination",
                desc: "Daily task queues, automated scheduling, and clear accountability for every follow-up.",
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Integration",
                desc: "Generate message drafts, use templates, and track communication outcomes.",
              },
              {
                icon: BarChart3,
                title: "Revenue Reporting",
                desc: "Conversion funnels, source performance, treatment acceptance rates, and actual collections.",
              },
              {
                icon: Shield,
                title: "Multi-Clinic Security",
                desc: "Complete data isolation between clinics. Role-based access for owners, admins, and receptionists.",
              },
              {
                icon: TrendingUp,
                title: "Treatment Tracking",
                desc: "Separate proposed, accepted, and collected values. Understand your actual revenue pipeline.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border/50 bg-card hover:border-champagne/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">M</span>
              </div>
              <span className="text-sm text-muted-foreground">
                MolarMetric — Dental Revenue Recovery OS
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for dental clinics in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
