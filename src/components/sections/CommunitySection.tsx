import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Heart, Share2, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "我 65 歲才開始學舞，在舞島咖遇到了最溫暖的老師和同學。原來跳舞真的不分年齡，這裡讓我找回了年輕的感覺。",
    author: "陳媽媽",
    role: "樂齡律動學員",
    likes: 234,
  },
  {
    id: 2,
    content:
      "作為一個完全沒有舞蹈基礎的工程師，我本來很擔心跟不上。但這裡的氛圍讓我完全放鬆，現在每週最期待的就是舞蹈課！",
    author: "Kevin",
    role: "街舞入門學員",
    likes: 189,
  },
  {
    id: 3,
    content:
      "我在這裡不只學會了舞蹈技巧，更重要的是認識了一群志同道合的朋友。我們一起練習、一起進步，這種感覺太棒了。",
    author: "小安",
    role: "現代舞進階學員",
    likes: 312,
  },
];

const communityStats = [
  { number: "15,000+", label: "社群成員" },
  { number: "500+", label: "學員故事" },
  { number: "50+", label: "共學小組" },
  { number: "100+", label: "線下聚會" },
];

export function CommunitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="community"
      className="section-padding bg-foreground text-primary-foreground"
      ref={ref}
    >
      <div className="container-wide mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-4">
            暖流社群
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold mb-6">
            舞出<span className="text-primary">友誼的節奏</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 font-body leading-relaxed">
            在舞島咖，你永遠不是一個人在跳舞。這裡有最真誠的分享、最溫暖的鼓勵，
            讓我們一起用舞步編織人與人之間的連結。
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {communityStats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10"
            >
              <div className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-primary-foreground/60 font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:border-primary/30 transition-all duration-500">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-primary/40 mb-4" />

                {/* Content */}
                <p className="text-primary-foreground/80 font-body leading-relaxed mb-6">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-semibold text-primary-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-primary-foreground/50 font-body">
                      {testimonial.role}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-sm">{testimonial.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity shadow-glow"
            >
              <MessageCircle className="w-5 h-5" />
              加入社群
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary transition-colors"
            >
              <Share2 className="w-5 h-5" />
              分享你的故事
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
