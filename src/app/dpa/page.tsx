import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Agreement (DPA) | MolarMetric",
  description: "Clinic-level Data Processing Agreement defining responsibilities between Clinic and MolarMetric.",
};

export default function DpaPage() {
  return (
    <LegalPageLayout
      title="Data Processing Agreement (DPA)"
      subtitle="Standard Contractual Clauses & Data Processing Terms for Dental Practices"
      lastUpdated="October 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          1. Context & Contractual Relationship
        </h2>
        <p>
          This Data Processing Agreement (&quot;DPA&quot;) supplements the MolarMetric Terms of Service entered into between <strong>[[PLACEHOLDER: Legal Entity Name]]</strong> (&quot;Data Processor&quot;) and the customer dental clinic represented by its authorized Owner (&quot;Data Fiduciary&quot;).
        </p>
        <p>
          This DPA establishes the technical and contractual safeguards governing the processing of personal data on behalf of the Clinic pursuant to the <em>Digital Personal Data Protection Act, 2023</em> and applicable Indian data protection regulations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          2. Scope, Nature & Purpose of Processing
        </h2>
        <div className="space-y-3">
          <p>
            <strong>Subject Matter:</strong> Provision of practice revenue recovery, lead triage, follow-up scheduling, and consultation tracking software services.
          </p>
          <p>
            <strong>Categories of Data Subjects:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Clinic personnel (practice owners, associate dentists, front-desk receptionists).</li>
            <li>Prospective dental patients inquiring about or scheduling clinical consultations.</li>
          </ul>
          <p>
            <strong>Categories of Personal Data:</strong> Prospective patient names, normalized mobile telephone numbers, communication preferences, service interests (e.g. implants, aligners, RCT), appointment timestamps, proposed treatment values, and chairside collections.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          3. Documented Processing Instructions
        </h2>
        <p>
          The Data Processor shall process personal data solely on documented instructions from the Clinic Owner, including with respect to data retention, export, and deletion. The Data Processor shall not sell, monetize, or use clinic data for third-party commercial advertising.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          4. Technical & Organizational Measures
        </h2>
        <p>
          The Data Processor implements reasonable security practices under Indian law, including:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>PostgreSQL Row Level Security:</strong> Database-enforced isolation ensuring clinic records are segregated at the query engine level.</li>
          <li><strong>Transport Encryption:</strong> All data transmitted between browsers, APIs, and databases is protected via TLS 1.3 / HTTPS.</li>
          <li><strong>Sanitization & Formula Neutralization:</strong> CSV export neutralization protecting clinic devices from spreadsheet formula injection attacks.</li>
          <li><strong>Tamper-Evident Audit Logging:</strong> System logs tracking administrative security events, lead removals, and role updates.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          5. Sub-Processor Authorization & Oversight
        </h2>
        <p>
          The Clinic grants general written authorization for the Data Processor to engage infrastructure sub-processors (specifically Supabase Inc. / Amazon Web Services for database hosting, and Vercel Inc. for edge compute). The Data Processor ensures all sub-processors are bound by data protection obligations no less restrictive than those in this DPA.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          6. Security Incident Notification
        </h2>
        <p>
          In the event of a confirmed security incident impacting Clinic personal data, the Data Processor shall notify the affected Clinic Owner without undue delay, providing information regarding the nature of the breach, affected records, and remedial mitigation measures.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          7. Return, Export & Deletion of Personal Data
        </h2>
        <p>
          Upon termination of services or upon written request from the Clinic Owner, the Data Processor shall provide standard CSV export capabilities and securely delete active workspace records in accordance with verified retention schedules.
        </p>
      </section>
    </LegalPageLayout>
  );
}
