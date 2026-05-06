
CREATE TABLE public.master_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  profile_images TEXT[] NOT NULL DEFAULT '{}',
  studio_images TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  video_links TEXT[] NOT NULL DEFAULT '{}',
  dance_intro TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  motto TEXT NOT NULL DEFAULT '',
  cultural_tags TEXT[] NOT NULL DEFAULT '{}',
  dance_dna_type TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_draft BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.master_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published masters"
  ON public.master_profiles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Owners can view own master profile"
  ON public.master_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert own master profile"
  ON public.master_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own master profile"
  ON public.master_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage master profiles"
  ON public.master_profiles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Protect is_published from non-admins
CREATE OR REPLACE FUNCTION public.protect_master_publish()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_published IS DISTINCT FROM OLD.is_published
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_published := OLD.is_published;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER master_profiles_protect_publish
  BEFORE UPDATE ON public.master_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_master_publish();
