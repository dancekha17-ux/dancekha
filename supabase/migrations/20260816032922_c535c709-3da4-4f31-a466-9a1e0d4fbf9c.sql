ALTER TABLE public.teacher_profiles
  ADD COLUMN brand_page_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN brand_agreement_signed_at timestamptz,
  ADD COLUMN brand_agreement_version text,
  ADD COLUMN brand_submitted_at timestamptz;

ALTER TABLE public.teacher_profiles
  ADD CONSTRAINT teacher_profiles_brand_page_status_check
  CHECK (brand_page_status IN ('draft','pending_review','published','needs_revision'));

UPDATE public.teacher_profiles
SET brand_page_status = 'published'
WHERE is_approved = true;

CREATE OR REPLACE FUNCTION public.protect_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
      NEW.is_approved := OLD.is_approved;
    END IF;

    IF NEW.brand_page_status IS DISTINCT FROM OLD.brand_page_status THEN
      IF NEW.brand_page_status = 'pending_review'
         AND OLD.brand_page_status IN ('draft','needs_revision') THEN
        NULL; -- allowed transition
      ELSE
        NEW.brand_page_status := OLD.brand_page_status;
      END IF;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;