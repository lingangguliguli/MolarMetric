"use client";

import { useState } from "react";
import { createClinicAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const LEAD_SOURCE_OPTIONS = [
  { id: "phone", label: "Direct Phone Calls", desc: "Front desk phone inquiries" },
  { id: "whatsapp", label: "WhatsApp Messaging", desc: "Direct patient chat inquiries" },
  { id: "walk_in", label: "Walk-in Consultations", desc: "Patients visiting the clinic directly" },
  { id: "google_ads", label: "Google Ads & Search", desc: "Local dental SEO and paid search" },
  { id: "instagram", label: "Instagram & Meta Ads", desc: "Smile makeover / aligner campaigns" },
  { id: "practo", label: "Practo / JustDial", desc: "Healthcare listing aggregators" },
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
  const [timezone] = useState("Asia/Kolkata");
  const [currency] = useState("INR");
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
    <div className="min-h-screen bg-[#070A11] text-stone-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative selection:bg-amber-500/20 selection:text-amber-300">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full text-center mb-8">
        <div className="flex justify-center mb-5">
          <BrandLogo size="md" href="/dashboard" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
          Configure Your Practice Workspace
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-400">
          Step {step} of 3: {step === 1 ? "Clinic Profile" : step === 2 ? "Inquiry Channels & Locale" : "Review & Launch"}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-stone-800 h-1.5 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-2xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <Card className="border border-stone-800 bg-stone-900/90 backdrop-blur-xl text-white shadow-2xl rounded-2xl">
          {step === 1 && (
            <>
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-serif text-white">Clinic Profile</CardTitle>
                    <CardDescription className="text-stone-400 text-xs">
                      Practice identity and official patient communication contact info.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6 sm:p-8 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Clinic Name <span className="text-amber-400">*</span>
                  </Label>
                  <Input
                    id="clinicName"
                    placeholder="e.g. Apex Dental Care & Implant Center"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    required
                    className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      Reception Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      Official Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@apexdental.in"
                        className="pl-10 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Street Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <Input
                      id="address"
                      placeholder="Shop 4, Sunrise Plaza, MG Road"
                      className="pl-10 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      State
                    </Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl font-mono"
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
                    className="h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 px-6"
                  >
                    Continue to Channels
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-serif text-white">Inquiry Channels & Locale</CardTitle>
                    <CardDescription className="text-stone-400 text-xs">
                      Select how patients contact your front desk to tailor lead intake pipelines.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-8 pt-2">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3 block">
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
                              ? "border-amber-500/60 bg-amber-500/10 text-white shadow-sm"
                              : "border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700 hover:bg-stone-950"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-xs sm:text-sm text-stone-100">
                              {opt.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            {opt.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-800">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Timezone
                    </Label>
                    <Input
                      disabled
                      value={timezone}
                      className="bg-stone-950 border-stone-800 cursor-not-allowed text-xs font-mono text-stone-300 h-11 rounded-xl"
                    />
                    <p className="text-[11px] text-stone-400 font-mono">
                      Indian Standard Time (IST - UTC+05:30)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold uppercase tracking-wider">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      Currency
                    </Label>
                    <Input
                      disabled
                      value={currency}
                      className="bg-stone-950 border-stone-800 cursor-not-allowed text-xs font-mono text-stone-300 h-11 rounded-xl"
                    />
                    <p className="text-[11px] text-stone-400 font-mono">
                      Indian Rupee (INR - ₹)
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-11 rounded-xl"
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
                    className="h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 px-6"
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
              <CardHeader className="p-6 sm:p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-serif text-white">Ready to Launch MolarMetric</CardTitle>
                    <CardDescription className="text-stone-400 text-xs">
                      Confirm workspace configuration. You will be set as Clinic Owner with full administrative privileges.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-8 pt-2">
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                      Clinic Details
                    </span>
                    <h4 className="text-lg font-serif font-bold text-white">
                      {clinicName}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {[address, city, state, pincode].filter(Boolean).join(", ") || "No physical address provided"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Reception Phone</span>
                      <span className="font-mono font-medium text-white">{phone || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Official Email</span>
                      <span className="font-mono font-medium text-white">{email || "Not set"}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800">
                    <span className="text-[11px] font-medium text-stone-400 block mb-2">
                      Configured Channels ({selectedSources.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSources.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 capitalize"
                        >
                          {s.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-stone-800/80 bg-stone-900/50 p-4 text-xs text-stone-300 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Postgres Row Level Security (RLS) tenant isolation active</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Default clinical WhatsApp templates seeded (Welcome, Recall, Follow-up)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Triage action queue & treatment conversion matrix initialized</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-11 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleComplete}
                    disabled={loading}
                    className="h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing Workspace...
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
      <div className="text-center text-xs text-stone-400 mt-8 font-medium">
        MolarMetric — Dental Revenue Recovery OS. Secure & Isolated Tenant Architecture.
      </div>
    </div>
  );
}
