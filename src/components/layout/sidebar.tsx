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

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r border-border/60 bg-card/60 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 z-30",
        className
      )}
    >
      <div>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/50 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-black text-sm">M</span>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-foreground block leading-tight">
              MolarMetric
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">
              Dental Recovery OS
            </span>
          </div>
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-105",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Pill */}
      <div className="p-4 border-t border-border/50">
        <div className="rounded-xl border border-champagne/40 bg-champagne/10 p-3 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold text-foreground block">MolarMetric OS</span>
            <span className="text-muted-foreground">Lead-to-Revenue Platform</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
