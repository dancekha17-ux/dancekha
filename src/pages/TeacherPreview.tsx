import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Instagram, Youtube, Globe2, MapPin, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  name_en: string;
  slug: string | null;
  specialty: string;
  region: string;
  bio: string;
  avatar_url: string | null;
  dance_styles: string[];
  credentials: string[];
  instagram_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  is_approved: boolean;
}

interface MediaItem {
  id: string;
  url: string;
  caption: string;
  scale: number;
  offset_x: number;
  offset_y: number;
}

export default function TeacherPreview() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return;
      setProfile(data as Profile);
      const { data: mediaData } = await (supabase as any)
        .from("instructor_media")
        .select("id,url,caption,scale,offset_x,offset_y,sort_order")
        .eq("teacher_id", (data as any).id)
        .order("sort_order", { ascending: true });
      setMedia((mediaData as MediaItem[]) ?? []);
    })();
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">載入中…</p>
      </div>
    );
  }

  const credentials = (profile.credentials ?? []).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide mx-auto py-10">
        <div className="flex items-center justify-between mb-10">
          <Button asChild variant="ghost" size="sm">
            <Link to="/teacher/dashboard"><ArrowLeft className="w-4 h-4" /> 返回編輯</Link>
          </Button>
          <span className="eyebrow">Preview</span>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Avatar + identity */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-background shadow-elevated bg-secondary shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-display text-muted-foreground">
                  {profile.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-1">
                {profile.name || "未命名"}
              </h1>
              {profile.name_en && (
                <p className="text-muted-foreground font-body">
                  {profile.name_en}
                  {profile.specialty && <> · {profile.specialty}</>}
                </p>
              )}
              {profile.region && (
                <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-soul/10 text-soul text-xs">
                  <MapPin className="w-3 h-3" /> {profile.region}
                </span>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-lg leading-loose text-foreground/85 font-body mb-12 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {profile.dance_styles.length > 0 && (
            <div className="mb-12">
              <span className="eyebrow">Dance Styles</span>
              <div className="hairline mt-3 mb-5 mx-0" />
              <div className="flex flex-wrap gap-2">
                {profile.dance_styles.map((s) => (
                  <span key={s} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Awards */}
          {credentials.length > 0 && (
            <div className="mb-12">
              <span className="eyebrow">Experience & Awards</span>
              <div className="hairline mt-3 mb-5 mx-0" />
              <ul className="space-y-3">
                {credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/85 leading-relaxed">
                    <Award className="w-4 h-4 mt-1 text-soul shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Moments */}
          {media.length > 0 && (
            <div className="mb-12">
              <span className="eyebrow">Moments</span>
              <div className="hairline mt-3 mb-5 mx-0" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {media.map((m) => (
                  <figure
                    key={m.id}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary shadow-soft"
                  >
                    <img
                      src={m.url}
                      alt={m.caption || ""}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: `translate(${m.offset_x}px, ${m.offset_y}px) scale(${m.scale || 1})`,
                        transformOrigin: "center",
                      }}
                    />
                    {m.caption && (
                      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs px-4 py-3">
                        {m.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {(profile.instagram_url || profile.youtube_url || profile.website_url) && (
            <div className="flex gap-3 pt-6 border-t border-border/50">
              {profile.instagram_url && (
                <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                   className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.youtube_url && (
                <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer"
                   className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                   className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition">
                  <Globe2 className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {!profile.is_approved && (
            <p className="text-xs text-muted-foreground mt-12 text-center">
              這是僅你可見的預覽 · 公開頁面將於審核後上線
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

