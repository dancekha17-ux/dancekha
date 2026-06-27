import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe2,
  Settings2,
  Coins,
  Sprout,
  UserPlus,
  ClipboardEdit,
  ShieldCheck,
  Rocket,
  ChevronDown,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const PALETTE = {
  bg: "#FAF9F6",
  bgAlt: "#F3EDE5",
  ink: "#3D2B1F",
  inkSoft: "#6B5B4F",
  inkMuted: "#7A6B5F",
  accent: "#B8906A",
  accentSoft: "#A0826D",
  cta: "#D2B48C",
  border: "#E8E0D5",
  surface: "#FFFFFF",
};

const valueCards = [
  {
    icon: Globe2,
    emoji: "🌍",
    title: "擴大您的舞蹈品牌影響力",
    description:
      "除了您原有的網站與社群，舞島咖提供一個卓越的舞蹈推廣平台。無論您是個人教師、舞蹈工作室或專業舞團，都能在此建立專屬展示頁，讓更多人看見您的文化故事與精彩作品，創造無限的曝光與合作機會。",
  },
  {
    icon: Settings2,
    emoji: "⚙️",
    title: "釋放經營瑣碎，專注於您的舞蹈藝術",
    description:
      "您可隨時登入管理後台維護品牌頁面與規劃課程，打造高度自主的數位空間。平台整合了報名與金流等營運後勤，透過智慧化工具為您化繁為簡，讓您將更多時間留給學員、創作與文化傳承，享受高效且從容的數位經營體驗。",
  },
  {
    icon: Coins,
    emoji: "💰",
    title: "合理收益分潤，讓專業獲得應有回報",
    description:
      "我們珍惜每一位引導者的心血，課程與服務收益最高享有 90% 分潤。我們深信，只有當創造者無後顧之憂，舞蹈藝術才能在純粹且支持性的環境中持續綻放，讓每一份專業投入，都能獲得最直接、實質的回報。",
  },
  {
    icon: Sprout,
    emoji: "🌱",
    title: "共聚舞島，編織文化的連結網絡",
    description:
      "舞島咖相信，真正有力量的文化，來自一群願意分享、共同前行的人。我們期待與每位引導者攜手，透過跨域合作與技術交流，共創舞蹈文化聚落！我們將致力於打破地理限制，讓世界看見台灣，與世界同步共振。",
  },
];

const cases = [
  {
    name: "Elena",
    role: "佛朗明哥 引導者 · 西班牙",
    quote:
      "在舞島咖，我不只是教舞，而是把家鄉的節奏與故事帶給每位學員。後台的整合讓我能把時間真正留給創作。",
  },
  {
    name: "俊宇",
    role: "現代舞 引導者 · 台北",
    quote:
      "從報名到金流都不再瑣碎，我能更專注於課程設計。世界地圖讓更多探索者第一次認識我的舞團。",
  },
  {
    name: "Mira",
    role: "希臘圈舞 引導者 · 高雄",
    quote:
      "這裡像一個溫暖的聚落，引導者之間會互相照應、彼此推薦。我感受到的是夥伴，不是平台。",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "建立帳號",
    description: "用 Email 完成註冊，立即進入引導者後台。",
  },
  {
    icon: ClipboardEdit,
    title: "完善您的品牌頁",
    description: "上傳介紹、經歷、課堂瞬間，打造一張屬於您的數位名片。",
  },
  {
    icon: ShieldCheck,
    title: "提交審核",
    description: "舞島咖團隊將於 2 個工作天內完成內容確認與上線協助。",
  },
  {
    icon: Rocket,
    title: "公開上線・開課",
    description: "出現在師資團隊與世界舞蹈地圖，開始迎接您的探索者。",
  },
];

const faqs = [
  {
    q: "加入舞島咖需要費用嗎？",
    a: "建立引導者頁面完全免費。我們只在您透過平台開課與成交時，依分潤比例收取服務費，讓您零風險開始。",
  },
  {
    q: "我可以同時保留自己的教學品牌與社群嗎？",
    a: "當然可以。舞島咖是您現有品牌的延伸與擴大，協助您觸及更多文化探索者，而不取代您原有的經營模式。",
  },
  {
    q: "分潤的計算方式為何？",
    a: "依課程類型不同，引導者最高可享 90% 收益分潤。詳細條款會在簽署「引導者聚落合作協議」前完整呈現。",
  },
  {
    q: "需要多久才能完成審核並上線？",
    a: "完成基本資料填寫後送出審核，舞島咖團隊預計於 2 個工作天內完成內容確認並協助您公開頁面。",
  },
  {
    q: "我不是專職老師，是否也能加入？",
    a: "歡迎。只要您願意分享文化舞步與故事，無論是工作室、舞團或文化推廣者，都能在這座島嶼上找到位置。",
  },
];

export default function TeacherRecruit() {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const casesRef = useRef(null);
  const stepsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });
  const casesInView = useInView(casesRef, { once: true, margin: "-80px" });
  const stepsInView = useInView(stepsRef, { once: true, margin: "-80px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: PALETTE.bg }}>
      <Header />

      <main>
        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            backgroundColor: PALETTE.bg,
            minHeight: "92vh",
            paddingTop: "clamp(6rem, 14vh, 10rem)",
            paddingBottom: "clamp(4rem, 10vh, 8rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
              style={{
                width: "600px",
                height: "400px",
                background: `radial-gradient(ellipse at center, ${PALETTE.cta}40 0%, transparent 70%)`,
              }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="eyebrow inline-block mb-6"
              style={{ color: PALETTE.accentSoft, letterSpacing: "0.28em" }}
            >
              JOIN US · 加入舞島咖｜引導者聚落 Guides' Lounge
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="font-display font-medium mb-8"
              style={{
                fontSize: "clamp(1.875rem, 2.8vw + 1rem, 3.5rem)",
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                color: PALETTE.ink,
              }}
            >
              成為舞島咖的引導者，
              <br />
              <span className="italic font-normal" style={{ color: PALETTE.accent }}>
                讓世界看見你的文化舞步
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mx-auto mb-8"
              style={{ height: "1px", width: "64px", backgroundColor: PALETTE.cta }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-body mx-auto mb-12 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 0.6vw + 0.875rem, 1.2rem)",
                lineHeight: 1.7,
                color: PALETTE.inkSoft,
              }}
            >
              我們像落在這座島嶼上的沙，不需要很大，但聚在一起，就能隨著音樂掀起最美麗的浪花。加入引導者聚落，開啟您的舞蹈事業。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-10 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: PALETTE.cta, color: "#FFFFFF" }}
              >
                <Link to="/teacher/login">
                  立即申請成為引導者
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <a
                href="#why-join"
                className="rounded-full px-6 py-3 text-sm font-medium transition-colors"
                style={{ color: PALETTE.accent }}
              >
                先了解優勢 ↓
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── Why Join · Value Cards ── */}
        <section
          id="why-join"
          ref={cardsRef}
          style={{
            backgroundColor: PALETTE.bg,
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span
                className="eyebrow inline-block mb-4"
                style={{ color: PALETTE.accentSoft, letterSpacing: "0.22em" }}
              >
                Why Join · 為什麼加入舞島咖
              </span>
              <div
                className="mx-auto mb-6"
                style={{ height: "1px", width: "48px", backgroundColor: PALETTE.cta }}
              />
              <h2
                className="font-display font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                  lineHeight: 1.28,
                  color: PALETTE.ink,
                }}
              >
                成為引導者的
                <span className="italic" style={{ color: PALETTE.accent }}>
                  四大優勢
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {valueCards.map((card, index) => {
                const isOpen = openCardIndex === index;
                return (
                  <motion.button
                    key={card.title}
                    type="button"
                    onClick={() => setOpenCardIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    initial={{ opacity: 0, y: 30 }}
                    animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.12 * (index + 1) }}
                    className="group text-left rounded-2xl p-8 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: PALETTE.surface,
                      border: `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: "#F5EDE3",
                          border: `1px solid ${PALETTE.border}`,
                        }}
                        aria-hidden
                      >
                        <span>{card.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-display font-medium"
                          style={{
                            fontSize: "clamp(1.4rem, 1.2vw + 0.9rem, 1.8rem)",
                            lineHeight: 1.35,
                            color: PALETTE.ink,
                          }}
                        >
                          {card.title}
                        </h3>
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0,
                            marginTop: isOpen ? 16 : 0,
                          }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            className="font-body"
                            style={{
                              fontSize: "0.95rem",
                              lineHeight: 1.75,
                              color: PALETTE.inkMuted,
                            }}
                          >
                            {card.description}
                          </p>
                        </motion.div>
                        {!isOpen && (
                          <p
                            className="font-body mt-3 text-xs tracking-wider opacity-60 group-hover:opacity-100 transition-opacity"
                            style={{ color: PALETTE.inkMuted }}
                          >
                            點擊展開說明 →
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Teacher Cases ── */}
        <section
          id="cases"
          ref={casesRef}
          style={{
            backgroundColor: PALETTE.bgAlt,
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={casesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-14"
            >
              <span
                className="eyebrow inline-block mb-4"
                style={{ color: PALETTE.accentSoft, letterSpacing: "0.22em" }}
              >
                Voices · 引導者的聲音
              </span>
              <div
                className="mx-auto mb-6"
                style={{ height: "1px", width: "48px", backgroundColor: PALETTE.cta }}
              />
              <h2
                className="font-display font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                  lineHeight: 1.28,
                  color: PALETTE.ink,
                }}
              >
                來自世界各地的
                <span className="italic" style={{ color: PALETTE.accent }}>
                  老師案例
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {cases.map((c, i) => (
                <motion.figure
                  key={c.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={casesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.12 * (i + 1) }}
                  className="rounded-2xl p-7 flex flex-col"
                  style={{
                    backgroundColor: PALETTE.surface,
                    border: `1px solid ${PALETTE.border}`,
                  }}
                >
                  <Quote
                    className="w-6 h-6 mb-4"
                    strokeWidth={1.4}
                    style={{ color: PALETTE.accent }}
                  />
                  <blockquote
                    className="font-body flex-1"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      color: PALETTE.inkSoft,
                    }}
                  >
                    「{c.quote}」
                  </blockquote>
                  <figcaption className="mt-6 pt-5" style={{ borderTop: `1px solid ${PALETTE.border}` }}>
                    <div
                      className="font-display font-medium"
                      style={{ color: PALETTE.ink, fontSize: "1rem" }}
                    >
                      {c.name}
                    </div>
                    <div
                      className="font-body mt-1"
                      style={{ color: PALETTE.inkMuted, fontSize: "0.82rem", letterSpacing: "0.04em" }}
                    >
                      {c.role}
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Join Process ── */}
        <section
          id="process"
          ref={stepsRef}
          style={{
            backgroundColor: PALETTE.bg,
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-14"
            >
              <span
                className="eyebrow inline-block mb-4"
                style={{ color: PALETTE.accentSoft, letterSpacing: "0.22em" }}
              >
                How to Join · 加入流程
              </span>
              <div
                className="mx-auto mb-6"
                style={{ height: "1px", width: "48px", backgroundColor: PALETTE.cta }}
              />
              <h2
                className="font-display font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                  lineHeight: 1.28,
                  color: PALETTE.ink,
                }}
              >
                四步驟，
                <span className="italic" style={{ color: PALETTE.accent }}>
                  開啟您的舞動旅程
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 * (i + 1) }}
                  className="relative rounded-2xl p-7 text-center"
                  style={{
                    backgroundColor: PALETTE.surface,
                    border: `1px solid ${PALETTE.border}`,
                  }}
                >
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-display"
                    style={{
                      backgroundColor: PALETTE.cta,
                      color: "#FFFFFF",
                      letterSpacing: "0.1em",
                    }}
                  >
                    STEP {i + 1}
                  </div>
                  <div
                    className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mt-3 mb-5"
                    style={{
                      backgroundColor: "#F5EDE3",
                      border: `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <s.icon className="w-6 h-6" strokeWidth={1.4} style={{ color: PALETTE.accent }} />
                  </div>
                  <h3
                    className="font-display font-medium mb-2"
                    style={{ fontSize: "1.05rem", color: PALETTE.ink }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{ fontSize: "0.88rem", lineHeight: 1.7, color: PALETTE.inkMuted }}
                  >
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          id="faq"
          ref={faqRef}
          style={{
            backgroundColor: PALETTE.bgAlt,
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-14"
            >
              <span
                className="eyebrow inline-block mb-4"
                style={{ color: PALETTE.accentSoft, letterSpacing: "0.22em" }}
              >
                FAQ · 常見問題
              </span>
              <div
                className="mx-auto mb-6"
                style={{ height: "1px", width: "48px", backgroundColor: PALETTE.cta }}
              />
              <h2
                className="font-display font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                  lineHeight: 1.28,
                  color: PALETTE.ink,
                }}
              >
                您可能想知道的
                <span className="italic" style={{ color: PALETTE.accent }}>
                  幾件事
                </span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <motion.div
                    key={f.q}
                    initial={{ opacity: 0, y: 12 }}
                    animate={faqInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.06 * i }}
                    className="rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: PALETTE.surface,
                      border: `1px solid ${PALETTE.border}`,
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 transition-colors"
                      style={{ color: PALETTE.ink }}
                    >
                      <span className="font-display font-medium" style={{ fontSize: "1rem" }}>
                        {f.q}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform"
                        style={{
                          color: PALETTE.accent,
                          transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    {open && (
                      <div
                        className="px-6 pb-5 font-body"
                        style={{
                          fontSize: "0.92rem",
                          lineHeight: 1.78,
                          color: PALETTE.inkSoft,
                        }}
                      >
                        {f.a}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          ref={ctaRef}
          style={{
            backgroundColor: PALETTE.bg,
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(5rem, 9vw + 1rem, 8rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="eyebrow inline-block mb-4"
              style={{ color: PALETTE.accentSoft, letterSpacing: "0.22em" }}
            >
              Ready · 準備好了嗎
            </motion.span>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={ctaInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-6"
              style={{ height: "1px", width: "48px", backgroundColor: PALETTE.cta }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display font-medium mb-6"
              style={{
                fontSize: "clamp(1.6rem, 2vw + 0.8rem, 2.6rem)",
                lineHeight: 1.28,
                color: PALETTE.ink,
              }}
            >
              讓世界，
              <br />
              <span className="italic" style={{ color: PALETTE.accent }}>
                從你的舞步開始認識台灣
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body mx-auto mb-10 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 0.5vw + 0.875rem, 1.1rem)",
                lineHeight: 1.75,
                color: PALETTE.inkSoft,
              }}
            >
              一份簡單的申請，就能開啟一段被世界看見的旅程。加入舞島咖，與我們一起把文化舞步留在這座島上、也帶去更遠的地方。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-10 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: PALETTE.cta, color: "#FFFFFF" }}
              >
                <Link to="/teacher/login">
                  立即申請成為引導者
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base"
                style={{ borderColor: PALETTE.cta, color: PALETTE.accent }}
              >
                <Link to="/#instructors">先看看現有引導者</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
