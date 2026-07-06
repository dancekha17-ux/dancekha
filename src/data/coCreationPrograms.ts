// Config-driven registry for the "聚落共創" (Co-Creation) hub.
// Add / enable programs here without touching the dashboard layout.

export type ProgramStatus = "active" | "coming_soon";

export interface CoCreationProgram {
  id: string;
  emoji: string;
  title: string;
  description: string;
  status: ProgramStatus;
  /** Route path when status === "active" */
  href?: string;
  /** Optional CTA label override */
  ctaLabel?: string;
}

export const CO_CREATION_PROGRAMS: CoCreationProgram[] = [
  {
    id: "seed-videos",
    emoji: "🌱",
    title: "種子短片",
    description:
      "建立初學者基礎教學短片，作為平台會員專屬內容，協助更多新手踏出第一步，也讓更多人透過您的教學認識您的舞蹈品牌。",
    status: "active",
    href: "/teacher/co-creation/seed-videos",
    ctaLabel: "查看 / 管理",
  },
  {
    id: "featured-picks",
    emoji: "⭐",
    title: "島咖精選",
    description:
      "平台依據課程品質、內容特色與學員回饋，不定期推薦優質課程，提升品牌曝光與影響力。",
    status: "coming_soon",
  },
  {
    id: "brand-interview",
    emoji: "🎤",
    title: "品牌專訪",
    description:
      "由舞島咖主動邀請引導者分享舞蹈故事、教學理念與文化初心，打造專屬品牌內容。",
    status: "coming_soon",
  },
  {
    id: "world-culture",
    emoji: "🌍",
    title: "世界文化企劃",
    description:
      "與舞島咖共同策劃世界舞蹈文化主題，透過教學、故事與文化交流，一起推廣多元舞蹈文化。",
    status: "coming_soon",
  },
  {
    id: "badges",
    emoji: "🏅",
    title: "島咖徽章",
    description:
      "記錄您的教學投入、文化推廣與平台共創歷程，累積專屬徽章與品牌成就。",
    status: "coming_soon",
  },
];

// Modules reserved for future navigation (kept hidden for now).
// Flip `visible` to true to surface in dashboard navigation.
export interface DashboardModule {
  id: string;
  emoji: string;
  label: string;
  href: string;
  visible: boolean;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: "identity", emoji: "👤", label: "基本資訊", href: "#identity", visible: true },
  { id: "courses", emoji: "📚", label: "課程活動", href: "#courses", visible: true },
  { id: "media", emoji: "📸", label: "精彩瞬間", href: "#media", visible: true },
  { id: "co-creation", emoji: "🤝", label: "聚落共創", href: "#co-creation", visible: true },
  // Reserved — do not display yet.
  { id: "revenue", emoji: "💰", label: "收益中心", href: "#revenue", visible: false },
  { id: "insights", emoji: "📊", label: "品牌洞察", href: "#insights", visible: false },
];
