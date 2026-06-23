
ALTER TABLE public.instructor_courses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS revision_notes text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

ALTER TABLE public.instructor_courses
  DROP CONSTRAINT IF EXISTS instructor_courses_status_check;
ALTER TABLE public.instructor_courses
  ADD CONSTRAINT instructor_courses_status_check
  CHECK (status IN ('draft','pending','published'));

-- Backfill: previously published rows
UPDATE public.instructor_courses SET status = 'published' WHERE is_published = true AND status = 'draft';

-- Replace public read policy to require status='published'
DROP POLICY IF EXISTS "Public can view courses of approved teachers" ON public.instructor_courses;
CREATE POLICY "Public can view published courses of approved teachers"
  ON public.instructor_courses FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.teacher_profiles tp
      WHERE tp.id = instructor_courses.teacher_id AND tp.is_approved = true
    )
  );
