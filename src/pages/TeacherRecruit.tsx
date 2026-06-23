import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wallet, Wrench, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const valueCards = [
  {
    icon: Sparkles,
    title: "打造個人專屬數位品牌",
    description:
      "擺脫雜亂的社群貼文，我們幫你把課程與演出轉化為讓人一眼心動的專業履歷，並在地圖上點亮您的專屬地標。",
  },
  {
    icon: Wallet,
    title: "專業價值，最高分潤達 90%",
    description:
      "我們深知引導者的專業無價。舞島咖致力於建立友善的商業模式，讓老師夥伴最高可享有 90% 的銷售分潤，確保您的每一次教學與演出，都能獲得最實質的收益回饋。",
  },
  {
    icon: Wrench,
    title: "輕鬆省心的系統管家",
    description:
      "不再需要手動統計報名、催匯款。我們提供專屬的「引導者後台」，自動處理報名表單、金流媒合與電子票券。",
  },
  {
    icon: Globe,
    title: "成為世界舞蹈地圖的一部分",
    description:
      "在舞島咖，你不是孤軍奮戰。我們會透過線上地圖與社群推廣，將探索者精準帶到你的課程門前。",
  },
];

export default function TeacherRecruit() {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const commitmentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });
  const commitmentInView = useInView(commitmentRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <Header />

      <main>
        {/* ── Hero Section ── */}
        <section
          ref={heroRef}
          className="relative flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            backgroundColor: "#FAF9F6",
            minHeight: "100vh",
            paddingTop: "clamp(6rem, 14vh, 10rem)",
            paddingBottom: "clamp(4rem, 10vh, 8rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          {/* Subtle warm glow behind headline */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
              style={{
                width: "600px",
                height: "400px",
                background: "radial-gradient(ellipse at center, #D2B48C40 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="eyebrow inline-block mb-6"
              style={{ color: "#A0826D", letterSpacing: "0.28em" }}
            >
              JOIN US · 加入引導者聚落
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
                color: "#3D2B1F",
              }}
            >
              成為舞島咖的引導者，
              <br />
              <span className="italic font-normal" style={{ color: "#B8906A" }}>
                讓世界看見你的文化舞步
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mx-auto mb-8"
              style={{
                height: "1px",
                width: "64px",
                backgroundColor: "#D2B48C",
                transformOrigin: "center",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-body mx-auto mb-12 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 0.6vw + 0.875rem, 1.2rem)",
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                color: "#6B5B4F",
              }}
            >
              我們像落在這座島嶼上的沙，不需要很大，但聚在一起，就能隨著音樂掀起最美麗的浪花。加入引導者聚落，開啟您的舞蹈事業。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-10 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "#D2B48C",
                  color: "#FFFFFF",
                }}
              >
                <Link to="/teacher/login?mode=signup">
                  立即申請成為引導者
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Value Proposition Cards ── */}
        <section
          ref={cardsRef}
          style={{
            backgroundColor: "#FAF9F6",
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
                style={{ color: "#A0826D", letterSpacing: "0.22em" }}
              >
                Why Join · 為何加入
              </span>
              <div
                className="mx-auto mb-6"
                style={{
                  height: "1px",
                  width: "48px",
                  backgroundColor: "#D2B48C",
                }}
              />
              <h2
                className="font-display font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                  lineHeight: 1.28,
                  color: "#3D2B1F",
                }}
              >
                成為引導者的<span className="italic" style={{ color: "#B8906A" }}>四大優勢</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {valueCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.12 * (index + 1) }}
                  className="group rounded-2xl p-7 transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E8E0D5",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-colors duration-300"
                    style={{
                      backgroundColor: "#F5EDE3",
                      border: "1px solid #E8DED0",
                    }}
                  >
                    <card.icon
                      className="w-5 h-5"
                      strokeWidth={1.5}
                      style={{ color: "#B8906A" }}
                    />
                  </div>
                  <h3
                    className="font-display font-medium mb-3"
                    style={{
                      fontSize: "1.125rem",
                      lineHeight: 1.35,
                      color: "#3D2B1F",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      color: "#7A6B5F",
                    }}
                  >
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Commitment Section ── */}
        <section
          ref={commitmentRef}
          style={{
            backgroundColor: "#F3EDE5",
            paddingTop: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingBottom: "clamp(4rem, 8vw + 1rem, 7rem)",
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={commitmentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="eyebrow inline-block mb-4"
              style={{ color: "#A0826D", letterSpacing: "0.22em" }}
            >
              Partnership · 夥伴關係
            </motion.span>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={commitmentInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-6"
              style={{
                height: "1px",
                width: "48px",
                backgroundColor: "#D2B48C",
                transformOrigin: "center",
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={commitmentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display font-medium mb-8"
              style={{
                fontSize: "clamp(1.5rem, 1.8vw + 0.8rem, 2.5rem)",
                lineHeight: 1.28,
                color: "#3D2B1F",
              }}
            >
              我們不只是平台，
              <br />
              <span className="italic" style={{ color: "#B8906A" }}>
                是共創舞蹈未來的夥伴
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={commitmentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body mx-auto mb-12 max-w-2xl"
              style={{
                fontSize: "clamp(1rem, 0.5vw + 0.875rem, 1.15rem)",
                lineHeight: 1.75,
                letterSpacing: "0.01em",
                color: "#6B5B4F",
              }}
            >
              這座島嶼之所以美麗，是因為每一位引導者都留下了自己的腳印。我們相信，最優質的教學與文化傳承，源自於每一位夥伴的熱情投入。當您成為我們的基石夥伴，透過分享您的教學智慧，我們將共同灌溉這片舞蹈地圖，讓更多探索者能從您的腳步開始，勇敢跨出第一步。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={commitmentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Button
                asChild
                size="lg"
                className="group rounded-full px-10 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "#D2B48C",
                  color: "#FFFFFF",
                }}
              >
                <Link to="/teacher/login?mode=signup">
                  開啟您的引導者冒險
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
