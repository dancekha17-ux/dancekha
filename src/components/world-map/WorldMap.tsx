import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import worldMapAsset from "@/assets/world-map.jpg.asset.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";


/**
 * 互動式世界舞蹈地圖
 * Phase 2 + 校正：z-index 修正、座標重新校準、卡片資訊整合師資篩選。
 */

interface MapRegion {
  id: string;
  name: string;
  country: string;
  dance: string;
  desc: string;
  queryParam: string;
  /** 用於比對 instructors 的關鍵字（region / specialty / dance_styles） */
  keywords: string[];
  /** 地理經緯度（新的座標驅動來源） */
  lat?: number;
  lng?: number;
  /** 手繪地圖藝術變形的手動校準（百分比 offset） */
  offsetX?: number;
  offsetY?: number;
  /** 舊版寫死的百分比座標（作為 fallback，直到全部改為經緯度） */
  top?: string;
  left?: string;
}

/**
 * 將地理經緯度換算為手繪地圖圖片上的 X/Y 百分比座標。
 * 使用等距圓柱投影 (Equirectangular)。
 * 由於手繪地圖比例並非標準地理投影，需以每筆資料的 offsetX/offsetY 進行藝術微調。
 */
export function latLngToMapPercent(
  lat: number,
  lng: number,
  offsetX = 0,
  offsetY = 0,
): { left: string; top: string } {
  const x = ((lng + 180) / 360) * 100 + offsetX;
  const y = ((90 - lat) / 180) * 100 + offsetY;
  return { left: `${x}%`, top: `${y}%` };
}

const MAP_REGIONS: MapRegion[] = [
  // --- ASIA ---
  // ✅ 測試資料：使用經緯度 + 手繪地圖校準 offset
  { id: "taiwan",   name: "台灣",   lat: 23.9738,  lng: 120.9820,  offsetX: -3.1, offsetY: 15.3, country: "台灣", dance: "原住民樂舞 & 傳統藝陣", desc: "凝聚大地的呼喚，在踏地重擊的舞步與複音歌聲中，傳承部落與土地的古老記憶。", queryParam: "Taiwan", keywords: ["台灣", "Taiwan", "原住民", "藝陣"] },
  { id: "china",    name: "中國",   lat: 35.8617,  lng: 104.1954,  offsetX: -3.9, offsetY: 11.9, country: "中國", dance: "古典舞 & 民族民間舞", desc: "長袖飛舞、水袖弄影，在行雲流水的吐納與身韻間，展現東方身體的寫意美學。", queryParam: "China", keywords: ["中國", "China", "古典舞", "民族"] },
  { id: "japan", name: "日本", top: "45%", left: "83%", country: "日本", dance: "阿波舞 & 日本舞踊", desc: "在夏日祭典的純粹節奏中，手舞足蹈地跳起跨越生死界限、極具狂歡張力的傻瓜之舞。", queryParam: "Japan", keywords: ["日本", "Japan", "阿波", "舞踊"] },
  { id: "korea", name: "韓國", top: "43%", left: "80%", country: "韓國", dance: "傳統舞踊 & K-Pop", desc: "在宮廷扇子舞的優雅呼吸，與現代街頭極致律動間完美共存的獨特身體語言。", queryParam: "Korea", keywords: ["韓國", "Korea", "K-Pop", "Kpop"] },
  { id: "malaysia", name: "馬來西亞", top: "61%", left: "78%", country: "馬來西亞", dance: "馬來傳統舞 Zapin", desc: "手鼓與烏德琴奏響，在克制而優雅的足尖滑步與旋轉中，傳唱海洋絲路的歷史。", queryParam: "Malaysia", keywords: ["馬來", "Malaysia", "Zapin"] },
  { id: "indonesia", name: "印尼", top: "66%", left: "83%", country: "印尼", dance: "克差舞 & 列貢舞 Kecak", desc: "千百人齊聲「察」鳴，在神話的指尖顫動與眼神流轉中，勾勒熱帶島嶼的信仰印記。", queryParam: "Indonesia", keywords: ["印尼", "Indonesia", "Kecak", "Legong"] },
  { id: "philippines", name: "菲律賓", top: "58%", left: "81.5%", country: "菲律賓", dance: "竹竿舞 Tinikling", desc: "在交錯開合的竹竿間輕盈躍動、飛速閃避，展現如森林候鳥般的靈敏與歡騰生命力。", queryParam: "Philippines", keywords: ["菲律賓", "Philippines", "Tinikling"] },
  { id: "thailand", name: "泰國", top: "56%", left: "78%", country: "泰國", dance: "箜舞 Khon & 傳統圓圈舞", desc: "戴上面具化身羅摩史詩，在雙手反折、極致緩慢的優雅張力中訴說神祇的傳說。", queryParam: "Thailand", keywords: ["泰國", "Thailand", "Khon"] },
  { id: "india", name: "印度", top: "53%", left: "70%", country: "印度", dance: "奧迪西舞 Odissi", desc: "刻進神廟的千年舞姿，從方正穩健的 Chauka 到優雅流動的三道彎曲線，於剛柔之間舞出細膩與典雅。", queryParam: "India", keywords: ["印度", "India", "Bhangra", "Bharatanatyam"] },
  { id: "middle_east", name: "中東與北非", top: "50%", left: "57%", country: "中東與北非", dance: "東方舞 Belly Dance", desc: "如水蛇般擺動的腰臀、流暢的腹部抖動，在手鼓敲擊中喚醒遠古大地的母神力量。", queryParam: "MiddleEast", keywords: ["中東", "肚皮舞", "Belly", "Oriental"] },
  { id: "israel", name: "以色列", top: "47%", left: "54.5%", country: "以色列", dance: "霍拉圓圈舞 Hora", desc: "手拉手並肩跳躍，在同一個圓圈中凝聚力量，踏出古老民族重生與希望的集體步伐。", queryParam: "Israel", keywords: ["以色列", "Israel", "Hora"] },

  // --- EUROPE ---
  { id: "scotland", name: "蘇格蘭", top: "32%", left: "50%", country: "蘇格蘭 / 北歐", dance: "Scottish Country Dance & Highland Dance", desc: "在悠揚的風笛聲中昂首踮足，於菱形劍鋒之間靈巧跳躍，舞出高地民族的驕傲與優雅秩序。", queryParam: "Scotland", keywords: ["蘇格蘭", "Scotland", "Highland", "Scottish Country", "北歐"] },
  { id: "ireland", name: "愛爾蘭", top: "35%", left: "48.5%", country: "愛爾蘭", dance: "踢踏舞 Irish Step Dance", desc: "上半身挺拔如松，雙腳如機關槍般迅猛擊打地面，釋放愛爾蘭風笛最極致的狂熱。", queryParam: "Ireland", keywords: ["愛爾蘭", "Ireland", "Irish", "踢踏"] },
  { id: "spain", name: "西班牙 · 安達魯西亞", top: "45%", left: "46%", country: "西班牙 · 安達魯西亞", dance: "弗拉明戈 Flamenco", desc: "熱情奔放的吉普賽靈魂，用強烈的腳步聲與吉他擊碎深夜的寂靜。", queryParam: "Spain", keywords: ["西班牙", "Spain", "Flamenco", "佛朗明哥", "弗拉明戈"] },
  { id: "italy", name: "義大利", top: "44%", left: "50.5%", country: "義大利", dance: "塔蘭泰拉 Tarantella", desc: "源自義大利南部的解毒之舞，在極速的鈴鼓聲與狂亂旋轉中釋放身體能量與壓抑。", queryParam: "Italy", keywords: ["義大利", "Italy", "Tarantella"] },
  { id: "hungary", name: "匈牙利", top: "41%", left: "52%", country: "匈牙利 / 中歐", dance: "Csárdás 查爾達斯", desc: "從緩板優雅的「Lassú」逐漸燃燒成飛速旋轉的「Friss」，跳出馬札爾民族最熾熱的激情。", queryParam: "Hungary", keywords: ["匈牙利", "Hungary", "Csardas", "查爾達斯", "中歐"] },
  { id: "bulgaria", name: "保加利亞", top: "43%", left: "53.5%", country: "保加利亞 / 巴爾幹", dance: "Horo (Хоро) 圓圈舞", desc: "在 7/8、11/16 等不對稱節拍中手牽手疾走跳躍，是巴爾幹村落生生不息的集體脈動。", queryParam: "Bulgaria", keywords: ["保加利亞", "Bulgaria", "Horo", "Хоро", "巴爾幹"] },
  { id: "greece", name: "希臘", top: "46%", left: "53.5%", country: "希臘", dance: "Sirtaki 西塔基", desc: "從緩慢的肩搭肩起步，逐步加速躍動，在布祖基琴聲中跳出希臘人對生命的歡愉與釋放。", queryParam: "Greece", keywords: ["希臘", "Greece", "Sirtaki", "西塔基"] },
  { id: "ukraine", name: "烏克蘭", top: "39.5%", left: "56%", country: "烏克蘭", dance: "霍巴克 Hopak", desc: "奔放的哥薩克跳躍，在大草原上舞動出自由與生命的韌性。", queryParam: "Ukraine", keywords: ["烏克蘭", "Ukraine", "Hopak"] },
  { id: "russia", name: "俄羅斯", top: "32%", left: "62%", country: "俄羅斯", dance: "Cossack Dance & Kalinka", desc: "壓低重心彈跳、踢腿、旋轉——哥薩克戰舞與卡林卡的歡騰，唱出西伯利亞凍土上不滅的火焰。", queryParam: "Russia", keywords: ["俄羅斯", "Russia", "Cossack", "Kalinka", "哥薩克"] },

  // --- AMERICAS ---
  { id: "usa", name: "美國", top: "41%", left: "20%", country: "美國 / 北美洲", dance: "Contra Dance、Square Dance、爵士與街頭舞", desc: "從新英格蘭穀倉裡的方塊舞與康特拉舞，到紐奧良的爵士與布朗克斯的街舞，跳出新大陸的自由節奏。", queryParam: "USA", keywords: ["美國", "USA", "Contra", "Square Dance", "方塊舞", "Jazz", "Swing", "Hip Hop"] },
  { id: "mexico", name: "墨西哥", top: "53%", left: "19.5%", country: "墨西哥", dance: "草帽舞 Jarabe Tapatío", desc: "色彩斑斕的寬大長裙如花朵般在足尖叩擊聲中綻放，跳出墨西哥式對生活的熱烈歌頌。", queryParam: "Mexico", keywords: ["墨西哥", "Mexico", "Jarabe"] },
  { id: "brazil", name: "巴西", top: "68%", left: "34%", country: "巴西", dance: "桑巴 & 卡波耶拉戰舞", desc: "狂歡節的熱情桑巴，與揉合武術、體操的非裔巴西戰舞，用肉體釋放無可比擬的能量。", queryParam: "Brazil", keywords: ["巴西", "Brazil", "Samba", "桑巴", "Capoeira"] },
  { id: "argentina", name: "阿根廷", top: "82%", left: "31%", country: "阿根廷", dance: "探戈 Argentine Tango", desc: "暗夜裡纏綿交錯的雙鞋、緊密相貼的呼吸，在手風琴的憂傷中跳一場無聲的戀愛戲劇。", queryParam: "Argentina", keywords: ["阿根廷", "Argentina", "Tango", "探戈"] },

  // --- OCEANIA & AFRICA ---
  // ✅ 測試資料：紐西蘭北島 — 以經緯度 + 校準 offset 精準落在北島陸地
  { id: "new_zealand", name: "紐西蘭 · 北島", lat: -40.9006, lng: 174.8860, offsetX: -11.5, offsetY: 6.0, country: "紐西蘭 · 北島", dance: "毛利戰舞 Haka", desc: "搥胸、跺足、瞪目狂呼！以最震撼原始的身體張力展現毛利戰士的靈魂與對生命的敬畏。", queryParam: "NewZealand", keywords: ["紐西蘭", "New Zealand", "Haka", "毛利"] },
  // ✅ 測試資料：夏威夷
  { id: "hawaii",      name: "夏威夷",       lat: 19.8968,  lng: -155.5828, offsetX: 0.7,  offsetY: 10.1, country: "夏威夷", dance: "呼拉舞 Hula & 傳統 Mele", desc: "手掌如浪花起伏、如椰林搖曳，在尤克里里與傳統頌歌（Mele）中傳遞大自然與愛的神聖低語。", queryParam: "Hawaii", keywords: ["夏威夷", "Hawaii", "Hula", "呼拉", "Mele"] },
  { id: "west_africa", name: "西非", top: "57%", left: "49%", country: "西非", dance: "曼丁舞蹈 Manding", desc: "在非洲之鼓（Djembe）最狂野狂熱的撞擊聲下，赤腳踏響大地，用最純粹的身體律動釋放生命力。", queryParam: "WestAfrica", keywords: ["西非", "West Africa", "Manding", "非洲"] },
];

/** 計算 region 最終渲染的百分比座標。優先使用經緯度 + offset，否則 fallback 到舊 top/left。 */
function getRegionPosition(region: MapRegion): { top: string; left: string } {
  if (typeof region.lat === "number" && typeof region.lng === "number") {
    return latLngToMapPercent(region.lat, region.lng, region.offsetX ?? 0, region.offsetY ?? 0);
  }
  return { top: region.top ?? "50%", left: region.left ?? "50%" };
}

interface MapInstructor {
  slug: string;
  name: string;
  specialty: string | null;
  region: string | null;
  dance_styles: string[] | null;
}

interface RegionCardProps {
  region: MapRegion;
  instructors: MapInstructor[];
  onExplore: (region: MapRegion) => void;
  onClose?: () => void;
  floating?: boolean;
  style?: React.CSSProperties;
}

function RegionCard({ region, instructors, onExplore, onClose, floating, style }: RegionCardProps) {
  return (
    <div
      style={style}
      className={`${
        floating ? "absolute z-50 w-72 -translate-x-1/2" : "relative w-full max-w-md mx-auto mt-6 z-50"
      } rounded-2xl shadow-[0_20px_50px_-15px_rgba(30,41,59,0.35)] bg-[#FBF5EC] border border-[#E8DCC4] p-5 animate-fade-in`}
    >
      {onClose && (
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <p className="text-xs font-body uppercase tracking-widest text-[#E36435] mb-1">
        {region.country}
      </p>
      <h4 className="text-lg font-display font-semibold text-slate-800 mb-2">
        {region.dance}
      </h4>
      <p className="text-sm text-slate-600 font-body leading-relaxed mb-3">
        {region.desc}
      </p>
      <div className="text-xs font-body text-slate-500 bg-[#F3E9D7]/60 rounded-md px-3 py-2 mb-3 leading-relaxed">
        <span className="text-[#9C5A2E] font-medium">舞種發源地：</span>{region.country}
        <span className="mx-1.5 text-slate-300">|</span>
        <span className="text-[#9C5A2E] font-medium">實體授課地：</span>依老師而定
      </div>

      {/* 關聯師資 */}
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-widest text-[#9C5A2E] font-medium mb-1.5">
          關聯引導者
        </p>
        {instructors.length > 0 ? (
          <ul className="space-y-1 max-h-32 overflow-auto pr-1">
            {instructors.slice(0, 6).map((i) => (
              <li key={i.slug}>
                <Link
                  to={`/instructors/${i.slug}`}
                  className="text-sm text-slate-700 hover:text-[#E36435] underline-offset-2 hover:underline transition-colors"
                >
                  · {i.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic">尚無引導者，期待第一位開課老師。</p>
        )}
      </div>

      <button
        onClick={() => onExplore(region)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E36435] text-white text-sm font-medium hover:bg-[#c95628] transition-all hover:gap-2.5 shadow-sm"
      >
        探索此區課程
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}


export function WorldMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [allInstructors, setAllInstructors] = useState<MapInstructor[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    (supabase as any)
      .from("teacher_profiles")
      .select("slug,name,specialty,region,dance_styles")
      .eq("is_approved", true)
      .not("slug", "is", null)
      .then(({ data }: any) => setAllInstructors((data as MapInstructor[]) ?? []));
  }, []);

  const activeRegion = MAP_REGIONS.find((r) => r.id === activeId) ?? null;

  const matchInstructors = (region: MapRegion): MapInstructor[] => {
    // 只比對「專長」(specialty + dance_styles)，不限老師的實體授課地點 (region)。
    const kws = region.keywords.map((k) => k.toLowerCase()).filter(Boolean);
    return allInstructors.filter((i) => {
      const hay = `${i.specialty ?? ""} ${(i.dance_styles ?? []).join(" ")}`.toLowerCase();
      return kws.some((k) => hay.includes(k));
    });
  };

  const handleExplore = (region: MapRegion) => {
    navigate(`/?region=${encodeURIComponent(region.queryParam)}#instructors`);
    setTimeout(() => {
      const el = document.getElementById("instructors");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="relative w-full overflow-visible">
        <img
          src={worldMapAsset.url}
          alt="世界舞蹈地圖"
          className="w-full h-auto block select-none rounded-lg"
          draggable={false}
        />

        {MAP_REGIONS.map((region) => {
          const isActive = activeId === region.id;
          const pos = getRegionPosition(region);
          return (
            <div
              key={region.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: pos.top, left: pos.left, zIndex: isActive ? 50 : 10 }}
            >
              <button
                type="button"
                aria-label={region.name}
                onMouseEnter={() => !isMobile && setActiveId(region.id)}
                onClick={() => setActiveId(isActive ? null : region.id)}
                className="relative w-6 h-6 flex items-center justify-center group focus:outline-none"
              >
                <span className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-500/40 [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-orange-500/30" />
                <span
                  className={`relative block w-2.5 h-2.5 rounded-full bg-[#E36435] ring-2 ring-white/80 shadow-[0_0_8px_rgba(227,100,53,0.7)] transition-transform ${
                    isActive ? "scale-150" : "group-hover:scale-125"
                  }`}
                />
              </button>




              {/* Desktop: floating card near pin */}
              {!isMobile && isActive && activeRegion?.id === region.id && (
                <RegionCard
                  region={region}
                  instructors={matchInstructors(region)}
                  onExplore={handleExplore}
                  onClose={() => setActiveId(null)}
                  floating
                  style={{ top: "20px", left: "50%" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: card below map */}
      {isMobile && activeRegion && (
        <RegionCard
          region={activeRegion}
          instructors={matchInstructors(activeRegion)}
          onExplore={handleExplore}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}


export { MAP_REGIONS };
