-- Fix: Grant permissions and create RLS policies for Phase 3 tables
-- The original phase3_roles_progress.sql created tables with RLS enabled,
-- but the policies were not actually applied. This script fixes that.

-- Grant table-level permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE ON project_share_codes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON student_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON student_enrollments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON student_progress TO anon, authenticated;
GRANT SELECT, INSERT ON student_field_notes TO anon, authenticated;
GRANT SELECT, INSERT ON student_quiz_results TO anon, authenticated;

-- SELECT policies (public read)
CREATE POLICY "select_share_codes" ON project_share_codes FOR SELECT USING (true);
CREATE POLICY "select_student_sessions" ON student_sessions FOR SELECT USING (true);
CREATE POLICY "select_student_enrollments" ON student_enrollments FOR SELECT USING (true);
CREATE POLICY "select_student_progress" ON student_progress FOR SELECT USING (true);
CREATE POLICY "select_student_field_notes" ON student_field_notes FOR SELECT USING (true);
CREATE POLICY "select_student_quiz_results" ON student_quiz_results FOR SELECT USING (true);

-- INSERT policies (public insert)
CREATE POLICY "insert_share_codes" ON project_share_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_student_sessions" ON student_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_student_enrollments" ON student_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_student_progress" ON student_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_student_field_notes" ON student_field_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_student_quiz_results" ON student_quiz_results FOR INSERT WITH CHECK (true);

-- UPDATE policies (for tables that need updates)
CREATE POLICY "update_student_sessions" ON student_sessions FOR UPDATE USING (true);
CREATE POLICY "update_student_progress" ON student_progress FOR UPDATE USING (true);
CREATE POLICY "update_share_codes" ON project_share_codes FOR UPDATE USING (true);
