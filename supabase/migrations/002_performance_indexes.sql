-- ============================================================================
-- MolarMetric Performance & Indexing Migration
-- Version: 002_performance_indexes (Idempotent / Safe for multiple runs)
-- ============================================================================

-- 1. Fast lookups for active receptionist completed tasks today
CREATE INDEX IF NOT EXISTS idx_tasks_clinic_completed 
ON follow_up_tasks(clinic_id, completed_at DESC) 
WHERE status = 'completed';

-- 2. Fast lookups for active pending tasks ordered by due date
CREATE INDEX IF NOT EXISTS idx_tasks_clinic_pending_due
ON follow_up_tasks(clinic_id, due_at ASC)
WHERE status = 'pending';

-- 3. Composite index for active (unarchived) leads sorted by creation
CREATE INDEX IF NOT EXISTS idx_leads_active_created 
ON leads(clinic_id, created_at DESC) 
WHERE archived = false;

-- 4. Composite index for active leads by stage for funnel aggregations
CREATE INDEX IF NOT EXISTS idx_leads_active_stage 
ON leads(clinic_id, stage) 
WHERE archived = false;

-- 5. Composite index for treatment opportunities with date filtering
CREATE INDEX IF NOT EXISTS idx_opps_clinic_created 
ON treatment_opportunities(clinic_id, created_at DESC);

-- 6. Composite index for appointments calendar and attendance analysis
CREATE INDEX IF NOT EXISTS idx_appts_clinic_status_scheduled 
ON appointments(clinic_id, status, scheduled_at ASC);

-- 7. Composite index for user membership resolution with active status filter
CREATE INDEX IF NOT EXISTS idx_memberships_user_active_created 
ON clinic_memberships(user_id, created_at DESC) 
WHERE status = 'active';
