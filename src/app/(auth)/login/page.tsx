"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
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
          <CardTitle className="text-2xl font-serif text-white tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-stone-300 text-sm">
            Sign in to your MolarMetric clinic workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-8">
          {error && (
            <div className="flex items-center gap-2 p-3.5 mb-5 rounded-xl bg-destructive/15 border border-destructive/30 text-rose-300 text-xs font-medium" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
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
                autoFocus
                className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-stone-200 text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 h-11 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In to Practice
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register?plan=multichair"
              className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1"
            >
              Join supervised pilot
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
