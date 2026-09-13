export type DnaKey = "ritual" | "ocean" | "stage" | "flow";

export interface DnaProfile {
  key: DnaKey;
  title: string;
  titleEn: string;
  subtitle: string;
  /** short poetic line shown under the archetype name */
  personaLine: string;
  tags: string[];
  traits: { label: string; value: number }[];
  prescription: string;
  genres: string[];
  category: string;
  /** deep diagnosis of the four quiz dimensions */
  diagnosis: { dimension: string; text: string }[];
  /** dynamic recommendation for the "next journey" card */
  recommendation: { title: string; reason: string };
}

export const DNA_PROFILES: Record<DnaKey, DnaProfile> = {
  ritual: {
    key: "ritual",
    title: "山林儀式舞者",
    titleEn: "Forest Ritual Dancer",
    subtitle: "你的身體渴望安靜、緩慢、有呼吸節奏的儀式感。",
    personaLine: "Forest Ritual · 靜謐型舞者",
    tags: ["沉靜 Grounded", "內省 Reflective", "共感 Empathic"],
    traits: [
      { label: "節奏感", value: 68 },
      { label: "即興力", value: 55 },
      { label: "文化共鳴", value: 94 },
    ],
    prescription:
      "巴爾幹圈舞與古典儀式——手牽著手、腳踩著大地的重複節奏與優雅肢體，能安撫過度運轉的神經。",
    genres: ["巴爾幹圈舞 Horo", "中國古典舞", "芭蕾舞", "印度 Odissi 奧迪西舞", "身體開發／律動基礎"],
    category: "balkans",
    diagnosis: [
      {
        dimension: "情緒 · 壓力釋放",
        text: "你不是靠爆發來釋放，而是靠「慢下來」。當節奏可預測、動作可重複，你的神經系統才會真正卸下防備，因此文化共鳴指數特別高。",
      },
      {
        dimension: "社交 · 人際邊界",
        text: "你偏好不需要言語的互動：牽手、對齊呼吸、一起踩同一個拍點。圓圈式的舞蹈讓你被群體接住，卻不必成為焦點。",
      },
      {
        dimension: "空間 · 場域感知",
        text: "有歷史感、有儀式感的空間讓你安心。你在意的不只是動作，而是動作背後的故事與土地。",
      },
      {
        dimension: "肢體 · 身體渴望",
        text: "你的身體正在要求柔軟度與關節鬆動，而非強度。低衝擊、重複性高的民俗舞是你最溫柔的入口。",
      },
    ],
    recommendation: {
      title: "巴爾幹圓圈舞 Horo 入門",
      reason: "低衝擊、免舞伴，用重複節奏安撫神經系統",
    },
  },
  ocean: {
    key: "ocean",
    title: "海洋輕盈舞者",
    titleEn: "Ocean Breeze Dancer",
    subtitle: "你需要的是陽光、笑聲，和一群人一起輕鬆擺動的自在。",
    personaLine: "Ocean Breeze · 微風型舞者",
    tags: ["明亮 Bright", "友善 Warm", "自在 Easy"],
    traits: [
      { label: "節奏感", value: 76 },
      { label: "即興力", value: 62 },
      { label: "文化共鳴", value: 84 },
    ],
    prescription:
      "夏威夷 Hula 與大溪地律動——柔軟的腰臀波浪、腳步擺動與呼吸同步，零基礎、免舞伴，跳完整個人像被海風吹過。",
    genres: ["夏威夷 Hula 呼拉舞", "大溪地舞", "美國方舞", "蘇格蘭舞", "希臘／以色列民俗舞", "零基礎律動入門"],
    category: "beginner",
    diagnosis: [
      {
        dimension: "情緒 · 壓力釋放",
        text: "你的情緒出口是「人」與「笑聲」。比起獨自練功，你更適合一群人一起流汗，能量會自然被補滿。",
      },
      {
        dimension: "社交 · 人際邊界",
        text: "你喜歡站在可進可退的位置：能觀察、也能隨時融入大圈圈。因此團體性強、不需要固定舞伴的舞種最適合你。",
      },
      {
        dimension: "空間 · 場域感知",
        text: "開放、明亮、有自然元素的空間會讓你放鬆。海浪、鼓聲這類循環聲響能讓你很快進入身體。",
      },
      {
        dimension: "肢體 · 身體渴望",
        text: "你要的是輕盈與持久，而不是爆發。以腰臀波浪與腳步變化為主的舞蹈，能在不受傷的前提下把體感打開。",
      },
    ],
    recommendation: {
      title: "夏威夷 Hula 呼拉舞入門",
      reason: "零基礎、免舞伴，柔和的腰臀律動最快建立身體信心",
    },
  },
  stage: {
    key: "stage",
    title: "烈焰氣場舞者",
    titleEn: "Wildfire Presence Dancer",
    subtitle: "你的身體在等一個舞台，把壓抑的能量全部燒出來。",
    personaLine: "Wildfire · 火光型舞者",
    tags: ["熱情 Passionate", "直覺 Intuitive", "社交 Social"],
    traits: [
      { label: "節奏感", value: 92 },
      { label: "即興力", value: 80 },
      { label: "文化共鳴", value: 71 },
    ],
    prescription:
      "佛朗明哥與拉丁節奏——強烈的踏步、核心與眼神訓練，一堂課就能把情緒轉成氣場與核心力量。",
    genres: ["西班牙佛朗明哥", "Salsa 莎莎舞", "K-POP／街舞", "中國民族民間舞"],
    category: "latin",
    diagnosis: [
      {
        dimension: "情緒 · 壓力釋放",
        text: "你需要「輸出」型的釋放：大聲的音樂、明確的重拍、能踩得出聲音的動作，情緒才有地方去。",
      },
      {
        dimension: "社交 · 人際邊界",
        text: "被看見對你不是壓力，而是能量來源。你的氣場在有觀眾時會自然放大，很適合有表演成果的課程設計。",
      },
      {
        dimension: "空間 · 場域感知",
        text: "都市感、低音強烈的空間會啟動你。鏡子、燈光與節拍器都是你的助燃劑。",
      },
      {
        dimension: "肢體 · 身體渴望",
        text: "你渴望核心力量與爆發力，這也是節奏感指數偏高的原因。踏步與重心轉換類的訓練能最快看見進步。",
      },
    ],
    recommendation: {
      title: "西班牙佛朗明哥入門工作坊",
      reason: "用踏步與核心訓練，把壓抑的能量轉成氣場",
    },
  },
  flow: {
    key: "flow",
    title: "流動敘事舞者",
    titleEn: "Flowing Narrative Dancer",
    subtitle: "你想用身體說話，把說不出口的情緒交給動作。",
    personaLine: "Flowing Narrative · 敘事型舞者",
    tags: ["細膩 Delicate", "感性 Expressive", "自由 Free"],
    traits: [
      { label: "節奏感", value: 70 },
      { label: "即興力", value: 90 },
      { label: "文化共鳴", value: 78 },
    ],
    prescription:
      "現代舞與中東肚皮舞——連續、綿延的軀幹流動，讓情緒有出口，也讓身體重新找回柔軟。",
    genres: ["現代舞 Contemporary", "中東肚皮舞", "Swing 搖擺舞"],
    category: "contemporary",
    diagnosis: [
      {
        dimension: "情緒 · 壓力釋放",
        text: "你的情緒是層次豐富的，需要「被說出來」而不是被甩掉。即興與流動的動作能替你完成語言做不到的表達。",
      },
      {
        dimension: "社交 · 人際邊界",
        text: "你偏好深度而非廣度：一對一的對話、雙人的互動，比大團體更能讓你放鬆，因此即興力指數最高。",
      },
      {
        dimension: "空間 · 場域感知",
        text: "有故事、有質地的空間（老屋、微光、爵士樂）最能觸發你的身體記憶。",
      },
      {
        dimension: "肢體 · 身體渴望",
        text: "你渴望脊椎與軀幹的自由，而不是招式。以流動、延展為核心的舞種，能同時照顧情緒與身體。",
      },
    ],
    recommendation: {
      title: "現代舞 Contemporary 情緒流動課",
      reason: "以脊椎流動與即興引導，把說不出口的情緒交給身體",
    },
  },
};

/* ------------------------------------------------------------------
 * 台灣原住民族舞蹈｜文化延伸推薦
 * 各族為獨立的文化／舞蹈分類，未來可直接在此陣列追加新的族群。
 * 計分方式：不更動原本四大原型的計算，僅額外依「第幾題選了哪個特質」
 * 累加各族的親和分數，取分數最高且達門檻者作為延伸推薦。
 * ---------------------------------------------------------------- */
export interface IndigenousDance {
  id: string;
  /** 前台顯示名稱 */
  name: string;
  /** 沿用課程分類欄位 */
  category: string;
  tags: string[];
  blurb: string;
  /** questionIndex(0-3) -> DnaKey -> 分數 */
  signals: Record<number, Partial<Record<DnaKey, number>>>;
}

export const INDIGENOUS_DANCES: IndigenousDance[] = [
  {
    id: "amis",
    name: "阿美族",
    category: "indigenous",
    tags: ["熱情", "群體互動", "歡聚", "律動感", "自然戶外", "情緒釋放"],
    blurb: "牽手成圈、踏地為鼓的豐年歡聚，用集體律動把情緒放出來。",
    signals: {
      0: { stage: 3, ocean: 3 },
      1: { ocean: 2, stage: 2 },
      2: { ocean: 1, stage: 1 },
      3: { stage: 2, ocean: 1 },
    },
  },
  {
    id: "puyuma",
    name: "卑南族",
    category: "indigenous",
    tags: ["活力", "群體互動", "節奏感", "儀式感", "土地文化", "熱情"],
    blurb: "年祭的踏歌與步伐，兼具儀式的莊重與少年般的活力。",
    signals: {
      0: { stage: 2, ritual: 2 },
      1: { ocean: 2, stage: 2 },
      2: { ritual: 3, stage: 1 },
      3: { stage: 2, ritual: 2 },
    },
  },
  {
    id: "tao",
    name: "達悟族",
    category: "indigenous",
    tags: ["海洋", "自然", "流動", "自在", "群體", "文化探索"],
    blurb: "與海浪同頻的擺盪與長髮舞，身體順著自然的呼吸流動。",
    signals: {
      0: { flow: 3, ritual: 1 },
      1: { flow: 2, ritual: 2, ocean: 1 },
      2: { ocean: 4 },
      3: { flow: 3, ocean: 2 },
    },
  },
];

export interface IndigenousMatch {
  dance: IndigenousDance;
  score: number;
}

const INDIGENOUS_THRESHOLD = 5;

/** 依四題答案計算台灣原住民族舞蹈的延伸推薦（不影響原有原型排序） */
export function recommendIndigenous(
  answers: DnaKey[],
  limit = 2
): IndigenousMatch[] {
  if (!answers?.length) return [];
  return INDIGENOUS_DANCES.map((dance) => ({
    dance,
    score: answers.reduce(
      (sum, key, i) => sum + (dance.signals[i]?.[key] ?? 0),
      0
    ),
  }))
    .filter((m) => m.score >= INDIGENOUS_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export interface DnaResult {
  key: DnaKey;
  answers: DnaKey[];
  completedAt: string;
}

const STORAGE_KEY = "danceka:dna-result";

export function saveDnaResult(result: DnaResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    window.dispatchEvent(new CustomEvent("danceka:dna-updated", { detail: result }));
  } catch {
    /* storage unavailable */
  }
}

export function loadDnaResult(): DnaResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DnaResult;
    if (!parsed?.key || !DNA_PROFILES[parsed.key]) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDnaResult() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("danceka:dna-updated", { detail: null }));
  } catch {
    /* noop */
  }
}
