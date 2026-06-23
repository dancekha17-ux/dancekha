import { useState } from "react";
import { FileSignature } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSigned: (signedAt: string) => void;
}

export function AgreementModal({ open, onOpenChange, userId, onSigned }: Props) {
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!agreed) return;
    setSaving(true);
    const nowIso = new Date().toISOString();
    const { error } = await (supabase as any)
      .from("teacher_profiles")
      .update({ agreement_signed_at: nowIso })
      .eq("user_id", userId);
    setSaving(false);
    if (error) {
      toast({ title: "簽署失敗", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "已完成簽署", description: "歡迎正式加入舞島咖引導者聚落。" });
    onSigned(nowIso);
    onOpenChange(false);
    setAgreed(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        // Make the modal non-bypassable: do not allow closing without signing
        if (!v && !saving) return;
        onOpenChange(v);
      }}
    >
      <DialogContent
        className="max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(230,57,70,0.1)", color: "#E63946" }}
            >
              <FileSignature className="w-4 h-4" />
            </span>
            <DialogTitle className="font-display text-xl">
              舞島咖 DanceKha ｜ 師資合作夥伴協議
            </DialogTitle>
          </div>
          <DialogDescription>
            請完整閱讀以下條款,勾選同意後即可開始發佈課程與活動。
          </DialogDescription>
        </DialogHeader>

        <div
          style={{
            height: "400px",
            overflowY: "scroll",
            border: "1px solid #e5e7eb",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
          }}
          className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line"
        >
{`「我們像落在這座島嶼上的沙,不需要很大,但聚在一起,就能隨著音樂掀起最美麗的浪花。」歡迎來到舞島咖的引導者聚落 Guides' Lounge。在您正式開啟舞蹈地圖、向世界分享您的文化足跡之前,請花三分鐘細讀這份基於「信任、共好與專業」的合作協議。當您勾選同意,代表我們將正式攜手,開啟一場讓世界舞動的冒險。

一、 共同的平台願景

舞島咖(以下簡稱「本平台」)致力於串聯世界各地的舞蹈藝術家與熱愛身體律動的探索者。我們珍視每位引導者老師(以下簡稱「您」)的文化底蘊與專業。本協議旨在保障雙方商務權益,建立一個透明、安全且永續的共好平台生態。

二、 身份審核與島嶼灌溉機制

真實性保障: 您承諾於平台填寫之學經歷、演出、比賽或證照檢定等履歷資料皆屬實。

💻【地圖曝光與專屬空間自主維護】: 本平台提供高質感的品牌推廣與永久免費曝光。通過進駐審核後,系統將於前端「舞遍世界」地圖點亮您的專屬橘色圓點,並建立「品牌介紹專頁」。您獲取權限後,可登入管理後台自行發佈課程與上架服務,打造高度自主的數位品牌空間。

🌱【島嶼種子計畫】: 您同意於進駐前三個月內,無償提供 5 支「初學者基礎教學短片」(每支 5 ~ 8 分鐘,含核心動作拆解與跟跳),作為平台付費會員獨享福利,同時協助您在上線初期累積核心粉絲。

三、 商業分潤與平台維運透明化機制(核心金流與稅務)

本平台採取月結分潤模式,款項結構拆分如下:

分潤與費用比例: 凡學員或消費者透過本平台完成付款之總營收(含課程、票券、空間出租等),拆分標準為:

【引導者老師所得】90%: 您的專業教學與服務報酬。
【平台營運基本費】7%: 影音串流、軟硬體系統等,使網站穩定且安全的營運成本補貼。
【第三方金流手續費】3%: 信用卡、網路轉帳等第三方金流實支實付手續費(初期預估約 3%)。

收款帳戶填寫: 您須於【個人檔案】中如實填寫銀行收款帳戶(含銀行代碼、戶名、帳號、身分證字號/統編)。

結算與發放: 平台於每月最後一日結算當月已結束與完成之服務總營收。扣除上述平台營運基本費(7%)、第三方金流費(3%)及國內跨行轉帳手續費(每筆最高 NT$15)後,於次月 10 日精確匯入您指定的撥款帳戶。(註: 非台灣境內帳戶之國際跨境轉帳手續費或電匯規費,將於當期撥款中逕行扣抵。)

💰 稅務申報與代扣繳(雙軌過渡條款): 雙方同意本平台稅務申報依發展階段採取雙軌制:

【初期個人階段】: 本平台僅提供網路系統工具,不具備稅務代理人身份,針對此階段之交易;師資團隊應自行負責相關稅務申報與繳納義務。

【後期公司階段】: 平台正式成立公司行號後,將依法按期辦理「9B 執行業務所得」扣繳申報,由平台依法代為扣繳並維護雙方權益。

四、 服務發佈與內容擔保規範

自主權與內容擔保: 平台充分尊重您的專業,您可在本平台開辦與發售實體課程、線上預錄課程、演出票券、空間出租等多元服務,並自由規劃名稱、介紹、時間與價格。您保證所提供之教學內容、編舞、音樂、講義或演出皆為原創或已取得合法授權。若引發版權糾紛,由您全權承擔相應法律責任。

安全與場地合規: 您在引導實體、線上課程、舉辦演出或進行空間出租時,有責任維護現場秩序、設備安全與參與者身體安全。如因教學疏忽、活動規劃不當或空間設備維護不良導致人員受傷或財物受損,相關法律與賠償責任由您承擔。

取消與改期義務: 服務一經刊登且有消費者購買,除不可抗力因素外,您應依約履行。如需改期或取消,須於服務開始前 48 小時通知平台與消費者,並配合平台進行後續退費或補救事宜。

五、 ⚖️ 獨立承攬合作關係

雙方明確確認本合作性質為「獨立承攬與平台撮合關係」,不構成勞基法上之僱傭、勞雇、派遣、合夥或代理關係。您享有完全的排班、定價與授課自主權,須自行處理個人之勞健保投保與退休金提撥,不得向本平台主張任何勞基法上之員工福利或雇主責任。

六、 📝 知識產權與著作權歸屬

您的著作權: 您在平台上傳、發佈的所有照片、原創編舞影片、講義、文宣等內容,其智慧財產權 100% 歸您所有。

平台的推廣授權: 您同意無償授權舞島咖於官方網站、社群媒體(Instagram、Facebook)、電子報等行銷宣傳中,合理使用您的公開簡介、劇照及教學演出精彩片段,作為平台推廣引流之用。

七、 平台守護機制(終止與合規)

若有以下情形,本平台有權暫停您的帳號、隱藏地圖點位並終止合作:

經學員或消費者檢舉且查證屬實之騷擾、歧視、或違反社會善良風俗之行為。

刻意引導學員或消費者私下交易、規避平台金流之行為。

惡意不履行進駐承諾(如未提供基礎教學影片)或經查證履歷與服務內容有嚴重偽造者。`}
        </div>

        <label className="flex items-start gap-3 mt-2 cursor-pointer select-none">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground/90 leading-relaxed">
            我已仔細閱讀並理解以上所有條款,並同意簽署成為舞島咖引導者夥伴
          </span>
        </label>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!agreed || saving}
            size="lg"
            className="text-white hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: "#E63946" }}
          >
            {saving ? "簽署中…" : "確認簽署"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
