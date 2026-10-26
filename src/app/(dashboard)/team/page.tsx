import { getTeamMembers } from "@/app/actions/team";
import { getAuthenticatedClinic } from "@/lib/auth-context";
import { TeamView } from "@/components/team/team-view";
import { UserCheck } from "lucide-react";

export default async function TeamPage() {
  const [{ members, pendingInvitations }, { role }] = await Promise.all([
    getTeamMembers(),
    getAuthenticatedClinic(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <UserCheck className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Clinic Access Control
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Clinic Staff & Permissions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage receptionist accounts, role-based security, and team invitations.
        </p>
      </div>

      <TeamView
        initialMembers={members}
        initialInvitations={pendingInvitations}
        currentUserRole={role}
      />
    </div>
  );
}
