"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "multichair";
  const normalizedPlan = ["boutique", "multichair", "group"].includes(planParam)
    ? planParam
    : "multichair";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const planTitles: Record<string, string> = {
    boutique: "Boutique (Single Chair Pilot)",
    multichair: "Multi-Chair Practice (Pilot)",
    group: "Dental Group / Hospital",
  };

  async function handleSubmit(formData: FormData) {
    if (!termsAccepted) {
      setError("You must review and accept the Terms of Service and Privacy Policy to proceed.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      formData.set("termsAccepted", "true");
      formData.set("plan", normalizedPlan);
      const result = await registerAction(formData);
      if (result?.error) {
        setError(result.error);
      }
      if (result?.success) {
        setSuccess(result.success);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 lg:hidden flex items-center justify-center">
        <BrandLogo size="md" />
      </div>

      <Card className="border border-stone-800 bg-stone-900/90 backdrop-blur-xl text-white shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1.5 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-serif text-white tracking-tight">Create your account</CardTitle>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {planTitles[normalizedPlan] || "Supervised Pilot"}
            </span>
          </div>
          <CardDescription className="text-stone-300 text-sm">
            Launch your clinical revenue recovery operating system
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-8">
          {error && (
            <div className="flex items-center gap-2 p-3.5 mb-5 rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300 text-xs font-medium" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-white">Account Created!</h3>
                <p className="text-xs text-stone-300 max-w-sm leading-relaxed">{success}</p>
              </div>
              <Link href="/login" className="w-full mt-2">
                <Button className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="plan" value={normalizedPlan} />

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Doctor / Practice Owner Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Dr. Arjun Patel"
                    required
                    autoComplete="name"
                    autoFocus
                    className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Official Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    required
                    autoComplete="email"
                    className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    minLength={8}
                    className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-stone-400">
                    Must be at least 8 characters with uppercase, lowercase, and a number.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                  />
                </div>

                {/* Terms and Privacy Acceptance Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-stone-300 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                        Privacy Policy
                      </Link>{" "}
                      (v1.0). I acknowledge MolarMetric processes practice data on documented instructions.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Create Practice Account
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-stone-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
