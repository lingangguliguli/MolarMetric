"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Mail, AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const result = await forgotPasswordAction(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 lg:hidden flex items-center justify-center">
        <BrandLogo size="md" />
      </div>

      <Card className="border border-stone-800 bg-stone-900/90 backdrop-blur-xl text-white shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1.5 p-6 sm:p-8">
          <Link
            href="/login"
            className="inline-flex items-center text-xs text-amber-400 hover:text-amber-300 mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to sign in
          </Link>
          <CardTitle className="text-2xl font-serif text-white tracking-tight">Reset your password</CardTitle>
          <CardDescription className="text-stone-300 text-sm">
            Enter your registered practice email to receive recovery instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-8">
          {success ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-200 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-white">Check your inbox</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">{success}</p>
                </div>
              </div>
              <Link href="/login" className="block pt-2">
                <Button className="w-full h-10 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 mb-2 rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300 text-xs font-medium" role="alert">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                  Official Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    required
                    className="pl-10 bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending instructions...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
