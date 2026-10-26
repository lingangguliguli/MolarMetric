-- ============================================================================
-- Dental Revenue Recovery OS — Database Schema Migration
-- Version: 001_initial_schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================================
-- CLINICS
-- ============================================================================
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  currency TEXT NOT NULL DEFAULT 'INR',
  lead_sources TEXT[] NOT NULL DEFAULT ARRAY['phone','walk_in','whatsapp'],
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- CLINIC MEMBERSHIPS
-- ============================================================================
CREATE TABLE clinic_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'receptionist')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, user_id)
);

CREATE INDEX idx_memberships_user ON clinic_memberships(user_id) WHERE status = 'active';
CREATE INDEX idx_memberships_clinic ON clinic_memberships(clinic_id) WHERE status = 'active';

-- ============================================================================
-- LEADS
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL CHECK (source IN ('google','instagram','facebook','website','whatsapp','referral','walk_in','phone','other')),
  source_detail TEXT,
  service_interest TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new','contacted','interested','appointment_booked','attended','treatment_proposed','won','lost')),
  first_contact_at TIMESTAMPTZ,
  consent_whatsapp BOOLEAN NOT NULL DEFAULT true,
  consent_sms BOOLEAN NOT NULL DEFAULT false,
  consent_email BOOLEAN NOT NULL DEFAULT false,
  opted_out BOOLEAN NOT NULL DEFAULT false,
  lost_reason TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_clinic ON leads(clinic_id);
CREATE INDEX idx_leads_clinic_stage ON leads(clinic_id, stage);
CREATE INDEX idx_leads_clinic_source ON leads(clinic_id, source);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_phone ON leads(clinic_id, phone);
CREATE INDEX idx_leads_created ON leads(clinic_id, created_at DESC);

-- ============================================================================
-- FOLLOW-UP TASKS
-- ============================================================================
CREATE TABLE follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('first_contact','follow_up','callback','appointment_reminder','reschedule','treatment_follow_up','general')),
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled','overdue')),
  completed_at TIMESTAMPTZ,
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_clinic_status ON follow_up_tasks(clinic_id, status);
CREATE INDEX idx_tasks_due ON follow_up_tasks(clinic_id, due_at) WHERE status = 'pending';
CREATE INDEX idx_tasks_lead ON follow_up_tasks(lead_id);
CREATE INDEX idx_tasks_assigned ON follow_up_tasks(assigned_to, status);

-- ============================================================================
-- LEAD EVENTS
-- ============================================================================
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_lead ON lead_events(lead_id, created_at DESC);
CREATE INDEX idx_events_clinic ON lead_events(clinic_id, created_at DESC);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','confirmed','rescheduled','attended','missed','cancelled')),
  booking_source TEXT,
  outcome TEXT,
  rescheduled_from UUID REFERENCES appointments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_clinic ON appointments(clinic_id, scheduled_at);
CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_status ON appointments(clinic_id, status);

-- ============================================================================
-- TREATMENT OPPORTUNITIES
-- ============================================================================
CREATE TABLE treatment_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  service_category TEXT,
  proposed_value NUMERIC(12,2) NOT NULL CHECK (proposed_value >= 0),
  accepted_value NUMERIC(12,2) CHECK (accepted_value >= 0),
  collected_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (collected_amount >= 0),
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','pending_decision','accepted','declined','partially_collected','collected')),
  proposed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ,
  loss_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_opportunities_clinic ON treatment_opportunities(clinic_id, status);
CREATE INDEX idx_opportunities_lead ON treatment_opportunities(lead_id);

-- ============================================================================
-- CAMPAIGNS
-- ============================================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  start_date DATE,
  end_date DATE,
  spend NUMERIC(12,2),
  spend_is_estimated BOOLEAN NOT NULL DEFAULT false,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_clinic ON campaigns(clinic_id);

-- ============================================================================
-- MESSAGE TEMPLATES
-- ============================================================================
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}',
  purpose TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_templates_clinic ON message_templates(clinic_id) WHERE active = true;

-- ============================================================================
-- INVITATIONS
-- ============================================================================
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'receptionist')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired','revoked')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitations_token ON invitations(token) WHERE status = 'pending';
CREATE INDEX idx_invitations_email ON invitations(email) WHERE status = 'pending';

-- ============================================================================
-- AUDIT EVENTS
-- ============================================================================
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_clinic ON audit_events(clinic_id, created_at DESC);

-- ============================================================================
-- DAILY MOTIVATIONS (message library)
-- ============================================================================
CREATE TABLE daily_motivations (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general'
);

-- ============================================================================
-- DAILY MOTIVATION RECORDS (per user per day)
-- ============================================================================
CREATE TABLE daily_motivation_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_date DATE NOT NULL,
  message_id INT NOT NULL REFERENCES daily_motivations(id),
  displayed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dismissed_at TIMESTAMPTZ,
  UNIQUE(user_id, local_date)
);

CREATE INDEX idx_motivation_records_user ON daily_motivation_records(user_id, local_date DESC);

-- ============================================================================
-- SUBSCRIPTION EVENTS
-- ============================================================================
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_event_id TEXT,
  event_type TEXT NOT NULL,
  plan_id TEXT,
  subscription_id TEXT,
  status TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_event_id)
);

CREATE INDEX idx_subscription_clinic ON subscription_events(clinic_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles: Users can read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY profiles_insert ON profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Clinics: Only accessible through membership
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY clinics_select ON clinics FOR SELECT
  USING (
    id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY clinics_insert ON clinics FOR INSERT
  WITH CHECK (true); -- Controlled by application logic during onboarding

CREATE POLICY clinics_update ON clinics FOR UPDATE
  USING (
    id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Clinic Memberships
ALTER TABLE clinic_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY memberships_select ON clinic_memberships FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships AS m
      WHERE m.user_id = auth.uid() AND m.status = 'active'
    )
    OR user_id = auth.uid()
  );

CREATE POLICY memberships_insert ON clinic_memberships FOR INSERT
  WITH CHECK (true); -- Controlled by application logic

CREATE POLICY memberships_update ON clinic_memberships FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships AS m
      WHERE m.user_id = auth.uid() AND m.status = 'active' AND m.role IN ('owner', 'admin')
    )
  );

-- Leads: Accessible by clinic members
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_select ON leads FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY leads_insert ON leads FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY leads_update ON leads FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY leads_delete ON leads FOR DELETE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Follow-up Tasks
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tasks_select ON follow_up_tasks FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY tasks_insert ON follow_up_tasks FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY tasks_update ON follow_up_tasks FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Lead Events
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_select ON lead_events FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY events_insert ON lead_events FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointments_select ON appointments FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY appointments_insert ON appointments FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY appointments_update ON appointments FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Treatment Opportunities
ALTER TABLE treatment_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY opportunities_select ON treatment_opportunities FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY opportunities_insert ON treatment_opportunities FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY opportunities_update ON treatment_opportunities FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaigns_select ON campaigns FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY campaigns_insert ON campaigns FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Message Templates
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY templates_select ON message_templates FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY templates_insert ON message_templates FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY templates_update ON message_templates FOR UPDATE
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY invitations_select ON invitations FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY invitations_insert ON invitations FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

-- Audit Events
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_select ON audit_events FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY audit_insert ON audit_events FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Daily Motivations (public read)
ALTER TABLE daily_motivations ENABLE ROW LEVEL SECURITY;

CREATE POLICY motivations_select ON daily_motivations FOR SELECT
  USING (true);

-- Daily Motivation Records
ALTER TABLE daily_motivation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY motivation_records_select ON daily_motivation_records FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY motivation_records_insert ON daily_motivation_records FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY motivation_records_update ON daily_motivation_records FOR UPDATE
  USING (user_id = auth.uid());

-- Subscription Events
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_select ON subscription_events FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role = 'owner'
    )
  );

-- ============================================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clinics_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_memberships_updated_at BEFORE UPDATE ON clinic_memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON follow_up_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_opportunities_updated_at BEFORE UPDATE ON treatment_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    'Asia/Kolkata'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
