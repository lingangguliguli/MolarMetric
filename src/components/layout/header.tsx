"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  LogOut,
  Settings,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import type { Clinic, Profile, UserRole } from "@/lib/types";

interface HeaderProps {
  clinic: Clinic;
  profile: Profile;
  role: UserRole;
}

export function Header({ clinic, profile, role }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    owner: { label: "Owner", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
    admin: { label: "Admin", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
    receptionist: { label: "Reception", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  };

  const initials = profile.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Current Clinic Workspace Badge */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground block leading-none">
              {clinic.name}
            </span>
            <span className="text-[11px] text-muted-foreground leading-none mt-0.5 block">
              {clinic.city ? `${clinic.city}, India` : "India Practice"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick New Lead Button */}
        <NewLeadDialog />

        {/* User Profile & Role Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {profile.display_name}
                </p>
                <div className="pt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className={`text-[10px] font-semibold uppercase ${roleLabels[role].color}`}>
                    {roleLabels[role].label}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/team" className="cursor-pointer flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span>Team & Staff</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Clinic Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logoutAction();
              }}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
