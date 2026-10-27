import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MolarMetric",
  description: "Privacy Policy and prospective patient data protection terms for MolarMetric Dental Revenue Recovery OS.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How MolarMetric processes practice and prospective patient information under Indian privacy standards"
      lastUpdated="October 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          1. Introduction & Regulatory Context
        </h2>
        <p>
          This Privacy Policy applies to the software-as-a-service application known as <strong>MolarMetric</strong> (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated by <strong>[[PLACEHOLDER: Legal Entity Name]]</strong>, having its registered office at <strong>[[PLACEHOLDER: Registered Business Address]]</strong>.
        </p>
        <p>
          MolarMetric provides clinical revenue recovery, enquiry triage, follow-up coordination, and appointment tracking tools for independent dental clinics and dental groups in India. This Policy is drafted in accordance with the <em>Digital Personal Data Protection Act, 2023 (DPDPA)</em>, the <em>Information Technology Act, 2000</em>, and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          2. Roles & Data Processing Model
        </h2>
        <p>
          In respect of prospective patient personal data handled on the Platform:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>The Clinic (Data Fiduciary):</strong> The dental clinic practice owner determines the purpose, necessity, and clinical means of collecting and handling prospective patient contact details, treatment interests, and appointment schedules.
          </li>
          <li>
            <strong>MolarMetric (Data Processor):</strong> MolarMetric processes clinic and prospective-patient data solely on the documented instructions of the authorized clinic practice owner, providing technical infrastructure, database storage, and operational interfaces.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          3. Categories of Data Collected
        </h2>
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-amber-300">A. Practice Owner & Staff Information</h3>
          <p>
            When registering or using a clinic workspace, we collect: full name, professional email address, hashed login credentials (managed securely via Supabase Auth), clinic business name, clinic phone number, clinic address, and staff role allocations.
          </p>

          <h3 className="text-base font-semibold text-amber-300">B. Prospective Patient Information Entered by the Clinic</h3>
          <p>
            The clinic front desk may enter: prospective patient name, normalized mobile telephone number (+91 E.164 format), acquisition channel (e.g. Google, walk-in, WhatsApp, referral), clinical procedure of interest (e.g. implants, aligners, root canal treatment), scheduled consultation time, follow-up status, proposed treatment quote values, and chairside collection amounts.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          4. WhatsApp Integration & One-Click Drafts
        </h2>
        <p>
          MolarMetric provides a <em>manual click-to-chat draft generator</em> utilizing official <code>wa.me</code> protocol links. The Platform <strong>does not automatically dispatch unsolicited messages</strong>, send automated bulk broadcasts, or track message delivery receipts. Authorized clinic staff must explicitly click to preview, review, and manually send each message using their own clinic WhatsApp device or client.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          5. Sub-Processors & Data Hosting
        </h2>
        <p>
          MolarMetric utilizes reputable cloud infrastructure providers with strict security controls:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-800 rounded-xl overflow-hidden">
            <thead className="bg-stone-900 text-stone-200">
              <tr>
                <th className="p-3 border-b border-stone-800">Sub-Processor</th>
                <th className="p-3 border-b border-stone-800">Purpose</th>
                <th className="p-3 border-b border-stone-800">Data Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              <tr>
                <td className="p-3 font-semibold text-white">Supabase / AWS</td>
                <td className="p-3">PostgreSQL database storage, Row Level Security, Auth</td>
                <td className="p-3 font-mono text-stone-400">AWS ap-south-1 (Mumbai) / Region-pinned</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Vercel Inc.</td>
                <td className="p-3">Application hosting, edge SSR routing, API compute</td>
                <td className="p-3 font-mono text-stone-400">Mumbai (BOM1) / Global Edge</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Cashfree Payments</td>
                <td className="p-3">Payment gateway processing (upon commercial rollout)</td>
                <td className="p-3 font-mono text-stone-400">India (RBI Compliant)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          6. Data Security, Isolation & Tenant Protection
        </h2>
        <p>
          Every customer workspace is isolated using PostgreSQL Row Level Security (RLS) policies. Staff members can only query or alter records belonging to their authenticated clinic ID. Audit logs capture significant events (such as lead deletion, role modifications, and team invitations).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          7. Retention, Export & Deletion
        </h2>
        <p>
          Clinic owners maintain complete ownership of their data. At any time, authorized clinic owners may export all patient enquiries and treatment opportunities into CSV format (with automated formula injection neutralization). Upon workspace termination or request, clinic records are permanently removed in accordance with documented retention schedules.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          8. Grievance Officer & Contact Information
        </h2>
        <p>
          For privacy inquiries, data subject rights, or grievance redressal under Indian regulations, please contact:
        </p>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/50 space-y-1 font-mono text-xs text-stone-300">
          <p><strong>Grievance Officer:</strong> [[PLACEHOLDER: Grievance Officer Name]]</p>
          <p><strong>Entity:</strong> [[PLACEHOLDER: Legal Entity Name]]</p>
          <p><strong>Email:</strong> [[PLACEHOLDER: Support/Grievance Email]]</p>
          <p><strong>Address:</strong> [[PLACEHOLDER: Registered Business Address]]</p>
          <p><strong>Jurisdiction:</strong> [[PLACEHOLDER: Governing Jurisdiction City, India]]</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
