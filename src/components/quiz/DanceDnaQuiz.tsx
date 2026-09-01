import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Share2, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type DnaKey = "posture" | "burn" | "partner" | "group" | "culture";

const QUESTIONS: {
  title: string;
  eyebrow: string;
  options: { label: string; key: DnaKey }[];
}[] = [
  {
    eyebrow: "機能與生活痛點",
    title: "你今天下班／放假後，最希望透過肢體活動獲得什麼？",
    options: [
      { label: "舒緩久坐肩頸僵硬，改善體態與姿勢", key: "posture" },
      { label: "大汗淋漓甩掉壓力，爽快宣洩情緒", key: "burn" },
      { label: "認識新朋友，體驗有互動感的雙人律動", key: "partner" },
      { label: "享受一群人牽手、無壓力的歡樂氛圍", key: "group" },
      { label: "暫時脫離日常，沉浸在異國美學與故事中", key: "culture" },
    ],
  },
  {
    eyebrow: "門檻與心理",
    title: "你對「開始學舞蹈」最大的顧慮或期待是什麼？",
    options: [
      { label: "我肢體很僵硬，希望從基礎發力與呼吸開始", key: "posture" },
      { label: "我希望看到明顯的運動消耗，節奏感要強", key: "burn" },
      { label: "我是一個人來，不想有孤單感，但也不想自己找舞伴", key: "partner" },
      { label: "我怕跟不上大家，希望就算踩錯腳也不會尷尬", key: "group" },
    ],
  },
  {
    eyebrow: "氛圍偏好",
    title: "你最喜歡哪一種音樂與風格？",
    options: [
      { label: "優雅流暢的古典樂、手鼓聲或深層放鬆的音樂", key: "culture" },
      { label: "重低音節奏強烈的 K-POP、Hip-Hop 或熱情鼓點", key: "burn" },
      { label: "充滿爵士風情、復古爵士樂或拉丁節奏", key: "partner" },
      { label: "熱鬧的民族手風琴、笛聲、圍著營火般的歡樂節奏", key: "group" },
    ],
  },
];

const RESULTS: Record<
  DnaKey,
  { title: string; subtitle: string; benefit: string; genres: string[] }
> = {
  posture: {
    title: "溫柔覺察型｜體態修復舞者",
    subtitle: "你的身體正在請你慢下來，用呼吸重新找回線條。",
    benefit: "慢速拆解、零衝擊、久坐族友善，一堂課就能感受肩頸鬆開的舒服。",
    genres: ["夏威夷 Hula 呼拉舞", "印度 Odissi 奧迪西舞", "身體開發／律動基礎"],
  },
  burn: {
    title: "熱力全開型｜高燃脂紓壓舞者",
    subtitle: "你需要的是把情緒交給節拍，跳到大汗淋漓的痛快。",
    benefit: "節奏強、消耗高，不用記複雜舞步也能盡情釋放壓力。",
    genres: ["K-POP 舞蹈", "Hip-Hop 街舞", "非洲鼓舞 Afro Dance"],
  },
  partner: {
    title: "默契流動型｜社交對舞者",
    subtitle: "你享受與人共舞時，那份即時回應的默契與火花。",
    benefit: "課堂輪換舞伴、免自備搭檔，邊跳邊自然認識新朋友。",
    genres: ["Salsa 莎莎舞", "Bachata 巴恰塔", "Swing 搖擺舞"],
  },
  group: {
    title: "熱情陽光型｜歡樂社群舞者",
    subtitle: "你喜歡牽起手、跟著一群人一起笑著跳完一首歌。",
    benefit: "免自備舞伴、零基礎友善、隨到隨跳零負擔！",
    genres: ["保加利亞 Horo 鏈狀舞", "希臘民俗舞", "以色列舞"],
  },
  culture: {
    title: "沉浸儀式型｜文化故事舞者",
    subtitle: "你跳的不只是舞步，更是一段來自遠方的生命故事。",
    benefit: "每堂課都像一次小旅行，從服裝、音樂到手勢都有文化脈絡。",
    genres: ["印度 Odissi 奧迪西舞", "西班牙佛朗明哥", "中東 Raqs Sharqi"],
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
    let best: DnaKey = answers[0] ?? "group";
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
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const share = async () => {
    const text = `我的舞蹈 DNA：${result.title}｜舞島咖 DanceKha`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "我的舞蹈 DNA", text, url: window.location.origin });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
        toast.success("已複製你的舞蹈 DNA，快分享給朋友！");
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
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] rounded-3xl bg-card p-0 overflow-hidden border-border/60">
        <div className="p-6 sm:p-8">
          <DialogTitle className="sr-only">舞蹈 DNA 測驗</DialogTitle>
          <DialogDescription className="sr-only">
            透過三個問題，找到最適合你的舞蹈風格
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
                  <p className="text-[11px] font-body text-primary mb-1.5">為什麼適合你</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {result.benefit}
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
                  👉 查看適合我的體驗課程
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button variant="ghost" className="flex-1" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                    重新檢測
                  </Button>
                  <Button variant="ghost" className="flex-1" onClick={share}>
                    <Share2 className="w-4 h-4" />
                    分享我的結果
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
