import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MolarMetric",
  description: "Terms of Service and Practice Agreement for MolarMetric Dental Revenue Recovery OS.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Standard Practice Agreement and Terms of Use for MolarMetric Platform"
      lastUpdated="October 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          1. Agreement to Terms
        </h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between <strong>[[PLACEHOLDER: Legal Entity Name]]</strong> (&quot;MolarMetric&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) and the dental practice, healthcare entity, or authorized individual practitioner (&quot;Customer&quot;, &quot;Clinic&quot;, or &quot;You&quot;) accessing or using the MolarMetric software application.
        </p>
        <p>
          By creating an account, launching a practice workspace, or participating in the MolarMetric Supervised Pilot, you confirm that you have the requisite authority to bind your dental clinic to these Terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          2. Scope of Service & Non-Clinical Disclaimer
        </h2>
        <p>
          MolarMetric provides business operations software designed to assist dental clinics in managing prospective patient inquiries, tracking follow-up workflows, generating manual WhatsApp communication drafts, and tracking chairside case revenue milestones.
        </p>
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs">
          <strong>Non-Clinical Tool Notice:</strong> MolarMetric is strictly a practice management and revenue recovery tool. It does NOT provide clinical advice, medical diagnoses, treatment planning algorithms, electronic medical prescription services, or clinical decision support. All clinical care and diagnostic decisions remain the sole professional responsibility of registered dental practitioners.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          3. Supervised Pilot Program Terms
        </h2>
        <p>
          During the initial supervised pilot phase:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access to the MolarMetric platform is provided complimentary to a limited cohort of 1–3 invited dental practices.</li>
          <li>Pilot clinics receive direct developer and founder onboarding and technical support.</li>
          <li>Pilot access does not guarantee perpetual free commercial access; standard commercial terms and transparent subscription tiers will be presented prior to commercial billing rollout.</li>
          <li>Customer data remains strictly isolated under PostgreSQL Row Level Security and is exportable at any time.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          4. Clinic Account & Staff Responsibilities
        </h2>
        <p>
          The Clinic Owner is responsible for maintaining the confidentiality of login credentials and for all activities occurring under its clinic workspace. The Clinic Owner manages staff invitations (including Receptionist accounts) and must immediately revoke access for departing team members.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          5. Patient Data Authorization & Lawful Consent
        </h2>
        <p>
          The Clinic represents and warrants that it has collected prospective patient contact details in compliance with applicable Indian law, and has obtained all requisite patient consents before logging phone numbers or initiating communication follow-ups.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          6. Intellectual Property & Customer Ownership
        </h2>
        <p>
          MolarMetric retains all right, title, and interest in and to the Platform, including software code, interfaces, algorithms, and documentation. The Clinic retains absolute ownership of all patient records, clinic inquiries, and financial collection data stored within its workspace.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          7. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted under applicable Indian law, MolarMetric shall not be liable for any indirect, incidental, punitive, or consequential damages, loss of clinical profits, loss of data, or operational interruptions. In any event, MolarMetric&apos;s aggregate liability under these Terms shall not exceed the total fees paid by the Clinic to MolarMetric in the three (3) months preceding the claim, or INR 5,000 during the free pilot period.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          8. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>[[PLACEHOLDER: Governing Jurisdiction City, India]]</strong>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
