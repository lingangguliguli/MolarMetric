import { getClinicSettings, getAuditLogs } from "@/app/actions/settings";
import { SettingsView } from "@/components/settings/settings-view";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const [{ clinic, role }, auditLogs] = await Promise.all([
    getClinicSettings(),
    getAuditLogs(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <Settings className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Workspace Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Clinic Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure clinic profile information, marketing channels, and audit security records.
        </p>
      </div>

      <SettingsView
        clinic={clinic}
        currentUserRole={role}
        auditLogs={auditLogs}
      />
    </div>
  );
}
