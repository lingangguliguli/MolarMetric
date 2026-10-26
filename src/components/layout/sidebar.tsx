"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Calendar,
  Activity,
  MessageSquare,
  UserCheck,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/follow-ups", label: "Follow-up Queue", icon: ListTodo },
  { href: "/leads", label: "Enquiries (Leads)", icon: Users },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/treatments", label: "Treatment Revenue", icon: Activity },
  { href: "/templates", label: "WhatsApp Templates", icon: MessageSquare },
  { href: "/team", label: "Staff & Team", icon: UserCheck },
  { href: "/reports", label: "Reports & Funnels", icon: BarChart3 },
  { href: "/settings", label: "Clinic Settings", icon: Settings },
];

import type { Clinic } from "@/lib/types";
import { getSubscriptionInfo } from "@/lib/subscription";

interface SidebarProps {
  clinic?: Clinic;
  className?: string;
}

export function Sidebar({ clinic, className }: SidebarProps) {
  const pathname = usePathname();
  const sub = clinic ? getSubscriptionInfo(clinic) : null;

  return (
    <aside
      className={cn(
        "w-64 border-r border-stone-800/80 bg-[#080C14] text-stone-300 flex flex-col justify-between h-screen sticky top-0 z-30 select-none",
        className
      )}
    >
      <div>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
          <BrandLogo size="sm" href="/dashboard" />
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-white/[0.08] text-white font-semibold shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-amber-400" />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-105",
                    isActive ? "text-amber-400" : "text-stone-400 group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Subscription / 14-Day Trial Card */}
      <div className="p-3 border-t border-white/[0.06]">
        {sub?.isTrial ? (
          <div className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                14-Day Pro Trial
              </span>
              <span className="text-[11px] font-bold text-amber-300">
                {sub.remainingDays > 0 ? `${sub.remainingDays}d left` : "Expired"}
              </span>
            </div>

            {/* Trial Progress Bar */}
            <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${sub.trialPercentRemaining}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
              <span>Expires {sub.formattedExpiresAt}</span>
              <Link
                href="/settings"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                Upgrade
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-semibold text-white block">MolarMetric Enterprise</span>
              <span className="text-stone-400 text-[10px]">India Practice Edition</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
