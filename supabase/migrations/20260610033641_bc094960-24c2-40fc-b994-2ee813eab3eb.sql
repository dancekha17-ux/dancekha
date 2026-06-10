
-- Events table (covers events 與 courses)
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'event' CHECK (kind IN ('event','course')),
  title text NOT NULL,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  is_online boolean NOT NULL DEFAULT false,
  fee text,
  total_spots integer,
  spots_left integer,
  tags text[] NOT NULL DEFAULT '{}',
  category text,
  instructor text,
  duration text,
  gradient text,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT
  USING (is_published = true OR auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Creator can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Registrations table
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.event_registrations TO anon, authenticated;
GRANT SELECT ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
  ON public.event_registrations FOR INSERT
  WITH CHECK (
    length(name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 4 AND 30
  );

CREATE POLICY "User sees own registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Seed a few demo rows so the homepage stays alive
INSERT INTO public.events (kind, title, description, starts_at, location, is_online, fee, total_spots, spots_left, tags, category, instructor, duration, gradient, is_featured)
VALUES
  ('event','2025 春季國際舞蹈工作坊','春日來臨，邀請世界各地引領者帶來深度文化交流。','2025-03-15 09:00+08','台北文創園區', false, 'NT$ 1,800', 50, 12, ARRAY['工作坊','精選'], '工作坊', '多位引領者', '9 小時', 'from-coral/30 to-sand/30', true),
  ('event','線上大師班：當代舞即興創作','線上 90 分鐘大師班，與資深引領者一同探索身體即興。','2025-02-28 19:30+08','Zoom 線上', true, 'NT$ 680', 100, 45, ARRAY['大師班','線上'], '大師班', '張美玲', '90 分鐘', 'from-soul/30 to-indigo-200', false),
  ('event','舞島咖春日派對','社群日常，一起跳舞、一起吃喝。','2025-04-05 14:00+08','舞島咖總部', false, '免費', 80, 28, ARRAY['社群日常'], '社群日常', '舞島咖團隊', '6 小時', 'from-forest/20 to-sand/30', false),
  ('course','零基礎｜身體開啟工作坊','適合所有想開啟身體的初學者。', NULL, '台北', false, 'NT$ 1,200 起', 30, 18, ARRAY['零基礎'], 'beginner', '林雅琪', '4 週', 'from-coral/40 to-sand/40', true),
  ('course','當代舞・呼吸與流動','以呼吸引導身體進入流動狀態。', NULL, '線上', true, 'NT$ 2,400', 40, 22, ARRAY['現代舞'], 'contemporary', '張美玲', '6 週', 'from-soul/40 to-indigo-200', false),
  ('course','巴爾幹圈舞入門','感受巴爾幹節奏與群體連結。', NULL, '台中', false, 'NT$ 1,800', 25, 9, ARRAY['巴爾幹與南歐'], 'balkans', 'Marko Petrov', '5 週', 'from-forest/30 to-sand/40', false);
