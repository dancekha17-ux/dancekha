// Mock course data — single source of truth used by CoursesSection and CourseDetail page.

export interface Course {
  id: string;
  title: string;
  titleEn?: string;
  category: string; // 地域 / 類型 (對應 CoursesSection 的 categories)
  region: string; // 地域標籤 顯示用
  functionTags: string[]; // 功能標籤 (e.g. 祭典與傳承、社交與聚會、身心療癒)
  instructor: string;
  instructorSlug?: string;
  duration: string;
  students: number;
  price: string;
  priceFrom: string;
  isOnline: boolean;
  isFeatured?: boolean;
  gradient: string;
  // Detail page
  cover: string;
  videoEmbedUrl: string;
  description: string;
  cultureTitle: string;
  cultureBody: string;
  schedule: string[];
  level: "初級" | "中級" | "高級";
}

const defaultVideo = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export const courses: Course[] = [
  {
    id: "body-opening",
    title: "零基礎｜身體開啟工作坊",
    titleEn: "Body Opening Workshop",
    category: "beginner",
    region: "亞洲・台灣",
    functionTags: ["身心療癒", "社交與聚會"],
    instructor: "林雅琪",
    instructorSlug: "yachi-lin",
    duration: "90分鐘",
    students: 156,
    price: "NT$ 800",
    priceFrom: "NT$ 800 / 堂",
    isOnline: true,
    isFeatured: true,
    gradient: "from-primary/20 to-accent/10",
    cover:
      "https://images.unsplash.com/photo-1535525153412-5a092d46b3a5?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description:
      "為從未接觸過舞蹈的你設計，從呼吸、重心、地板開始重新認識自己的身體。",
    cultureTitle: "從靜止裡，找到動的可能",
    cultureBody:
      "身體開啟工作坊源自當代舞蹈教育中的『somatic』身體覺察傳統，強調以最少的肌肉用力完成最大的動作可能。透過地板技巧與呼吸練習，學員能在 90 分鐘內感受到身體中沉睡已久的關節活性。",
    schedule: ["週三 19:30", "週六 14:00"],
    level: "初級",
  },
  {
    id: "chinese-folk",
    title: "中國民間舞蹈",
    titleEn: "Chinese Folk Dance",
    category: "street",
    region: "亞洲・中國",
    functionTags: ["祭典與傳承", "表演與藝術"],
    instructor: "陳俊宏",
    instructorSlug: "junhong-chen",
    duration: "60分鐘",
    students: 234,
    price: "NT$ 650",
    priceFrom: "NT$ 650 / 堂",
    isOnline: false,
    gradient: "from-soul/20 to-primary/10",
    cover:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description:
      "走入中國各地的村寨與節慶，學習苗族、維吾爾、傣族等民間舞蹈的核心律動。",
    cultureTitle: "民間舞 · 大地與節慶的共振",
    cultureBody:
      "中國民間舞遍布 56 個民族，每一支舞背後都對應一段勞動、信仰或歲時節慶。從蒙古的肩部抖動、傣族的孔雀手姿，到苗族的踩堂舞，民間舞是一部用身體寫成的民族誌。",
    schedule: ["週二 19:00", "週四 19:30"],
    level: "初級",
  },
  {
    id: "modern-poem",
    title: "現代舞｜流動的詩",
    titleEn: "Modern Dance · Fluid Poetry",
    category: "contemporary",
    region: "亞洲・台灣",
    functionTags: ["表演與藝術", "身心療癒"],
    instructor: "林雅琪",
    instructorSlug: "yachi-lin",
    duration: "120分鐘",
    students: 89,
    price: "NT$ 1,200",
    priceFrom: "NT$ 1,200 / 堂",
    isOnline: true,
    gradient: "from-success/20 to-accent/10",
    cover:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description:
      "以即興與接觸即興為核心，發展屬於自己的肢體語彙。",
    cultureTitle: "現代舞 · 從身體找回語言",
    cultureBody:
      "現代舞誕生於 20 世紀初的歐美，舞者試圖擺脫芭蕾的規訓，以呼吸、重力與地板為起點，重新探索身體的可能。",
    schedule: ["週三 20:00", "週六 15:30"],
    level: "中級",
  },
  {
    id: "senior-rhythm",
    title: "樂齡身心律動",
    titleEn: "Senior Mind-Body Rhythm",
    category: "senior",
    region: "亞洲・台灣",
    functionTags: ["身心療癒", "社交與聚會"],
    instructor: "張美玲",
    instructorSlug: "meiling-chang",
    duration: "45分鐘",
    students: 67,
    price: "NT$ 500",
    priceFrom: "NT$ 500 / 堂",
    isOnline: false,
    gradient: "from-accent/20 to-primary/10",
    cover:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "為 55 歲以上學員設計的低衝擊舞動課，安全又療癒。",
    cultureTitle: "舞蹈，是最好的長照",
    cultureBody:
      "研究顯示，規律的舞蹈活動能顯著降低長者跌倒風險、改善認知功能。本課結合圈舞、呼吸練習與輕量肌力訓練。",
    schedule: ["週一 10:00", "週四 10:00"],
    level: "初級",
  },
  {
    id: "salsa-intro",
    title: "騷莎入門：讓身體說話",
    titleEn: "Salsa for Beginners",
    category: "latin",
    region: "拉丁美洲",
    functionTags: ["社交與聚會", "表演與藝術"],
    instructor: "Carlos Martinez",
    duration: "75分鐘",
    students: 123,
    price: "NT$ 750",
    priceFrom: "NT$ 750 / 堂",
    isOnline: true,
    gradient: "from-primary/20 to-soul/10",
    cover:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "從基本步、轉圈到雙人連結，輕鬆進入熱情的騷莎世界。",
    cultureTitle: "Salsa · 加勒比海的夜晚永不結束",
    cultureBody:
      "Salsa 在 1960-70 年代的紐約由古巴、波多黎各音樂家共同孕育，融合 Mambo、Cha-cha、Son，成為拉丁舞蹈最具代表性的社交語言。",
    schedule: ["週五 20:00", "週日 19:00"],
    level: "初級",
  },
  {
    id: "chinese-classical",
    title: "中國古典舞蹈",
    titleEn: "Chinese Classical Dance",
    category: "street",
    region: "亞洲・中國",
    functionTags: ["祭典與傳承", "表演與藝術"],
    instructor: "陳俊宏",
    instructorSlug: "junhong-chen",
    duration: "90分鐘",
    students: 78,
    price: "NT$ 900",
    priceFrom: "NT$ 900 / 堂",
    isOnline: false,
    gradient: "from-soul/20 to-success/10",
    cover:
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "結合身韻、身法與漢唐美學，找到東方身體的線條。",
    cultureTitle: "中國古典舞 · 筆墨山水的身體流轉",
    cultureBody:
      "中國古典舞融合戲曲、武術、敦煌壁畫與漢唐俑像，強調『擰、傾、圓、曲』四大美學要素。每一個動作都有起、行、止的呼吸節奏。",
    schedule: ["週二 18:30", "週五 19:00"],
    level: "中級",
  },
  {
    id: "ukrainian-folk",
    title: "烏克蘭民俗舞｜大地的迴旋",
    titleEn: "Ukrainian Folk Dance",
    category: "eastern-europe",
    region: "東歐",
    functionTags: ["祭典與傳承", "社交與聚會"],
    instructor: "Olena Kovalenko",
    duration: "90分鐘",
    students: 42,
    price: "NT$ 950",
    priceFrom: "NT$ 950 / 堂",
    isOnline: false,
    gradient: "from-primary/20 to-soul/10",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "Hopak 的飛踢與旋轉，是烏克蘭草原最熱烈的問候。",
    cultureTitle: "Hopak · 草原民族的飛舞",
    cultureBody:
      "Hopak 起源自 16 世紀的哥薩克武士訓練，男性舞者的飛踢、蹲跳展現力量；女性舞者則以圓舞與花環呈現大地的豐饒。",
    schedule: ["週六 11:00"],
    level: "中級",
  },
  {
    id: "flamenco-fire",
    title: "西班牙佛朗明哥｜火焰節奏",
    titleEn: "Flamenco · Rhythm of Fire",
    category: "balkans",
    region: "南歐",
    functionTags: ["表演與藝術", "祭典與傳承"],
    instructor: "María Delgado",
    duration: "100分鐘",
    students: 95,
    price: "NT$ 1,100",
    priceFrom: "NT$ 1,100 / 堂",
    isOnline: false,
    gradient: "from-soul/20 to-accent/10",
    cover:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "從 Compás 拍掌到 Zapateado 踏步，掌握佛朗明哥的核心節奏。",
    cultureTitle: "Flamenco · 安達魯西亞的靈魂之歌",
    cultureBody:
      "Flamenco 起源於 18 世紀西班牙南部安達魯西亞，是吉普賽、摩爾與安達魯西亞文化交融的產物，2010 年被聯合國列為人類非物質文化遺產。",
    schedule: ["週四 20:00", "週日 16:00"],
    level: "中級",
  },
  {
    id: "bulgarian-horo",
    title: "保加利亞民俗舞｜複雜節拍入門",
    titleEn: "Bulgarian Horo · Complex Rhythms",
    category: "balkans",
    region: "巴爾幹",
    functionTags: ["祭典與傳承", "社交與聚會", "複雜節拍"],
    instructor: "Dimitar Petrov",
    duration: "75分鐘",
    students: 28,
    price: "NT$ 850",
    priceFrom: "NT$ 850 / 堂",
    isOnline: true,
    gradient: "from-success/20 to-primary/10",
    cover:
      "https://images.unsplash.com/photo-1530021232320-687d8e3dba54?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "5/8、7/8、9/8——學會用身體理解保加利亞的不對稱節奏。",
    cultureTitle: "Horo · 用 7/8 拍把村子串成一條鏈",
    cultureBody:
      "保加利亞的 Horo 圓圈舞以不對稱節拍聞名，村民手牽手繞圈，腳下是被踏實了千年的泥土，身體成為節奏本身。",
    schedule: ["週四 19:00", "週日 14:00"],
    level: "初級",
  },
  {
    id: "israeli-folk",
    title: "以色列社交圈舞｜Israeli Folk",
    titleEn: "Israeli Folk Dance",
    category: "mideast",
    region: "中東",
    functionTags: ["社交與聚會", "祭典與傳承"],
    instructor: "Noa Ben-David",
    duration: "60分鐘",
    students: 64,
    price: "NT$ 700",
    priceFrom: "NT$ 700 / 堂",
    isOnline: false,
    gradient: "from-accent/20 to-soul/10",
    cover:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "從 Mayim Mayim 到現代編舞，享受全世界最熱情的圈舞文化。",
    cultureTitle: "Israeli Folk · 復國浪潮中的新傳統",
    cultureBody:
      "以色列民俗舞於 20 世紀中期由各地移民共同創造，融合葉門、東歐、中東元素，成為一種『發明的傳統』，每年吸引全球愛好者參與卡米爾節。",
    schedule: ["週三 19:30"],
    level: "初級",
  },
  {
    id: "csardas",
    title: "匈牙利民俗舞｜Csárdás 探索",
    titleEn: "Hungarian Csárdás",
    category: "eastern-europe",
    region: "東歐",
    functionTags: ["祭典與傳承", "表演與藝術"],
    instructor: "László Nagy",
    duration: "90分鐘",
    students: 31,
    price: "NT$ 900",
    priceFrom: "NT$ 900 / 堂",
    isOnline: true,
    gradient: "from-primary/20 to-accent/10",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2000&q=80",
    videoEmbedUrl: defaultVideo,
    description: "從慢板 Lassú 到快板 Friss，體驗匈牙利平原的雙人舞步。",
    cultureTitle: "Csárdás · 由酒館誕生的國民舞",
    cultureBody:
      "Csárdás 一詞源自匈牙利文 csárda（鄉村酒館），19 世紀盛行於匈牙利貴族與民間，後成為布拉姆斯與李斯特音樂中的招牌節奏。",
    schedule: ["週二 19:30"],
    level: "中級",
  },
];

export const getCourseById = (id: string) => courses.find((c) => c.id === id);

export const FUNCTION_TAGS = [
  "祭典與傳承",
  "社交與聚會",
  "表演與藝術",
  "身心療癒",
  "複雜節拍",
];
