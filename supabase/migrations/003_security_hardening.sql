-- ============================================================================
-- MolarMetric — Security Hardening Migration
-- Version: 003_security_hardening (Idempotent / Safe for multiple runs)
-- ============================================================================

-- 1. Ensure profiles has terms acceptance audit columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '1.0';

-- 2. Make audit_events strictly append-only (immutable at the database engine level)
CREATE OR REPLACE FUNCTION prevent_audit_events_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is an immutable, append-only security log. UPDATE and DELETE operations are strictly prohibited.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_audit_events_update ON public.audit_events;
CREATE TRIGGER trg_prevent_audit_events_update
  BEFORE UPDATE OR DELETE ON public.audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_events_mutation();

-- 3. Prevent tenant-hopping (disallow updating clinic_id on tenant records)
CREATE OR REPLACE FUNCTION prevent_clinic_id_mutation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.clinic_id IS DISTINCT FROM NEW.clinic_id THEN
    RAISE EXCEPTION 'Mutating clinic_id is strictly forbidden to preserve tenant data isolation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_prevent_clinic_change ON public.leads;
CREATE TRIGGER trg_leads_prevent_clinic_change
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION prevent_clinic_id_mutation();

DROP TRIGGER IF EXISTS trg_appointments_prevent_clinic_change ON public.appointments;
CREATE TRIGGER trg_appointments_prevent_clinic_change
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION prevent_clinic_id_mutation();

DROP TRIGGER IF EXISTS trg_opportunities_prevent_clinic_change ON public.treatment_opportunities;
CREATE TRIGGER trg_opportunities_prevent_clinic_change
  BEFORE UPDATE ON public.treatment_opportunities
  FOR EACH ROW EXECUTE FUNCTION prevent_clinic_id_mutation();

-- 4. Enable FORCE ROW LEVEL SECURITY on all tenant-owned tables
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE public.appointments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_opportunities FORCE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns FORCE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates FORCE ROW LEVEL SECURITY;
ALTER TABLE public.invitations FORCE ROW LEVEL SECURITY;
