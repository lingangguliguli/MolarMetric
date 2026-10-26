"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteTeamMember, updateMemberRole, removeTeamMember } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, UserPlus, Mail, Shield, Trash2, Loader2 } from "lucide-react";
import type { ClinicMembership, Invitation, UserRole } from "@/lib/types";

interface TeamViewProps {
  initialMembers: ClinicMembership[];
  initialInvitations: Invitation[];
  currentUserRole: UserRole;
}

const ROLE_BADGES: Record<UserRole, { label: string; color: string }> = {
  owner: { label: "Owner", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  admin: { label: "Admin", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  receptionist: { label: "Receptionist", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
};

export function TeamView({
  initialMembers,
  initialInvitations,
  currentUserRole,
}: TeamViewProps) {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "receptionist">("receptionist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await inviteTeamMember({ email, role });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setInviteOpen(false);
      setEmail("");
      router.refresh();
    }
  }

  async function handleRoleChange(membershipId: string, newRole: UserRole) {
    await updateMemberRole(membershipId, newRole);
    router.refresh();
  }

  async function handleRemove(membershipId: string) {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    await removeTeamMember(membershipId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={() => setInviteOpen(true)} size="sm" className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Invite Staff Member
          </Button>
        </div>
      )}

      {/* Active Team Members Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Active Clinic Staff</CardTitle>
          <CardDescription>
            Team members with access to this clinic workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/40">
            {initialMembers.map((member) => {
              const profile = member.profile;
              const roleInfo = ROLE_BADGES[member.role] || ROLE_BADGES.receptionist;
              const initials = profile?.display_name
                ? profile.display_name.slice(0, 2).toUpperCase()
                : "U";

              return (
                <div
                  key={member.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-bold text-sm text-foreground block">
                        {profile?.display_name || "Staff Member"}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        Joined {new Date(member.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    {currentUserRole === "owner" && member.role !== "owner" ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleRoleChange(member.id, v as UserRole)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={`text-[10px] font-semibold ${roleInfo.color}`}>
                        {roleInfo.label}
                      </Badge>
                    )}

                    {canManage && member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(member.id)}
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations Card */}
      {initialInvitations.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pending Invitations</CardTitle>
            <CardDescription>
              Invited colleagues who have not yet accepted their invitation link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/40">
              {initialInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{inv.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {inv.role}
                    </Badge>
                    <span className="text-muted-foreground text-[11px]">
                      Expires {new Date(inv.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <UserPlus className="h-5 w-5" />
              <DialogTitle>Invite Staff Member</DialogTitle>
            </div>
            <DialogDescription>
              Send an invitation to a receptionist, clinic manager, or dental colleague.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="staffEmail">Staff Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="staffEmail"
                type="email"
                placeholder="receptionist@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Access Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receptionist">Receptionist (Follow-ups & Leads)</SelectItem>
                  <SelectItem value="admin">Administrator (Full clinic permissions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
