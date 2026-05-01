
-- Roles enum + table (separate, security-definer pattern)
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Teacher profiles
CREATE TABLE public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  specialty TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  dance_styles TEXT[] NOT NULL DEFAULT '{}',
  instagram_url TEXT,
  youtube_url TEXT,
  website_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view approved profiles
CREATE POLICY "Public can view approved profiles"
  ON public.teacher_profiles FOR SELECT TO anon, authenticated
  USING (is_approved = true);

-- Teachers can view own profile (even if not approved)
CREATE POLICY "Teachers can view their own profile"
  ON public.teacher_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all profiles"
  ON public.teacher_profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Teachers can update their own profile (cannot self-approve — handled by trigger)
CREATE POLICY "Teachers can update own profile"
  ON public.teacher_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any
CREATE POLICY "Admins can update any profile"
  ON public.teacher_profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Block teachers from changing is_approved
CREATE OR REPLACE FUNCTION public.protect_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_approved := OLD.is_approved;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_approval
BEFORE UPDATE ON public.teacher_profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_approval();

-- Auto-create profile + assign teacher role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.teacher_profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'teacher');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Avatar storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
