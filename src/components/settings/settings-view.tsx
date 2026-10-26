"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClinicSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
  Shield,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { Clinic, UserRole, AuditEvent } from "@/lib/types";

interface SettingsViewProps {
  clinic: Clinic;
  currentUserRole: UserRole;
  auditLogs: AuditEvent[];
}

const ALL_LEAD_SOURCES = [
  { id: "phone", label: "Phone Calls" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "walk_in", label: "Walk-ins" },
  { id: "google", label: "Google Business" },
  { id: "instagram", label: "Instagram" },
  { id: "website", label: "Clinic Website" },
  { id: "referral", label: "Referrals" },
];

export function SettingsView({
  clinic,
  currentUserRole,
  auditLogs,
}: SettingsViewProps) {
  const router = useRouter();

  const [name, setName] = useState(clinic.name);
  const [phone, setPhone] = useState(clinic.phone || "");
  const [email, setEmail] = useState(clinic.email || "");
  const [address, setAddress] = useState(clinic.address || "");
  const [city, setCity] = useState(clinic.city || "");
  const [state, setState] = useState(clinic.state || "");
  const [pincode, setPincode] = useState(clinic.pincode || "");
  const [leadSources, setLeadSources] = useState<string[]>(clinic.lead_sources || ["phone", "walk_in", "whatsapp"]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = currentUserRole === "owner" || currentUserRole === "admin";

  function toggleSource(id: string) {
    if (leadSources.includes(id)) {
      if (leadSources.length > 1) {
        setLeadSources(leadSources.filter((s) => s !== id));
      }
    } else {
      setLeadSources([...leadSources, id]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await updateClinicSettings({
      name,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      lead_sources: leadSources,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 w-full sm:w-[350px]">
          <TabsTrigger value="profile" className="text-xs">Clinic Profile</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">Security & Audit Log</TabsTrigger>
        </TabsList>

        {/* Tab 1: Clinic Profile Settings */}
        <TabsContent value="profile" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Clinic Workspace Settings</CardTitle>
              <CardDescription>
                Update your practice details, contact numbers, and default operational preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Clinic settings updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="clinicName">Clinic Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="clinicName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!canEdit}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Clinic Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!canEdit}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Official Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!canEdit}
                        placeholder="contact@clinic.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Clinic Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Shop 10, Medical Enclave, MG Road"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Sources */}
                <div className="pt-4 border-t border-border/40">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                    Active Patient Channels
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_LEAD_SOURCES.map((src) => {
                      const isSelected = leadSources.includes(src.id);
                      return (
                        <button
                          key={src.id}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => toggleSource(src.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {src.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Locale info (read-only) */}
                <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">System Timezone</span>
                    <span className="font-mono text-foreground font-semibold">
                      {clinic.timezone} (IST)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Base Currency</span>
                    <span className="font-mono text-foreground font-semibold">
                      {clinic.currency} (₹)
                    </span>
                  </div>
                </div>

                {canEdit && (
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Security & Audit Trail */}
        <TabsContent value="audit" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base font-semibold">Security & Audit Log</CardTitle>
                  <CardDescription>
                    Tamper-evident record of administrative and sensitive operations in this clinic.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">
                  No administrative events recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-border/40">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground capitalize block">
                          {log.event_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {new Date(log.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {JSON.stringify(log.metadata)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
