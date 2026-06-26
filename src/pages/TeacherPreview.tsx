import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherPreview() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/teacher/login", { replace: true });
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("teacher_profiles")
        .select("slug")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.slug) {
        navigate(`/instructors/${data.slug}`, { replace: true });
      } else {
        navigate("/teacher/dashboard", { replace: true });
      }
    })();
  }, [authLoading, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">載入預覽中…</p>
    </div>
  );
}
