ALTER TABLE public.instructor_courses
  ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'in_person',
  ADD COLUMN IF NOT EXISTS location_address text,
  ADD COLUMN IF NOT EXISTS online_link text,
  ADD COLUMN IF NOT EXISTS session_info text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'instructor_courses_service_type_check'
  ) THEN
    ALTER TABLE public.instructor_courses
      ADD CONSTRAINT instructor_courses_service_type_check
      CHECK (service_type IN ('in_person','pre_recorded','event_ticket','space_rental'));
  END IF;
END $$;