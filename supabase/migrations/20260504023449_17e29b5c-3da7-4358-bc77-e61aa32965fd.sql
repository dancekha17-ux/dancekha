
-- 1. Extend teacher_profiles
ALTER TABLE public.teacher_profiles
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS tagline text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS culture_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS culture_body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS journey_timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS credentials text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS years_experience integer,
  ADD COLUMN IF NOT EXISTS next_session text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price_from text NOT NULL DEFAULT '';

-- 2. instructor_courses table
CREATE TABLE IF NOT EXISTS public.instructor_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  schedule text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  cover_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instructor_courses_teacher ON public.instructor_courses(teacher_id);

ALTER TABLE public.instructor_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view courses of approved teachers"
ON public.instructor_courses FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_courses.teacher_id AND tp.is_approved = true
));

CREATE POLICY "Teachers manage own courses"
ON public.instructor_courses FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_courses.teacher_id AND tp.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_courses.teacher_id AND tp.user_id = auth.uid()
));

CREATE POLICY "Admins manage all courses"
ON public.instructor_courses FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. instructor_media table
CREATE TABLE IF NOT EXISTS public.instructor_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES public.teacher_profiles(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'image', -- 'image' | 'video_embed'
  url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instructor_media_teacher ON public.instructor_media(teacher_id);

ALTER TABLE public.instructor_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media of approved teachers"
ON public.instructor_media FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_media.teacher_id AND tp.is_approved = true
));

CREATE POLICY "Teachers manage own media"
ON public.instructor_media FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_media.teacher_id AND tp.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.teacher_profiles tp
  WHERE tp.id = instructor_media.teacher_id AND tp.user_id = auth.uid()
));

CREATE POLICY "Admins manage all media"
ON public.instructor_media FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. updated_at trigger function (reuse generic)
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_instructor_courses_touch ON public.instructor_courses;
CREATE TRIGGER trg_instructor_courses_touch
BEFORE UPDATE ON public.instructor_courses
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. Storage bucket for instructor media
INSERT INTO storage.buckets (id, name, public)
VALUES ('instructor-media', 'instructor-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read instructor-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'instructor-media');

CREATE POLICY "Teachers upload to own folder (instructor-media)"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'instructor-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Teachers update own files (instructor-media)"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'instructor-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Teachers delete own files (instructor-media)"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'instructor-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
