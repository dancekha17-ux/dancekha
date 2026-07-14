import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileSignature, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export const AGREEMENT_TEXT = `「我們像落在這座島嶼上的沙，不需要很大，但聚在一起，就能隨著音樂掀起最美麗的浪花。」歡迎來到舞島咖的引導者聚落 Guides' Lounge。在您正式開啟舞蹈地圖、向世界分享您的文化足跡之前，請花三分鐘細讀這份基於「信任、共好與專業」的合作協議。當您勾選同意，代表我們將正式攜手，開啟一場讓世界舞動的冒險。

一、 共同的平台願景：
舞島咖（以下簡稱「本平台」）致力於串聯世界各地的舞蹈藝術家與熱愛身體律動的探索者。我們珍視每位引導者老師（以下簡稱「您」）的文化底蘊與專業。
本平台採共創平台（Co-Creation Platform）模式運作，平台與您為共同創建內容、共享品牌影響力及推動文化發展之合作夥。本協議旨在保障雙方權益，建立透明、安全且永續的合作機制。

二、身份審核與聚落共創機制：
1.【真實身份與專業資料】
您承諾於平台提供之學經歷、教學經驗、演出、比賽、證照或其他相關資料均為真實且完整。如經查證有重大不實情形，本平台得終止合作。
2. 🏝️【引導者聚落】打造品牌專頁
本平台致力於與您共同打造兼具文化價值與品牌影響力的數位舞蹈聚落。通過進駐申請後，合作期間內，本平台將提供品牌專頁及相關數位展示服務，協助您建立專業的線上品牌形象，讓您無須自行投入網站建置與維護資源，更能專注於創作、教學與文化分享。您亦可透過管理後台自主維護內容，雙方共同累積平台內容、品牌影響力與文化價值。
3. 🌱【島嶼種子計畫】共築聚落，共享成長
我們相信，每一支教學影片，都是孕育文化聚落的一顆種子。為共同累積平台內容與文化資產，並協助您建立品牌影響力，您同意於進駐起三個月內，一次性提供 5 支優質教學短片（每支約 8 分鐘）無償授權本平台使用，作為平台付費會員專區之學習內容。本項授權僅限於平台及相關推廣用途，影片之著作權及其他智慧財產權仍歸您所有。本計畫內容由平台統一規劃與營運，會員訂閱收入主要用於平台整體維運與行銷等。平台將持續透過會員服務及品牌推廣，協助提升您的品牌曝光與後續課程發展。
 
三、 商業分潤與平台維運透明化機制(核心金流與稅務)：
1. 本平台採取月結分潤模式，款項結構說明如下：凡學員或消費者透過本平台完成付款之總營收（含課程、票券、空間出租等），拆分標準如下
A.【引導者老師所得】90%: 您的專業教學與服務報酬。
B.【平台營運基本費】7%: 影音串流、軟硬體系統等，使網站穩定且安全的營運支出補貼。
C.【第三方金流手續費】3%: 信用卡、網路轉帳等第三方金流實支實付手續費(預估 3%)。
2. 收款帳戶填寫: 您須於【個人檔案】中如實填寫銀行收款帳戶（含銀行代碼、戶名、帳號、身分證字號/統編）。
3. 結算與發放: 平台於每月最後一日結算當月已結束與完成之服務總營收。扣除上述平台營運基本費(7%)、第三方金流費(3%)及國內跨行轉帳手續費(每筆最高 NT$15)後，於次月 10 日精確匯入您指定的撥款帳戶。(註: 非台灣境內帳戶之國際跨境轉帳手續費或電匯規費,將於當期撥款中逕行扣抵。)
4. 💰 稅務申報與代扣繳(雙軌過渡條款): 雙方同意本平台稅務申報依發展階段採取雙軌制：
【初期個人階段】: 本平台僅提供網路系統工具，不具備稅務代理人身份，針對此階段之交易；引導者團隊應自行負責相關稅務申報與繳納義務。
【後期公司階段】: 平台正式成立公司行號後，將依法按期辦理「9B 執行業務所得」扣繳申報，由平台依法代為扣繳並維護雙方權益。

四、 服務發佈與內容擔保規範：
1. 自主權與內容擔保：平台充分尊重您的專業,您可在本平台開辦與發售實體課程、線上課程、演出票券、空間出租等多元服務，並自由規劃名稱、介紹、時間與價格。您保證所提供之教學內容、編舞、音樂、講義或演出皆為原創或已取得合法授權。若引發版權糾紛，由您全權承擔相應法律責任。
2. 安全與場地合規：您在引導實體、線上課程、舉辦演出或進行空間出租時，有責任維護現場秩序、設備安全與參與者身體安全。如因教學疏忽、活動規劃不當或空間設備維護不良導致人員受傷或財物受損，相關法律與賠償責任由您承擔。
3. 取消與改期義務：服務一經刊登且有消費者購買，除不可抗力因素外，您應依約履行。如需改期或取消，須於服務開始前 48 小時通知平台與消費者，並配合平台進行後續退費或補救事宜。

五、⚖️ 獨立承攬合作關係：
雙方明確確認本合作性質為「獨立承攬與平台撮合關係」,不構成勞基法上之僱傭、勞雇、派遣、合夥或代理關係。您享有完全的排班、定價與授課自主權,須自行處理個人之勞健保投保與退休金提撥,不得向本平台主張任何勞基法上之員工福利或雇主責任。

六、📝 知識產權與著作權歸屬：
1. 您的著作權: 您在平台上傳、發佈的所有照片、原創編舞影片、講義、文宣等內容,其智慧財產權 100% 歸您所有。
2. 平台的推廣授權: 您同意無償授權舞島咖於官方網站、社群媒體(Instagram、Facebook)、電子報等行銷宣傳中，合理使用您的公開簡介、劇照及教學演出精彩片段，作為平台推廣引流之用。

七、 平台有權調整功能：
平台得因技術發展、法令變更或營運需求，適時調整網站功能、介面、會員服務內容或系統流程，並以不影響雙方合作目的為原則。

八、個人資料保護：
雙方同意遵守相關個人資料保護法令。本平台將依營運目的蒐集、處理及利用您所提供之必要資料，並採取合理之資訊安全措施。您因課程、活動或其他服務而合法取得學員之個人資料者，得於提供課程服務、學員關係維護、活動通知、品牌經營及相關招生推廣等合理範圍內使用，但應遵守個人資料保護相關法令，不得將學員資料出售、轉讓予第三人，或作為與原蒐集目的顯著不符之用途。

九、若因天災、政府命令、疫情、網路中斷、第三方服務故障或其他不可抗力因素，致本平台或引導者無法履行部分或全部義務者，雙方互不負違約責任，並應盡合理努力降低損害。
十、本平台得因法令修正、營運需求或服務調整，適時修訂本協議內容，並公告於平台。修訂內容自公告日起生效；如涉及重大影響雙方權益之事項，平台將以適當方式通知您。

十一、共同守護聚落：
為維護所有引導者、會員及平台之共同權益，若有下列情形，本平台得視情節暫停合作、隱藏品牌頁面或終止合作。
1. 提供重大不實資料。
2. 騷擾、歧視或其他違法行為。
3. 刻意引導學員私下交易，規避平台交易機制者。
4. 未履行合作承諾且經通知仍未改善。
5. 嚴重損害平台品牌聲譽或其他合作夥伴權益之行為。`;

export default function AgreementPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/teacher/login", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("teacher_profiles")
        .select("agreement_signed_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.agreement_signed_at) setSignedAt(data.agreement_signed_at);
    })();
  }, [user]);

  const handleConfirm = async () => {
    if (!agreed || !user) return;
    setSaving(true);
    const nowIso = new Date().toISOString();
    const { error } = await (supabase as any)
      .from("teacher_profiles")
      .update({ agreement_signed_at: nowIso })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "簽署失敗", description: error.message, variant: "destructive" });
      return;
    }
    setSignedAt(nowIso);
    toast({ title: "已完成簽署", description: "歡迎正式加入舞島咖引導者聚落。" });
    setTimeout(() => navigate("/teacher/dashboard#courses"), 600);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5E6" }}>
      <header className="border-b border-[#E63946]/10 bg-[#FFF5E6]/90 backdrop-blur sticky top-0 z-40">
        <div className="container-wide mx-auto h-16 flex items-center justify-between gap-3">
          <Link to="/teacher/dashboard" className="flex items-center gap-2 text-foreground/70 hover:text-[#E63946] transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回後台</span>
          </Link>
          <span className="font-display text-base text-gradient">舞島咖 DanceKha</span>
          <span className="w-20" />
        </div>
      </header>

      <main className="container-wide mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(230,57,70,0.1)", color: "#E63946" }}
          >
            <FileSignature className="w-5 h-5" />
          </span>
          <div>
            <span className="eyebrow" style={{ color: "#E63946" }}>Step 2 · Onboarding</span>
            <h1 className="font-display text-2xl md:text-3xl text-foreground mt-1">
              師資合作夥伴協議
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          請完整閱讀以下條款,勾選同意後即可開放發佈課程與多元服務的權限。
        </p>

        {signedAt && (
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 border bg-success/5 border-success/30 text-success">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-medium">您已於 {new Date(signedAt).toLocaleString("zh-TW")} 完成簽署</p>
              <p className="text-foreground/70 mt-0.5">
                可前往
                <Link to="/teacher/dashboard#courses" className="underline mx-1 text-[#E63946]">
                  課程與活動管理
                </Link>
                開始發佈服務。
              </p>
            </div>
          </div>
        )}

        <div
          className="rounded-2xl border border-border bg-white p-6 text-sm leading-relaxed text-foreground/85 whitespace-pre-line shadow-soft"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {AGREEMENT_TEXT}
        </div>

        {!signedAt && (
          <>
            <label className="flex items-start gap-3 mt-6 cursor-pointer select-none">
              <Checkbox
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground/90 leading-relaxed">
                我已仔細閱讀並理解以上所有條款,並同意簽署成為舞島咖引導者夥伴
              </span>
            </label>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleConfirm}
                disabled={!agreed || saving}
                size="lg"
                className="text-white hover:opacity-90 sm:flex-1"
                style={{ backgroundColor: "#E63946" }}
              >
                {saving ? "簽署中…" : "確認簽署並啟用發布權限"}
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/teacher/dashboard">稍後再簽</Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}