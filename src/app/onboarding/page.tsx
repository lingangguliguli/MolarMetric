"use client";

import { useState } from "react";
import { createClinicAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Clock,
  IndianRupee,
} from "lucide-react";

const LEAD_SOURCE_OPTIONS = [
  { id: "phone", label: "Phone Calls", desc: "Direct incoming phone inquiries" },
  { id: "whatsapp", label: "WhatsApp", desc: "Chat inquiries and WhatsApp click-to-chat" },
  { id: "walk_in", label: "Walk-ins", desc: "Patients visiting reception directly" },
  { id: "google", label: "Google Business / Ads", desc: "Google Maps and Search leads" },
  { id: "instagram", label: "Instagram", desc: "DMs and ads on Instagram" },
  { id: "website", label: "Clinic Website", desc: "Contact forms on your website" },
  { id: "referral", label: "Doctor / Patient Referrals", desc: "Word-of-mouth recommendations" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [currency, setCurrency] = useState("INR");
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "phone",
    "whatsapp",
    "walk_in",
  ]);

  function toggleSource(id: string) {
    if (selectedSources.includes(id)) {
      if (selectedSources.length > 1) {
        setSelectedSources(selectedSources.filter((s) => s !== id));
      }
    } else {
      setSelectedSources([...selectedSources, id]);
    }
  }

  async function handleComplete() {
    if (!clinicName.trim()) {
      setError("Please provide a clinic name.");
      setStep(1);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", clinicName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("pincode", pincode);
    formData.append("timezone", timezone);
    formData.append("currency", currency);

    selectedSources.forEach((src) => {
      formData.append("lead_sources", src);
    });

    const result = await createClinicAction(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            MolarMetric
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Set up your clinic workspace
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {step} of 3: {step === 1 ? "Clinic Information" : step === 2 ? "Inquiry Channels" : "Review & Launch"}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-2xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <Card className="border-border/60 shadow-lg">
          {step === 1 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Clinic Profile</CardTitle>
                    <CardDescription>
                      Basic details for your practice and patient communications.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">
                    Clinic Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g. Apex Dental Care & Implant Center"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Clinic Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-9"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@apexdental.in"
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Shop 4, Sunrise Plaza, MG Road"
                      className="pl-9"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!clinicName.trim()) {
                        setError("Clinic name is required.");
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Inquiry Channels & Locale</CardTitle>
                    <CardDescription>
                      Select the primary channels through which patients reach out to your practice.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    Active Patient Inquiry Channels
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LEAD_SOURCE_OPTIONS.map((opt) => {
                      const isSelected = selectedSources.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleSource(opt.id)}
                          className={`cursor-pointer rounded-xl border p-3.5 transition-all select-none ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/60 hover:border-border"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-medium text-sm text-foreground">
                              {opt.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {opt.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      Timezone
                    </Label>
                    <Input
                      disabled
                      value={timezone}
                      className="bg-muted cursor-not-allowed text-xs font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Standard Indian Standard Time (IST)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
                      Currency
                    </Label>
                    <Input
                      disabled
                      value={currency}
                      className="bg-muted cursor-not-allowed text-xs font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Indian Rupee (INR - ₹)
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedSources.length === 0) {
                        setError("Please select at least one inquiry channel.");
                        return;
                      }
                      setError(null);
                      setStep(3);
                    }}
                  >
                    Continue to Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ready to Launch MolarMetric</CardTitle>
                    <CardDescription>
                      Review your setup. You will be set as Clinic Owner with full administrative control.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-border/60 bg-slate-50/50 dark:bg-slate-900/50 p-5 space-y-4">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Clinic Details
                    </span>
                    <h4 className="text-base font-semibold text-foreground mt-0.5">
                      {clinicName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {[address, city, state, pincode].filter(Boolean).join(", ") || "No address provided"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Phone</span>
                      <span className="font-medium text-foreground">{phone || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Email</span>
                      <span className="font-medium text-foreground">{email || "Not set"}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <span className="text-xs font-medium text-muted-foreground block mb-2">
                      Active Channels ({selectedSources.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSources.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize"
                        >
                          {s.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
                  ✓ Automatically sets up default WhatsApp message templates (Welcome, Appointment Reminder, Follow-up).<br />
                  ✓ Configures role-based access control and tenant isolation.<br />
                  ✓ Activates daily follow-up task queues and conversion reporting.
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating workspace...
                      </>
                    ) : (
                      <>
                        Launch Workspace
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground mt-8">
        MolarMetric — The Dental Revenue Recovery OS. Secure & Isolated Tenant Architecture.
      </div>
    </div>
  );
}
