import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | MolarMetric",
  description: "Subscription cancellation and refund policy for MolarMetric Dental Revenue Recovery OS.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear and fair subscription, cancellation, and refund terms"
      lastUpdated="October 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          1. Supervised Pilot Program (Zero Charge)
        </h2>
        <p>
          During the ongoing <strong>Supervised Pilot Phase</strong>, verified dental clinics are granted complimentary access to MolarMetric without payment obligation. Because no subscription fees or setup charges are collected during the supervised pilot, refund provisions do not apply during this period.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          2. Commercial Subscription & Cancellation
        </h2>
        <p>
          Upon introduction of live commercial billing:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Monthly Subscriptions:</strong> Subscriptions are billed in advance on a monthly recurring basis in Indian Rupees (INR). Clinics may cancel their recurring subscription at any time through their practice settings.</li>
          <li><strong>Effect of Cancellation:</strong> When a clinic cancels its subscription, workspace access remains active until the end of the current paid billing cycle. No further renewal charges will be applied.</li>
          <li><strong>Data Access Following Cancellation:</strong> Clinics retain the ability to export all patient enquiries and clinical opportunities in standard CSV format prior to or upon subscription expiration.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          3. Refund Eligibility
        </h2>
        <p>
          Except where required by applicable Indian law or explicitly agreed in writing by an authorized representative of <strong>[[PLACEHOLDER: Legal Entity Name]]</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Subscription fees are generally non-refundable once a billing cycle has commenced.</li>
          <li>In the event of a verified technical billing error (e.g. duplicate payment charge), the excess payment will be refunded to the original payment method within 5–7 business days.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif text-white border-b border-stone-800 pb-2">
          4. How to Request Assistance
        </h2>
        <p>
          For any billing inquiries, cancellation requests, or payment questions, please reach out to our support team:
        </p>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/50 space-y-1 font-mono text-xs text-stone-300">
          <p><strong>Email:</strong> [[PLACEHOLDER: Support/Billing Email]]</p>
          <p><strong>Entity:</strong> [[PLACEHOLDER: Legal Entity Name]]</p>
          <p><strong>Support Desk:</strong> [[PLACEHOLDER: WhatsApp Support Number]]</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
