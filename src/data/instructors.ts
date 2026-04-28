import instructor1 from "@/assets/instructor-1.jpg";
import instructor2 from "@/assets/instructor-2.jpg";
import instructor3 from "@/assets/instructor-3.jpg";

export interface InstructorCourse {
  title: string;
  schedule: string;
  level: "初級" | "中級" | "高級";
  price: string;
}

export interface Instructor {
  slug: string;
  name: string;
  nameEn: string;
  specialty: string;
  region: string; // 地區標籤，如「巴爾幹」
  functionTags: string[]; // 功能標籤
  cover: string;
  avatar: string;
  bio: string;
  rating: number;
  students: number;
  // 文化故事
  cultureTitle: string;
  cultureBody: string;
  // 多媒體
  videoEmbedUrl: string; // YouTube embed url
  // 經歷與獎項
  credentials: string[];
  // 預約欄
  priceFrom: string;
  nextSession: string;
  courses: InstructorCourse[];
}

export const instructors: Instructor[] = [
  {
    slug: "yachi-lin",
    name: "林雅琪",
    nameEn: "Yachi Lin",
    specialty: "現代舞 / 即興舞蹈",
    region: "亞洲・台灣",
    functionTags: ["表演與藝術", "身心療癒"],
    cover:
      "https://images.unsplash.com/photo-1535525153412-5a092d46b3a5?auto=format&fit=crop&w=2000&q=80",
    avatar: instructor1,
    bio: "擁有 15 年舞蹈教學經驗，相信舞蹈是最直接的情感表達方式。",
    rating: 4.9,
    students: 320,
    cultureTitle: "現代舞 · 從身體找回語言",
    cultureBody:
      "現代舞誕生於 20 世紀初的歐美，舞者試圖擺脫芭蕾的規訓,以呼吸、重力與地板為起點,重新探索身體的可能。從 Isadora Duncan 的赤足旋轉,到 Pina Bausch 的劇場式編創,現代舞始終是一種以身體寫日記的藝術。",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    credentials: [
      "國立臺北藝術大學舞蹈研究所",
      "Trisha Brown Company 工作坊認證",
      "2021 台新藝術獎入圍",
      "雲門舞集巡演編舞助理",
    ],
    priceFrom: "NT$ 1,200 / 堂",
    nextSession: "週三 19:30 · 週六 14:00",
    courses: [
      { title: "即興入門", schedule: "週三 19:30", level: "初級", price: "NT$ 1,200" },
      { title: "編創實驗室", schedule: "週六 14:00", level: "中級", price: "NT$ 1,500" },
    ],
  },
  {
    slug: "junhong-chen",
    name: "陳俊宏",
    nameEn: "Jun Hong Chen",
    specialty: "中國舞 / 民族舞",
    region: "亞洲・台灣",
    functionTags: ["表演與藝術", "社交與聚會"],
    cover:
      "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=2000&q=80",
    avatar: instructor2,
    bio: "國際舞蹈大賽冠軍,致力於讓中國舞文化在台灣扎根發芽。",
    rating: 4.8,
    students: 450,
    cultureTitle: "中國舞 · 筆墨山水的身體流轉",
    cultureBody:
      "中國舞融合了古典舞、民族舞與民間舞，強調『身韻』與『身法』。從漢唐的古樸流暢到現代的意象表達，中國舞不僅是肢體的擺動，更是一首以身體書寫、充滿東方韻味的流動詩篇。",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    credentials: [
      "2019 Red Bull BC One 台灣冠軍",
      "Juste Debout Asia 評審",
      "Sony Music 編舞合作",
      "10 年街頭文化教學經驗",
    ],
    priceFrom: "NT$ 900 / 堂",
    nextSession: "週二 20:00 · 週五 19:30",
    courses: [
      { title: "Breaking 基礎", schedule: "週二 20:00", level: "初級", price: "NT$ 900" },
      { title: "Battle 實戰", schedule: "週五 19:30", level: "高級", price: "NT$ 1,400" },
    ],
  },
  {
    slug: "meiling-chang",
    name: "張美玲",
    nameEn: "Mei Ling Chang",
    specialty: "保加利亞民俗舞 / 樂齡律動",
    region: "巴爾幹",
    functionTags: ["祭典與傳承", "社交與聚會", "複雜節拍"],
    cover:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=2000&q=80",
    avatar: instructor3,
    bio: "走訪保加利亞鄉間進行田野調查,將 Horo 圓圈舞帶回亞洲推廣。",
    rating: 5.0,
    students: 180,
    cultureTitle: "Horo · 用 7/8 拍把村子串成一條鏈",
    cultureBody:
      "保加利亞的 Horo 圓圈舞以不對稱節拍聞名,7/8、9/8、11/8 是日常。村民手牽手繞圈,腳下是被踏實了千年的泥土,身體成為節奏本身。每一段 Horo 都對應特定節慶——婚禮、收成、聖名日,是一部用身體傳承的口述史。",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    credentials: [
      "保加利亞 Plovdiv 民俗學院訪問學者",
      "三度赴 Koprivshtitsa 民俗節田野紀錄",
      "亞洲首位 Bulgarian Horo 認證教師",
      "樂齡舞蹈推廣 12 年",
    ],
    priceFrom: "NT$ 800 / 堂",
    nextSession: "週四 10:00 · 週日 15:00",
    courses: [
      { title: "Horo 入門 · 5/8 與 7/8", schedule: "週四 10:00", level: "初級", price: "NT$ 800" },
      { title: "Kopanitsa 進階", schedule: "週日 15:00", level: "高級", price: "NT$ 1,200" },
    ],
  },
];

export const getInstructorBySlug = (slug: string) =>
  instructors.find((i) => i.slug === slug);
