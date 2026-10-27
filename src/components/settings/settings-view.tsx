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
  Sparkles,
  CreditCard,
  Calendar,
  Check,
  AlertTriangle,
} from "lucide-react";
import type { Clinic, UserRole, AuditEvent } from "@/lib/types";
import { getSubscriptionInfo } from "@/lib/subscription";

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
  const sub = getSubscriptionInfo(clinic);

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
        <TabsList className="grid grid-cols-3 w-full sm:w-[500px]">
          <TabsTrigger value="profile" className="text-xs">Clinic Profile</TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs">Subscription & Trial</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">Audit Logs</TabsTrigger>
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

        {/* Tab 2: Subscription & Trial Management */}
        <TabsContent value="subscription" className="mt-4 space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <span>{sub.isTrial ? "14-Day Clinical Pro Trial" : "MolarMetric Pro Plan"}</span>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-400 border-amber-500/30"
                      >
                        Supervised Pilot (Free)
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Your clinic is enrolled in the MolarMetric Supervised Pilot. All operational features are complimentary for pilot clinics.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1">
                    Pilot Access Granted
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Pilot Status Card */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    Supervised Pilot Program
                  </span>
                  <span className="text-amber-300 font-bold">
                    Active (1–3 Clinics Cohort)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Workspace Created</span>
                    <span className="font-medium text-foreground">
                      {new Date(clinic.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Billing Status</span>
                    <span className="font-medium text-emerald-400">Complimentary Pilot</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-muted-foreground text-[11px] block">Commercial Plans</span>
                    <span className="font-medium text-stone-300">Introduced post-pilot</span>
                  </div>
                </div>
              </div>

              {/* Included Features */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                  Active Features in Workspace
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    "Patient Enquiry Lifecycle & Follow-up Funnel",
                    "High-Value Treatment Pipeline & Revenue Recovery",
                    "One-Click Manual WhatsApp Communication Drafts",
                    "Daily Clinical Motivation & Staff Performance Hub",
                    "Role-Based Access for Receptionists & Admins",
                    "Tamper-Evident Audit Logs & Financial Privacy",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-stone-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilot Notice Strip */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-900/40 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>
                    Supervised Pilot: Commercial billing is not active during this phase. Practice data is strictly isolated and exportable at any time.
                  </span>
                </div>
                <Badge variant="outline" className="border-stone-700 text-stone-300 text-[10px]">
                  Zero Charge
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Security & Audit Trail */}
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
