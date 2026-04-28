export interface DanceStyle {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  functionTags: string[];
  technicalTag?: string;
  blurb: string;
}

export interface DanceRegion {
  id: string;
  label: string;
  labelEn: string;
  // approx position on a 1000x500 SVG world map (x, y)
  mapPos: { x: number; y: number };
  description: string;
  styles: DanceStyle[];
}

export const danceRegions: DanceRegion[] = [
  {
    id: "asia",
    label: "亞洲",
    labelEn: "Asia",
    mapPos: { x: 740, y: 220 },
    description: "從寺廟祭儀到都會街頭,亞洲舞蹈承載著最深厚的禮儀與最年輕的潮流。",
    styles: [
      {
        id: "kpop",
        name: "K-Pop",
        nameEn: "K-Pop",
        flag: "🇰🇷",
        functionTags: ["表演與藝術", "社交與聚會"],
        blurb: "鏡面整齊的群舞編排,首爾誕生的全球語言。",
      },
      {
        id: "classical-indian",
        name: "印度古典舞",
        nameEn: "Bharatanatyam",
        flag: "🇮🇳",
        functionTags: ["祭典與傳承", "表演與藝術"],
        blurb: "手印、眼神、節奏三位一體的千年寺廟舞蹈。",
      },
    ],
  },
  {
    id: "oceania",
    label: "大洋洲",
    labelEn: "Oceania",
    mapPos: { x: 850, y: 360 },
    description: "海風、火光、祖靈——大洋洲的舞蹈是與土地對話的方式。",
    styles: [
      {
        id: "tahitian",
        name: "大溪地舞",
        nameEn: "Ori Tahiti",
        flag: "🇵🇫",
        functionTags: ["祭典與傳承", "表演與藝術"],
        blurb: "腰臀的快速振動 Ote'a,訴說海洋與火山的故事。",
      },
      {
        id: "maori",
        name: "毛利舞",
        nameEn: "Kapa Haka",
        flag: "🇳🇿",
        functionTags: ["祭典與傳承"],
        blurb: "戰吼 Haka 與柔美 Poi,兩種能量同源於祖靈。",
      },
    ],
  },
  {
    id: "eastern-europe",
    label: "東歐與中歐",
    labelEn: "Eastern & Central Europe",
    mapPos: { x: 540, y: 175 },
    description: "草原、森林、平原——東歐舞蹈是農耕民族用身體寫下的史詩。",
    styles: [
      {
        id: "ukrainian",
        name: "烏克蘭舞蹈",
        nameEn: "Ukrainian",
        flag: "🇺🇦",
        functionTags: ["表演與藝術"],
        blurb: "男子高躍與旋轉,女子繞圈步伐描繪豐收。",
      },
      {
        id: "russian",
        name: "俄羅斯舞蹈",
        nameEn: "Russian",
        flag: "🇷🇺",
        functionTags: ["表演與藝術"],
        blurb: "Khorovod 圓圈舞與蹲跳 Prisyadka 的雙重靈魂。",
      },
      {
        id: "hungarian",
        name: "匈牙利舞蹈",
        nameEn: "Hungarian",
        flag: "🇭🇺",
        functionTags: ["祭典與傳承"],
        technicalTag: "複雜節拍",
        blurb: "Csárdás 從 Lassú 進入急速 Friss,馬扎爾人的靴跟敲擊。",
      },
    ],
  },
  {
    id: "balkans",
    label: "巴爾幹與南歐",
    labelEn: "Balkans & Southern Europe",
    mapPos: { x: 510, y: 200 },
    description: "不對稱節拍、火焰般的腳步、千年交織的文化——巴爾幹是舞蹈的露天博物館。",
    styles: [
      {
        id: "bulgarian",
        name: "保加利亞舞蹈",
        nameEn: "Bulgarian",
        flag: "🇧🇬",
        functionTags: ["祭典與傳承", "社交與聚會"],
        technicalTag: "複雜節拍",
        blurb: "Horo 圓圈舞 7/8、9/8、11/8 不對稱節拍。",
      },
      {
        id: "flamenco",
        name: "西班牙佛朗明哥",
        nameEn: "Flamenco",
        flag: "🇪🇸",
        functionTags: ["表演與藝術"],
        blurb: "安達魯西亞吉普賽人的火焰,Cante、Toque、Baile 三位一體。",
      },
    ],
  },
  {
    id: "mideast",
    label: "中東與地中海",
    labelEn: "Middle East & Mediterranean",
    mapPos: { x: 560, y: 230 },
    description: "圓圈、肩膀、腰臀——地中海岸邊的身體語言,把社群跳成一個家。",
    styles: [
      {
        id: "israeli",
        name: "以色列舞蹈",
        nameEn: "Israeli",
        flag: "🇮🇱",
        functionTags: ["社交與聚會", "祭典與傳承"],
        blurb: "Rikudei Am 集體圈舞,融合東歐、葉門與阿拉伯元素。",
      },
    ],
  },
];
