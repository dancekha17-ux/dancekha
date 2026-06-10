ALTER TABLE public.events ADD COLUMN IF NOT EXISTS region text;
CREATE INDEX IF NOT EXISTS events_region_idx ON public.events(region);