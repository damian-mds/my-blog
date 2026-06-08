-- ───────────────────────────────────────────────────────────────────────
-- update_policies.sql
-- Run this in your Supabase SQL Editor to allow anonymous inserts.
--
-- The original import_sprints.sql created RLS policies that required
-- auth.uid() IS NOT NULL for inserts, but the anonymous key doesn't
-- provide a user ID — so all inserts were silently denied.
--
-- This file drops those restrictive policies and replaces them with
-- permissive ones that allow anyone to insert (public blog use case).
-- ───────────────────────────────────────────────────────────────────────

-- Drop the old auth-restricted insert/update/delete policies
DROP POLICY IF EXISTS "sprints_insert_auth"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_insert_auth" ON public.sprint_tags;
DROP POLICY IF EXISTS "sprints_update_auth"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_update_auth" ON public.sprint_tags;
DROP POLICY IF EXISTS "sprints_delete_auth"  ON public.sprints;
DROP POLICY IF EXISTS "sprint_tags_delete_auth" ON public.sprint_tags;

-- Allow inserts from anyone
CREATE POLICY "sprints_insert_any"
    ON public.sprints  FOR INSERT WITH CHECK (true);

CREATE POLICY "sprint_tags_insert_any"
    ON public.sprint_tags FOR INSERT WITH CHECK (true);

-- Allow updates from anyone (matching create)
CREATE POLICY "sprints_update_any"
    ON public.sprints  FOR UPDATE USING (true);

CREATE POLICY "sprint_tags_update_any"
    ON public.sprint_tags FOR UPDATE USING (true);

-- Allow deletes from anyone (matching create)
CREATE POLICY "sprints_delete_any"
    ON public.sprints  FOR DELETE USING (true);

CREATE POLICY "sprint_tags_delete_any"
    ON public.sprint_tags FOR DELETE USING (true);
