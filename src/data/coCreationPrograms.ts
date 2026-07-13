// Config-driven registry for the "聚落共創" (Co-Creation) hub.
// Cards are rendered as an ordered "guide journey": complete the current
// milestone to unlock the next opportunity.

export type ProgramStatus = "active" | "locked";

export interface CoCreationProgram {
  id: string;
  emoji: string;
  title: string;
  /** Short subtitle shown directly under the title */
  subtitle: string;
  description: string;
  status: ProgramStatus;
  /** Route path when status === "active" */
  href?: string;
  /** Optional CTA label override */
  ctaLabel?: string;
  /** Copy shown under the soft Coming Soon label for locked cards */
  lockedMessage?: string;
}

export const CO_CREATION_PROGRAMS: CoCreationProgram[] = [
  {
    id: "seed-videos",
    emoji: "🌱",
    title: "種子短片",
    subtitle: "一支短片、一顆種子，共築舞島聚落。",
    description:
      "共同打造平台的文化根基，也逐步累積自己的數位資產，讓更多人認識並愛上這門舞蹈。",
    status: "active",
    href: "/teacher/co-creation/seed-videos",
    ctaLabel: "開始建立",
  },
  {
    id: "special-projects",
    emoji: "🎤",
    title: "特別企劃",
    subtitle: "跨界合作×分享故事，放大品牌影響力。",
    description:
      "透過文化企劃、跨域合作與品牌專訪，讓更多人認識您的理念與舞蹈文化，持續拓展品牌影響力。",
    status: "locked",
    lockedMessage: "未來可參與跨界合作、世界舞蹈交流與品牌專訪。",
  },
  {
    id: "badges",
    emoji: "🏅",
    title: "島咖徽章",
    subtitle: "累積信任，成就品牌價值。",
    description:
      "每一次分享、每一次參與，都是品牌成長的足跡，也成為聚落共同前行的見證。",
    status: "locked",
    lockedMessage: "隨著教學、共創及文化推廣，逐步累積屬於您的聚落徽章。",
  },
];

export const CO_CREATION_TOTAL_MILESTONES = CO_CREATION_PROGRAMS.length;
export const SEED_VIDEO_TARGET = 5;

// Shared localStorage helpers for reading seed video progress from any surface.
export function seedVideoStorageKey(userId: string) {
  return `danceka:seed-videos:${userId}`;
}

export function readSeedVideoStats(userId: string | undefined) {
  if (!userId) return { total: 0, published: 0 };
  try {
    const raw = localStorage.getItem(seedVideoStorageKey(userId));
    if (!raw) return { total: 0, published: 0 };
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return { total: 0, published: 0 };
    return {
      total: arr.length,
      published: arr.filter((v) => v?.status === "published").length,
    };
  } catch {
    return { total: 0, published: 0 };
  }
}

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
