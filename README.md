# MolarMetric — Dental Revenue Recovery OS

> **MolarMetric** is a production-grade, multi-tenant B2B SaaS platform purpose-built for independent dental clinics and dental groups in India. It empowers clinic owners and receptionists to capture every patient enquiry, coordinate fast follow-ups, schedule consultations, track proposed clinical treatment cases, and measure revenue conversion.

---

## 🌟 Core Feature Suite

1. **Lead & Enquiry Pipeline**
   - Multi-channel capture: Phone calls, WhatsApp, Walk-ins, Google Search/Ads, Instagram, Website contact forms, and Doctor referrals.
   - Stage progression engine: `New Enquiry` → `Contacted` → `Interested` → `Appointment Booked` → `Attended Clinic` → `Treatment Proposed` → `Won / Paid` (or `Lost`).
   - Duplicate phone prevention with automatic Indian number normalization (`+91XXXXXXXXXX`).
   - Tamper-evident activity trail (`lead_events`) capturing all patient interactions and notes.

2. **Receptionist Daily Follow-up Queue**
   - Smart daily action queue categorized by urgency: **Overdue** (past due date), **Due Today**, and **Upcoming**.
   - One-click actions: direct mobile dial (`tel:`), instant WhatsApp draft generation with merge tags, task completion with outcome logging, and task rescheduling.

3. **Clinical Appointments & Attendance**
   - Consultation booking linked directly to patient enquiries.
   - Attendance tracking (`Booked`, `Confirmed`, `Attended`, `Missed`, `Cancelled`, `Rescheduled`).
   - Automatic 24-hour pre-appointment reminder task generation.

4. **Treatment Revenue Recovery**
   - Separate tracking for **Proposed Treatment Estimates**, **Accepted Case Values**, and **Realized Cash Collections**.
   - Breakdown by dental procedure: Dental Implants, Orthodontics / Clear Aligners, RCT, Crown & Bridge, Cosmetic Veneers, etc.
   - Loss reason tracking for declined cases to diagnose pricing or communication friction.

5. **WhatsApp Message Templates & Click-to-Chat**
   - Clinic-customizable templates for welcome messages, appointment confirmations, recall reminders, and post-op care.
   - Dynamic merge tags: `{{patient_name}}`, `{{clinic_name}}`, `{{appointment_date}}`, `{{appointment_time}}`, `{{service_interest}}`, `{{clinic_phone}}`.
   - Generates compliant `https://wa.me/{phone}?text={encoded}` links without requiring expensive Meta BSP fees for basic usage.

6. **Daily Staff Motivation System**
   - 90+ curated motivational messages tailored specifically for dental clinic receptionists and front-desk teams.
   - Tracks per-user daily displays and prevents repetitive banner fatigue.

7. **Multi-Tenant Security & Role-Based Access Control**
   - Isolated PostgreSQL Row Level Security (RLS) policies on every tenant table keyed by `clinic_id`.
   - Role hierarchy: **Owner** (full billing & ownership control), **Admin** (staff invitations & clinic settings), and **Receptionist** (enquiries, tasks, and appointments).
   - Tamper-evident `audit_events` log recording member removals, role changes, CSV exports, and settings updates.
   - CSV formula injection sanitization on all tabular exports.

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 14 with App Router (`app/` directory), React Server Components, and Server Actions.
- **Language**: TypeScript with strict mode enabled (`tsc --noEmit` clean).
- **Styling**: Tailwind CSS + shadcn/ui design system with Radix UI primitives.
- **Database & Auth**: Supabase (PostgreSQL with RLS, Supabase Auth via `@supabase/ssr`).
- **Billing**: Razorpay payment integration with HMAC-SHA256 webhook signature verification.
- **Testing**: Vitest + jsdom test suite with 100% pass rate.
- **CI/CD**: GitHub Actions pipeline validating lint, type-check, and automated unit tests.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `18.17.0+`
- npm or pnpm

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MolarMetric
```

### 3. Database Setup
1. In your Supabase SQL Editor, run:
   - `supabase/migrations/001_initial_schema.sql` (Creates all 14 multi-tenant tables, indexes, RLS policies, triggers, and functions).
   - `supabase/seed/002_motivational_messages.sql` (Seeds the 90+ dental clinic motivation library).

### 4. Install Dependencies & Run
```bash
# Install dependencies
npm install

# Run TypeScript type check
npm run type-check

# Run test suite
npm test

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Repository Structure

```
├── .github/workflows/ci.yml       # Automated CI pipeline
├── src/
│   ├── app/
│   │   ├── (auth)/                # Auth layouts, login, register, reset password
│   │   ├── (dashboard)/           # Protected workspace routes
│   │   │   ├── dashboard/         # Main KPI & revenue recovery dashboard
│   │   │   ├── follow-ups/        # Receptionist daily task action queue
│   │   │   ├── leads/             # Enquiries directory & detail profile view
│   │   │   ├── appointments/      # Consultation bookings & attendance
│   │   │   ├── treatments/        # Clinical treatment revenue & collections
│   │   │   ├── templates/         # WhatsApp merge-tag message templates
│   │   │   ├── team/              # Staff memberships & role control
│   │   │   ├── reports/           # Conversion funnels & attribution reports
│   │   │   └── settings/          # Clinic profile & security audit log
│   │   ├── actions/               # Server Actions for all business domains
│   │   ├── api/                   # Webhook & health check endpoints
│   │   └── onboarding/            # 3-step clinic setup wizard
│   ├── components/                # UI components & domain-specific views
│   ├── lib/
│   │   ├── supabase/              # Client, server, and middleware session clients
│   │   ├── auth-context.ts        # Active tenant & user role resolver
│   │   ├── razorpay.ts            # Billing client & webhook signature verification
│   │   ├── types.ts               # Domain TypeScript interfaces
│   │   ├── utils.ts               # Phone normalization, formatting, security
│   │   └── validations.ts         # Zod schemas for all forms & actions
│   └── __tests__/                 # Vitest automated test suite
├── supabase/
│   ├── migrations/                # Database schema & RLS policies
│   └── seed/                      # Initial seed datasets
└── vitest.config.ts               # Vitest configuration
```

---

## 🔒 Security Measures

- **No Shared Tenant Data**: Every table enforces Postgres Row Level Security (`clinic_id = current_clinic_id`).
- **Server Actions Authentication**: Every Server Action validates caller session and tenancy before mutations.
- **OWASP Formula Injection Prevention**: CSV export sanitizes `=`, `+`, `-`, and `@` characters.
- **Password Policies**: Requires minimum 8 characters with lowercase, uppercase, and numbers.
- **Cryptographic Webhooks**: HMAC SHA256 timing-safe comparison on billing payloads.

---

## 📄 License
Commercial proprietary software — MolarMetric OS. All rights reserved.
