import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Share2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DNA_PROFILES, type DnaKey } from "@/lib/danceDna";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dnaKey: DnaKey;
  onRetake?: () => void;
}

export function DnaReportModal({ open, onOpenChange, dnaKey, onRetake }: Props) {
  const navigate = useNavigate();
  const profile = DNA_PROFILES[dnaKey];

  const goCourses = () => {
    onOpenChange(false);
    navigate(`/?dna=${dnaKey}#courses`);
  };

  const share = async () => {
    const text = `我的舞蹈 DNA：${profile.title}｜舞島咖 DanceKha`;
    const url = `${window.location.origin}/?dna=${dnaKey}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "我的舞蹈 DNA", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success("已複製你的 DNA 分析結果連結");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100%-1.5rem)] rounded-[1.75rem] p-0 overflow-hidden border-border/60 max-h-[88vh] overflow-y-auto">
        <DialogTitle className="sr-only">DNA 深度解析報告</DialogTitle>
        <DialogDescription className="sr-only">
          依據你的四題測驗回答，產出情緒、社交、空間與肢體渴望的深度剖析
        </DialogDescription>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(32_70%_94%)] via-[hsl(20_65%_90%)] to-[hsl(350_45%_86%)] px-6 py-8 md:px-10 md:py-10">
          <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-[hsl(15_70%_75%)]/40 blur-3xl pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/40 backdrop-blur-md border border-background/40 text-xs text-foreground/80">
              <Sparkles className="w-3.5 h-3.5" />
              DNA 深度解析報告
            </span>
            <h2 className="font-display italic text-3xl md:text-4xl text-foreground mt-4 leading-tight">
              {profile.title}
            </h2>
            <p className="font-display italic text-sm text-foreground/60 mt-1">{profile.personaLine}</p>
            <p className="text-sm text-foreground/75 mt-3 leading-relaxed max-w-lg">
              {profile.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="px-6 py-7 md:px-10 md:py-9 space-y-8">
          {/* Diagnosis */}
          <section>
            <span className="eyebrow">Diagnosis · 潛意識深度診斷</span>
            <div className="mt-4 space-y-3">
              {profile.diagnosis.map((d, i) => (
                <motion.div
                  key={d.dimension}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.06 * i }}
                  className="rounded-2xl border border-border/60 bg-secondary/30 px-5 py-4"
                >
                  <p className="font-display text-sm text-foreground mb-1.5">{d.dimension}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{d.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Traits recap */}
          <section className="grid grid-cols-3 gap-3">
            {profile.traits.map((t) => (
              <div key={t.label} className="rounded-2xl border border-border/60 px-4 py-3 text-center">
                <p className="font-display text-2xl text-foreground">{t.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.label}</p>
              </div>
            ))}
          </section>

          {/* Prescription */}
          <section>
            <span className="eyebrow">Prescription · 專屬身體處方籤</span>
            <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4">
              <p className="text-sm text-foreground leading-relaxed">{profile.prescription}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <div>
            <Button size="lg" className="w-full group" onClick={goCourses}>
              👉 預約適合我的體驗課程
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onRetake?.();
                }}
              >
                <RotateCcw className="w-4 h-4" />
                🔄 重新檢測
              </Button>
              <Button variant="outline" className="flex-1" onClick={share}>
                <Share2 className="w-4 h-4" />
                🔗 分享我的 DNA 分析結果
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
