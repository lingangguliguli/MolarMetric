import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { ShieldCheck, Lock, Database, FileSpreadsheet, EyeOff, Server } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Architecture & Controls | MolarMetric",
  description: "Verified application security architecture and tenant isolation controls of MolarMetric.",
};

export default function SecurityPage() {
  return (
    <LegalPageLayout
      title="Security Architecture & Controls"
      subtitle="Honest technical documentation of verified safeguards protecting clinic and prospective patient information"
      lastUpdated="October 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          1. Security Principles
        </h2>
        <p>
          At MolarMetric, we believe in transparent, verifiable security rather than unsubstantiated claims. We do not claim third-party certifications (such as SOC 2 or ISO 27001) or 24/7 military-grade monitoring that has not been independently audited. Instead, this page details the <strong>actual technical safeguards engineered directly into the MolarMetric software architecture</strong>.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          2. Verified Technical Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Control 1 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <span>PostgreSQL Row Level Security (RLS)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every database query enforces tenant isolation at the PostgreSQL database engine level using <code>auth.uid()</code> and verified clinic memberships. No clinic can access, view, or mutate another clinic&apos;s patient enquiries.
            </p>
          </div>

          {/* Control 2 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Server-Side RBAC Enforcement</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Privileged mutations (such as deleting patient records, inviting staff, and altering clinic profiles) are strictly validated on the server. Receptionist accounts are prevented from executing owner-only mutations.
            </p>
          </div>

          {/* Control 3 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Formula Injection Sanitization</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              All exported spreadsheet values are screened and escaped. Leading dangerous formula characters (<code>=, +, -, @, \t, \r</code>) are prefixed with a single quote to prevent DDE/formula execution in Microsoft Excel or Google Sheets.
            </p>
          </div>

          {/* Control 4 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <EyeOff className="w-4 h-4" />
              <span>PII Minimization & Safe Logging</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Application server logs omit patient names, phone numbers, and authentication secrets. Error boundaries render safe, user-friendly messages rather than exposing raw stack traces or internal schema paths.
            </p>
          </div>

          {/* Control 5 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Server className="w-4 h-4" />
              <span>Transport Encryption (TLS 1.3)</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              All communications between the browser, API routes, and database are encrypted in transit using modern TLS 1.3 protocols with HSTS preconfigured for HTTPS domains.
            </p>
          </div>

          {/* Control 6 */}
          <div className="p-5 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>Append-Only Audit Trails</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Administrative actions (such as lead deletions, staff role assignments, and team invites) are permanently recorded in an append-only audit log with actor ID and timestamp metadata.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          3. Infrastructure & Backups
        </h2>
        <p>
          MolarMetric databases are hosted via Supabase PostgreSQL instances located in AWS Asia Pacific (Mumbai) regions. Automated daily snapshots are maintained by the database infrastructure provider. Practice owners can also export their complete data locally at any time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          4. Responsible Vulnerability Disclosure
        </h2>
        <p>
          We welcome responsible security research. If you discover a potential vulnerability, please report it directly to:
        </p>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/50 space-y-1 font-mono text-xs text-stone-300">
          <p><strong>Security Contact:</strong> [[PLACEHOLDER: Security Contact Email]]</p>
          <p><strong>Entity:</strong> [[PLACEHOLDER: Legal Entity Name]]</p>
          <p><strong>Response Target:</strong> Acknowledgement within 48 business hours.</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
