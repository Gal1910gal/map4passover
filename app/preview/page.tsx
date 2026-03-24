"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportData } from "@/lib/payload";
import ReportTemplate from "@/components/ReportTemplate";
import InsightCard from "@/components/InsightCard";
import { CardContent } from "@/app/api/card/route";

export default function PreviewPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportData | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [canvaTemplateId, setCanvaTemplateId] = useState("");
  const [copied, setCopied] = useState(false);

  // Insight card state
  const [showCard, setShowCard] = useState(false);
  const [cardContent, setCardContent] = useState<CardContent | null>(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState("");

  // Infographic state
  const [showInfographic, setShowInfographic] = useState(false);
  const [infographicData, setInfographicData] = useState<string | null>(null);
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [infographicError, setInfographicError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("passover_report");
    if (!raw) { router.push("/"); return; }
    try { setReport(JSON.parse(raw)); } catch { router.push("/"); }
  }, [router]);

  if (!report) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#8B6348]/30 border-t-[#8B6348] rounded-full animate-spin" />
    </div>
  );

  const canvaPayload = canvaTemplateId
    ? JSON.stringify({
        brand_template_id: canvaTemplateId,
        title: `מפת 3 חודשים - ${report.firstName} ${report.lastName}`,
        data: buildCanvaData(report),
      }, null, 2)
    : JSON.stringify(buildCanvaData(report), null, 2);

  async function copyJson() {
    await navigator.clipboard.writeText(canvaPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function openCard() {
    setShowCard(true);
    if (cardContent) return; // already loaded
    setCardLoading(true);
    setCardError("");
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${report!.firstName} ${report!.lastName}`,
          gender: report!.gender,
          personalYear: report!.personalYear,
          months: report!.months.map(m => ({
            number: m.personalMonth,
            name: m.monthName,
            centralEnergy: m.centralEnergy,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "שגיאה");
      setCardContent(data as CardContent);
    } catch (err) {
      setCardError(err instanceof Error ? err.message : "שגיאה בייצור הקלף");
    } finally {
      setCardLoading(false);
    }
  }

  function printCard() {
    window.print();
  }

  async function generateInfographic() {
    setShowInfographic(true);
    if (infographicData) return;
    setInfographicLoading(true);
    setInfographicError("");
    try {
      const res = await fetch("/api/infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "שגיאה");
      setInfographicData(data.image as string);
    } catch (err) {
      setInfographicError(err instanceof Error ? err.message : "שגיאה ביצירת האינפוגרפיקה");
    } finally {
      setInfographicLoading(false);
    }
  }

  function downloadInfographic() {
    if (!infographicData) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${infographicData}`;
    link.download = `אינפוגרפיקה-${report!.firstName}-${report!.lastName}.png`;
    link.click();
  }

  function sendWhatsApp(r: ReportData) {
    const msg = [
      `שלום ${r.firstName}! ✨`,
      `המפה הנומרולוגית האישית שלך מוכנה 🌟`,
      ``,
      `📅 שנה אישית: ${r.personalYear} - ${r.yearTag}`,
      ``,
      `📆 שלושת החודשים הקרובים:`,
      ...r.months.map(m => `• ${m.monthName}: אנרגיה ${m.personalMonth} - ${m.centralEnergy}`),
      ``,
      `💛 גלית גרינשטיין | אבחון ויעוץ נומרולוגי`,
      `📞 052-2792180 | galitcoach.co.il`,
    ].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div dir="rtl">
      {/* Toolbar - hidden on print */}
      <div className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#d4b896]/40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-bold text-[#4a3728] text-sm">
              {report.firstName} {report.lastName} | שנה {report.personalYear}
            </p>
            <p className="text-[#9e7860] text-xs">{report.birthdate}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#8B6348] hover:bg-[#7a5540] text-white rounded-xl text-xs font-bold transition-all">
              🖨️ הדפס / שמור PDF
            </button>
            <button
              onClick={openCard}
              className="px-4 py-2 bg-[#4a3728] hover:bg-[#3a2a1e] text-white rounded-xl text-xs font-bold transition-all">
              🃏 קלף תובנות
            </button>
            <button
              onClick={generateInfographic}
              className="px-4 py-2 bg-[#7a5228] hover:bg-[#6a4420] text-white rounded-xl text-xs font-bold transition-all">
              🦋 אינפוגרפיקה
            </button>
            <button
              onClick={() => sendWhatsApp(report)}
              className="px-4 py-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-xl text-xs font-bold transition-all">
              📱 שלח בווטסאפ
            </button>
            <button
              onClick={() => setShowJson(!showJson)}
              className="px-4 py-2 bg-[#4a3728] hover:bg-[#3a2a1e] text-white rounded-xl text-xs font-bold transition-all">
              📋 JSON לקנבה
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-white border border-[#d4b896]/50 text-[#4a3728] rounded-xl text-xs font-bold transition-all">
              🔄 מפה חדשה
            </button>
          </div>
        </div>

        {/* Canva JSON panel */}
        {showJson && (
          <div className="max-w-3xl mx-auto mt-3 bg-[#faf7f4] rounded-2xl p-4 border border-[#d4b896]/40">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <p className="text-[#4a3728] text-xs font-semibold">Template ID (אופציונלי):</p>
              <input
                type="text"
                value={canvaTemplateId}
                onChange={e => setCanvaTemplateId(e.target.value)}
                placeholder="הדבק כאן את ה-Template ID מ-Canva"
                className="flex-1 text-xs bg-white border border-[#d4b896]/60 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8B6348] min-w-0"
              />
              <button onClick={copyJson}
                className="px-3 py-1.5 bg-[#8B6348] text-white rounded-lg text-xs font-bold whitespace-nowrap">
                {copied ? "✓ הועתק!" : "📋 העתק JSON"}
              </button>
            </div>
            <pre className="text-xs bg-white rounded-xl p-3 overflow-auto max-h-48 text-left border border-[#d4b896]/30" dir="ltr">
              {canvaPayload}
            </pre>
            <p className="text-[#9e7860] text-xs mt-2">
              💡 שתל את ה-JSON הזה בקריאת API לקנבה: <code>POST /v1/autofills</code>
            </p>
          </div>
        )}
      </div>

      {/* The actual printable report — hidden when card modal is open for print */}
      <div className={showCard ? "print-hidden" : ""}>
        <ReportTemplate report={report} />
      </div>

      {/* Insight Card Modal */}
      {showCard && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4b896]/40">
              <p className="font-bold text-[#4a3728]">🃏 קלף תובנות</p>
              <div className="flex gap-2">
                {cardContent && (
                  <button
                    onClick={printCard}
                    className="px-4 py-2 bg-[#8B6348] hover:bg-[#7a5540] text-white rounded-xl text-xs font-bold transition-all">
                    🖨️ הדפס קלף
                  </button>
                )}
                <button
                  onClick={() => setShowCard(false)}
                  className="px-4 py-2 bg-white border border-[#d4b896]/50 text-[#4a3728] rounded-xl text-xs font-bold transition-all">
                  ✕ סגור
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-5">
              {cardLoading && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="w-10 h-10 border-4 border-[#8B6348]/30 border-t-[#8B6348] rounded-full animate-spin" />
                  <p className="text-[#8B6348] text-sm">מייצר את הקלף האישי שלך...</p>
                </div>
              )}
              {cardError && (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm mb-4">{cardError}</p>
                  <button
                    onClick={() => { setCardContent(null); openCard(); }}
                    className="px-4 py-2 bg-[#8B6348] text-white rounded-xl text-xs font-bold">
                    נסה שוב
                  </button>
                </div>
              )}
              {cardContent && (
                <InsightCard
                  card={cardContent}
                  name={`${report.firstName} ${report.lastName}`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card print view — shown ONLY during print when card is open */}
      {showCard && cardContent && (
        <div className="hidden print:block">
          <InsightCard
            card={cardContent}
            name={`${report.firstName} ${report.lastName}`}
          />
        </div>
      )}

      {/* Infographic Modal */}
      {showInfographic && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4b896]/40">
              <p className="font-bold text-[#4a3728]">🦋 אינפוגרפיקה אישית</p>
              <div className="flex gap-2">
                {infographicData && (
                  <>
                    <button
                      onClick={downloadInfographic}
                      className="px-4 py-2 bg-[#8B6348] hover:bg-[#7a5540] text-white rounded-xl text-xs font-bold transition-all">
                      ⬇️ הורד PNG
                    </button>
                    <button
                      onClick={() => { setInfographicData(null); generateInfographic(); }}
                      className="px-4 py-2 bg-[#4a3728] hover:bg-[#3a2a1e] text-white rounded-xl text-xs font-bold transition-all">
                      🔄 צור מחדש
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowInfographic(false)}
                  className="px-4 py-2 bg-white border border-[#d4b896]/50 text-[#4a3728] rounded-xl text-xs font-bold transition-all">
                  ✕ סגור
                </button>
              </div>
            </div>

            <div className="p-5">
              {infographicLoading && (
                <div className="flex flex-col items-center gap-4 py-16">
                  <div className="w-12 h-12 border-4 border-[#8B6348]/30 border-t-[#8B6348] rounded-full animate-spin" />
                  <p className="text-[#8B6348] text-sm font-medium">מייצר אינפוגרפיקה... זה לוקח כ-30 שניות</p>
                </div>
              )}
              {infographicError && (
                <div className="text-center py-10">
                  <p className="text-red-600 text-sm mb-4">{infographicError}</p>
                  <button
                    onClick={() => { setInfographicData(null); generateInfographic(); }}
                    className="px-4 py-2 bg-[#8B6348] text-white rounded-xl text-xs font-bold">
                    נסה שוב
                  </button>
                </div>
              )}
              {infographicData && (
                <img
                  src={`data:image/png;base64,${infographicData}`}
                  alt="אינפוגרפיקה אישית"
                  className="w-full rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildCanvaData(report: ReportData): Record<string, { type: "text"; text: string }> {
  const data: Record<string, { type: "text"; text: string }> = {
    name:            { type: "text", text: `${report.firstName} ${report.lastName}` },
    birthdate:       { type: "text", text: report.birthdate },
    personalYear:    { type: "text", text: String(report.personalYear) },
    yearTag:         { type: "text", text: report.yearTag },
    coverIntro:      { type: "text", text: report.yearDescription },
    personalMessage: { type: "text", text: report.personalMessage },
  };
  report.months.forEach((m, idx) => {
    const n = idx + 1;
    data[`month${n}Name`]       = { type: "text", text: m.monthName };
    data[`month${n}Number`]     = { type: "text", text: String(m.personalMonth) };
    data[`month${n}Energy`]     = { type: "text", text: m.centralEnergy };
    data[`month${n}EnergyDesc`] = { type: "text", text: m.energyDescription };
    data[`month${n}Challenge`]  = { type: "text", text: m.challenge };
    data[`month${n}Challenge1`] = { type: "text", text: m.challengeItems[0] };
    data[`month${n}Challenge2`] = { type: "text", text: m.challengeItems[1] };
    m.whatToDo.forEach((action, ai) => {
      data[`month${n}ToDo${ai + 1}`] = { type: "text", text: action };
    });
    data[`month${n}Action`]    = { type: "text", text: m.preciseAction };
    data[`month${n}When`]      = { type: "text", text: m.when };
    data[`month${n}How`]       = { type: "text", text: m.how };
    data[`month${n}WithWhom`]  = { type: "text", text: m.withWhom };
    data[`month${n}Feeling`]   = { type: "text", text: m.feeling };
  });
  return data;
}
