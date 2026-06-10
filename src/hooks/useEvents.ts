import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EventRow {
  id: string;
  kind: "event" | "course";
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  is_online: boolean;
  fee: string | null;
  total_spots: number | null;
  spots_left: number | null;
  tags: string[];
  category: string | null;
  instructor: string | null;
  duration: string | null;
  gradient: string | null;
  image_url: string | null;
  is_featured: boolean;
}

export function useEvents(kind: "event" | "course") {
  const [data, setData] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("kind", kind)
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("starts_at", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error && data) setData(data as EventRow[]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [kind]);

  return { data, loading };
}
