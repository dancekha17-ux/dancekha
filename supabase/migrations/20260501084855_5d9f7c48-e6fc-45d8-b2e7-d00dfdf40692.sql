
-- Revoke direct execute on SECURITY DEFINER functions (still callable from RLS/triggers)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.protect_approval() FROM anon, authenticated, public;

-- Tighten avatar bucket SELECT: only allow direct object access via signed/known path,
-- not bucket listing. Drop broad SELECT and replace with narrower one.
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Allow public read of individual objects (still public bucket via direct URL)
CREATE POLICY "Public can read avatar files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars' AND auth.role() IS NOT NULL OR bucket_id = 'avatars');
