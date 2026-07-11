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
  tagline: string;
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

function dbToPublic(row: any, master?: any): PublicInstructor {
  const profileImg = master?.profile_images?.[0];
  const videoLink = master?.video_links?.[0] || "";
  const embed = videoLink
    ? videoLink.includes("youtube.com/watch")
      ? videoLink.replace("watch?v=", "embed/")
      : videoLink.includes("youtu.be/")
        ? videoLink.replace("youtu.be/", "youtube.com/embed/")
        : videoLink
    : "";

  return {
    slug: row.slug || row.id,
    name: row.name || "未命名",
    nameEn: row.name_en || "",
    specialty: row.specialty || "",
    region: row.region || "",
    functionTags: master?.cultural_tags?.length ? master.cultural_tags : (row.dance_styles || []),
    cover: profileImg || row.hero_image_url || row.avatar_url || fallbackCover,
    avatar: master?.logo_url || row.avatar_url || "/placeholder.svg",
    bio: master?.bio || row.bio || "",
    rating: 5,
    students: 0,
    cultureTitle: master?.motto || row.culture_title || "",
    cultureBody: master?.dance_intro || row.culture_body || "",
    videoEmbedUrl: embed,
    credentials: row.credentials || [],
    priceFrom: row.price_from || "",
    nextSession: row.next_session || "",
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
        const dbItems = (data ?? []).map((r) => dbToPublic(r));
        setItems([...dbItems, ...staticInstructors.map(staticToPublic)]);
        setLoading(false);
      });
  }, []);

  return { items, loading };
}

export async function fetchInstructorBySlug(
  slug: string,
): Promise<(PublicInstructor & { isPreview?: boolean }) | undefined> {
  const { data: approved } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_approved", true)
    .maybeSingle();

  let row: any = approved;
  let isPreview = false;

  if (!row) {
    const { data: anyRow } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (anyRow) {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (uid) {
        if (uid === (anyRow as any).user_id) {
          row = anyRow;
          isPreview = true;
        } else {
          const { data: isAdmin } = await (supabase as any).rpc("has_role", {
            _user_id: uid,
            _role: "admin",
          });
          if (isAdmin) {
            row = anyRow;
            isPreview = true;
          }
        }
      }
    }
  }

  if (row) {
    const { data: master } = await (supabase as any)
      .from("master_profiles")
      .select("*")
      .eq("user_id", row.user_id)
      .maybeSingle();
    return { ...dbToPublic(row, master), isPreview };
  }

  const fromStatic = staticInstructors.find((i) => i.slug === slug);
  return fromStatic ? staticToPublic(fromStatic) : undefined;
}
