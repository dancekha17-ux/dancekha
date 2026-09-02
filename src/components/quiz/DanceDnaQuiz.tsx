import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Share2, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type DnaKey = "ritual" | "ocean" | "stage" | "flow";

const QUESTIONS: {
  title: string;
  eyebrow: string;
  options: { label: string; key: DnaKey }[];
}[] = [
  {
    eyebrow: "》》》》",
    title: "結束疲憊的一天，你直覺最想怎麼紓壓？",
    options: [
      { label: "聽大聲音樂、大步走路，把情緒甩出去", key: "stage" },
      { label: "安靜發呆、伸展身體，讓自己慢下來", key: "ritual" },
      { label: "約朋友熱鬧聊天，笑一笑就好了", key: "ocean" },
      { label: "幻想飛去異國，隨意探索陌生街角", key: "flow" },
    ],
  },
  {
    eyebrow: "》》》",
    title: "在不熟悉的聚會，你習慣待在哪個位置？",
    options: [
      { label: "站在邊緣觀察，隨時可以融入大圈圈", key: "ocean" },
      { label: "喜歡找一個人一對一深度聊天", key: "flow" },
      { label: "享受站在專屬舞台上的焦點時刻", key: "stage" },
      { label: "喜歡安靜、流暢、不用多說話的互動", key: "ritual" },
    ],
  },
  {
    eyebrow: "身體與空間感知",
    title: "哪一種場景最能帶給你平靜？",
    options: [
      { label: "古老山林與寺廟，帶著儀式感的靜謐", key: "ritual" },
      { label: "陽光海邊與手鼓，赤腳踩在沙上", key: "ocean" },
      { label: "復古老街與爵士樂，微醺的燈光", key: "flow" },
      { label: "霓虹都市與重低音，心跳跟著節拍", key: "stage" },
    ],
  },
  {
    eyebrow: "肢體渴望與機能",
    title: "若能擁有一個身體超能力，你最想要什麼？",
    options: [
      { label: "像橡皮筋般柔軟，舒緩久坐痠痛", key: "ritual" },
      { label: "像羽毛般輕盈，不費力地律動一整晚", key: "ocean" },
      { label: "充滿爆發力與核心氣場，站上台不怯場", key: "stage" },
      { label: "像水一樣流暢，用身體說出內心情緒", key: "flow" },
    ],
  },
];

const RESULTS: Record<
  DnaKey,
  {
    title: string;
    subtitle: string;
    prescription: string;
    genres: string[];
    category: string;
  }
> = {
  ritual: {
    title: "山林儀式舞者",
    subtitle: "你的身體渴望安靜、緩慢、有呼吸節奏的儀式感。",
    prescription:
      "巴爾幹圓圈舞——手牽著手、腳踩著大地的重複節奏，能安撫過度運轉的神經，同時鬆開久坐的肩頸與髖關節。",
    genres: ["巴爾幹圓圈舞 Horo", "印度 Odissi 奧迪西舞", "身體開發／律動基礎"],
    category: "balkans",
  },
  ocean: {
    title: "海洋輕盈舞者",
    subtitle: "你需要的是陽光、笑聲，和一群人一起輕鬆擺動的自在。",
    prescription:
      "夏威夷 Hula 與手鼓律動——柔軟的腰臀波浪與呼吸同步，零基礎、免舞伴，跳完整個人像被海風吹過。",
    genres: ["夏威夷 Hula 呼拉舞", "希臘／以色列民俗舞", "零基礎律動入門"],
    category: "beginner",
  },
  stage: {
    title: "烈焰氣場舞者",
    subtitle: "你的身體在等一個舞台，把壓抑的能量全部燒出來。",
    prescription:
      "佛朗明哥與拉丁節奏——強烈的踏步、核心與眼神訓練，一堂課就能把情緒轉成氣場與核心力量。",
    genres: ["西班牙佛朗明哥", "Salsa 莎莎舞", "K-POP／街舞"],
    category: "latin",
  },
  flow: {
    title: "流動敘事舞者",
    subtitle: "你想用身體說話，把說不出口的情緒交給動作。",
    prescription:
      "現代舞與中東 Raqs Sharqi——連續、綿延的軀幹流動，讓情緒有出口，也讓身體重新找回柔軟。",
    genres: ["現代舞 Contemporary", "中東 Raqs Sharqi", "Swing 搖擺舞"],
    category: "contemporary",
  },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DanceDnaQuiz({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DnaKey[]>([]);

  const total = QUESTIONS.length;
  const done = step >= total;

  const resultKey: DnaKey = (() => {
    const tally = answers.reduce<Record<string, number>>((acc, k) => {
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    let best: DnaKey = answers[0] ?? "ocean";
    let bestCount = 0;
    for (const k of answers) {
      if (tally[k] > bestCount) {
        best = k;
        bestCount = tally[k];
      }
    }
    return best;
  })();

  const result = RESULTS[resultKey];

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const pick = (key: DnaKey) => {
    setAnswers((prev) => [...prev.slice(0, step), key]);
    setStep((s) => s + 1);
  };

  const goCourses = () => {
    onOpenChange(false);
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("danceka:filter-category", { detail: result.category })
      );
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const share = async () => {
    const text = `我的舞蹈 DNA：${result.title}｜舞島咖 DanceKha`;
    const url = `${window.location.origin}/?dna=${resultKey}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "我的舞蹈 DNA", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast.success("已複製你的檢測結果連結，邀請好友一起玩！");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 250);
      }}
    >
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] rounded-3xl bg-card p-0 overflow-hidden border-border/60 max-h-[88vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <DialogTitle className="sr-only">舞蹈 DNA 測驗</DialogTitle>
          <DialogDescription className="sr-only">
            透過四個生活情境問題，找到最適合你的舞蹈處方
          </DialogDescription>

          {!done && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[10px] uppercase font-body text-muted-foreground"
                  style={{ letterSpacing: "0.24em" }}
                >
                  Step {step + 1} of {total}
                </span>
                <span className="text-[11px] font-body text-muted-foreground">
                  {QUESTIONS[step].eyebrow}
                </span>
              </div>
              <Progress value={((step + 1) / total) * 100} className="h-1.5" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h2 className="font-display text-xl sm:text-2xl leading-snug text-foreground mb-6">
                  {QUESTIONS[step].title}
                </h2>
                <div className="space-y-2.5">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => pick(opt.key)}
                      className="w-full text-left rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5 font-body text-sm text-foreground transition-all hover:border-primary/60 hover:bg-primary/5 hover:translate-x-0.5"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← 上一題
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p
                  className="text-[10px] uppercase font-body text-muted-foreground mb-2"
                  style={{ letterSpacing: "0.24em" }}
                >
                  Your Dance DNA
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3">
                  【{result.title}】
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                  {result.subtitle}
                </p>

                <div className="rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4 text-left mb-4">
                  <p className="text-[11px] font-body text-primary mb-1.5">你的潛意識身體處方</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {result.prescription}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 px-5 py-4 text-left mb-7">
                  <p className="text-[11px] font-body text-muted-foreground mb-2.5">推薦舞種</p>
                  <div className="flex flex-wrap gap-2">
                    {result.genres.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-secondary px-3 py-1.5 font-body text-xs text-secondary-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="w-full group" onClick={goCourses}>
                  👉 探索課程  立即GO
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1" onClick={share}>
                    <Share2 className="w-4 h-4" />
                    🔗 邀請好友一起解鎖舞蹈DNA 
                  </Button>
                  <Button variant="ghost" className="flex-1" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                    重新檢測
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
