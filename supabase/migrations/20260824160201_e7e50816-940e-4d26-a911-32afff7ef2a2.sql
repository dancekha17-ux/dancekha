DROP POLICY IF EXISTS "Public can view approved profiles" ON public.teacher_profiles;
CREATE POLICY "Public can view published profiles"
ON public.teacher_profiles
FOR SELECT
USING (is_approved = true AND brand_page_status = 'published');