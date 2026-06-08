-- ───────────────────────────────────────────────────────────────────────
-- update_policies.sql
-- Apply auth-gated RLS policies for the sprints tables.
-- Drop the old "any" (open) policies and replace with auth checks.
-- Seed scripts run as the DB owner and bypass RLS, so re-running this file
-- via the SQL Editor will still work for the INSERT data rows.
-- ───────────────────────────────────────────────────────────────────────

-- Drop the old open ("any") policies
DROP POLICY IF EXISTS "sprints_insert_any"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_insert_any" ON public.sprint_tags;
DROP POLICY IF EXISTS "sprints_update_any"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_update_any" ON public.sprint_tags;
DROP POLICY IF EXISTS "sprints_delete_any"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_delete_any" ON public.sprint_tags;

-- Auth-gated policies — only signed-in users can write

CREATE POLICY "sprints_insert_auth"
    ON public.sprints  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "sprint_tags_insert_auth"
    ON public.sprint_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "sprints_update_auth"
    ON public.sprints  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "sprint_tags_update_auth"
    ON public.sprint_tags FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "sprints_delete_auth"
    ON public.sprints  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "sprint_tags_delete_auth"
    ON public.sprint_tags FOR DELETE USING (auth.uid() IS NOT NULL);
