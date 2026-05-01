import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { instructors as staticInstructors, Instructor } from "@/data/instructors";

export interface PublicInstructor {
  slug: string;
  name: string;
  nameEn: string;
  specialty: string;
  region: string;
  functionTags: string[];
  cover: string;
  avatar: string;
  bio: string;
  rating: number;
  students: number;
  cultureTitle: string;
  cultureBody: string;
  videoEmbedUrl: string;
  credentials: string[];
  priceFrom: string;
  nextSession: string;
  courses: Instructor["courses"];
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
  source: "db" | "static";
}

const fallbackCover =
  "https://images.unsplash.com/photo-1535525153412-5a092d46b3a5?auto=format&fit=crop&w=2000&q=80";

function dbToPublic(row: any): PublicInstructor {
  return {
    slug: row.slug || row.id,
    name: row.name || "未命名",
    nameEn: row.name_en || "",
    specialty: row.specialty || "",
    region: row.region || "",
    functionTags: row.dance_styles || [],
    cover: row.avatar_url || fallbackCover,
    avatar: row.avatar_url || "/placeholder.svg",
    bio: row.bio || "",
    rating: 5,
    students: 0,
    cultureTitle: "",
    cultureBody: "",
    videoEmbedUrl: "",
    credentials: [],
    priceFrom: "",
    nextSession: "",
    courses: [],
    instagramUrl: row.instagram_url,
    youtubeUrl: row.youtube_url,
    websiteUrl: row.website_url,
    source: "db",
  };
}

function staticToPublic(i: Instructor): PublicInstructor {
  return { ...i, source: "static" };
}

export function usePublicInstructors() {
  const [items, setItems] = useState<PublicInstructor[]>(
    staticInstructors.map(staticToPublic),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("teacher_profiles")
      .select("*")
      .eq("is_approved", true)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        const dbItems = (data ?? []).map(dbToPublic);
        // DB profiles first, then curated static demos
        setItems([...dbItems, ...staticInstructors.map(staticToPublic)]);
        setLoading(false);
      });
  }, []);

  return { items, loading };
}

export async function fetchInstructorBySlug(slug: string): Promise<PublicInstructor | undefined> {
  const { data } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_approved", true)
    .maybeSingle();
  if (data) return dbToPublic(data);
  const fromStatic = staticInstructors.find((i) => i.slug === slug);
  return fromStatic ? staticToPublic(fromStatic) : undefined;
}
