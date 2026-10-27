"use client";

import { useState } from "react";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clinicName: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <LegalPageLayout
      title="Contact Practice Desk"
      subtitle="Connect with MolarMetric founder onboarding, support, and administrative teams"
      lastUpdated="October 2026"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Left Column: Official Details & Placeholders */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/60 space-y-4">
            <h3 className="font-serif text-lg text-white">Registered Entity & Desk</h3>
            
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-sans">Registered Office:</strong>
                  <span className="font-mono text-stone-400">[[PLACEHOLDER: Registered Business Address]]</span>
                  <span className="block font-mono text-stone-400">[[PLACEHOLDER: Governing Jurisdiction City, India]]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-sans">Official Support Email:</strong>
                  <span className="font-mono text-stone-400">[[PLACEHOLDER: Support Email]]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-sans">Support WhatsApp Desk:</strong>
                  <span className="font-mono text-stone-400">[[PLACEHOLDER: WhatsApp Support Number]]</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-sans">Tax & Entity Registration:</strong>
                  <span className="font-mono text-stone-400">Entity: [[PLACEHOLDER: Legal Entity Name]]</span>
                  <span className="block font-mono text-stone-400">GSTIN: [[PLACEHOLDER: GSTIN]]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-xs text-stone-400 space-y-2">
            <strong className="text-stone-300 block">Supervised Pilot Inquiries:</strong>
            <p>
              Independent clinics or multi-chair dental groups interested in participating in the limited 1–3 clinic supervised pilot can send an enquiry directly via this form.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-stone-800 bg-stone-900/90 shadow-2xl">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-white">Message Received</h3>
                <p className="text-xs text-stone-300 max-w-sm leading-relaxed">
                  Thank you for reaching out. Our onboarding lead will contact your clinic via phone or email within one business day.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-stone-700 text-stone-300 hover:text-white"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg text-white mb-2">Send an Enquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider text-stone-300">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="Dr. Arjun Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clinicName" className="text-xs uppercase tracking-wider text-stone-300">
                      Clinic / Practice Name
                    </Label>
                    <Input
                      id="clinicName"
                      required
                      placeholder="Apex Dental Care"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-stone-300">
                      Official Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="doctor@apexdental.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-stone-300">
                      Contact Mobile Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-stone-950 border-stone-800 text-white placeholder:text-stone-600 focus:border-amber-400 h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs uppercase tracking-wider text-stone-300">
                    How can we assist your practice?
                  </Label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell us about your clinic setup, enquiry volume, or questions about the supervised pilot..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white placeholder:text-stone-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}
