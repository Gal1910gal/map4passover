/**
 * HTML preview of the numerology report — printable as A4 PDF via browser.
 * Strategy: cover = 1 page, each month = 2 pages, closing = 1 page.
 * Total: 8 pages (1 cover + 6 month + 1 closing).
 *
 * IMPORTANT: every sm: size increase must have a matching print: override
 * so that responsive sizes don't overflow the printed A4 page.
 */
import Image from "next/image";
import { ReportData } from "@/lib/payload";

interface Props { report: ReportData }

// ─── helpers ───────────────────────────────────────────────
function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`print-page bg-[#f5f0ea] w-full max-w-3xl mx-auto px-4 sm:px-10 print:px-8 py-6 print:py-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <div className="inline-block bg-[#d4b896] text-[#4a3728] text-xs font-bold px-3 py-1 sm:px-4 sm:py-1.5 print:px-3 print:py-1 rounded-full mb-2 shadow-sm print:shadow-none">
      {label}
    </div>
  );
}

function Divider() {
  return <div className="border-t-2 border-[#d4b896]/60 my-5" />;
}

// ─── Cover Page ─────────────────────────────────────────────
function CoverPage({ report }: { report: ReportData }) {
  return (
    <Page>
      {/* Logo + Title */}
      <div className="text-center mb-6 pt-2">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="לוגו גלית גרינשטיין" width={90} height={90} className="object-contain" />
        </div>
        <h1 className="text-3xl sm:text-4xl print:text-4xl font-bold text-[#4a3728] mb-1">ערכת השנה שלי</h1>
        <p className="text-[#7c5c47] text-lg sm:text-xl print:text-xl font-semibold">מפת 3 חודשים אישית</p>
        <p className="text-[#8B6348] text-sm print:text-sm mt-2 font-medium">
          שלושת החודשים הקרובים לא מבקשים ממך לדעת הכל - הם מבקשים ממך לפעול נכון בתוך מה שיש.
        </p>
      </div>

      <Divider />

      {/* Client info boxes */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 print:gap-3 mb-5">
        {[
          { label: "שם", value: `${report.firstName} ${report.lastName}`.trim() },
          { label: "תאריך לידה", value: report.birthdate },
          { label: "שנה אישית", value: String(report.personalYear) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#e8ddd2] rounded-2xl p-3 text-center border-2 border-[#c9a98a]/60 shadow-sm print:shadow-none">
            <p className="text-[#8B6348] text-xs font-bold mb-1">{label}</p>
            <p className="text-[#4a3728] font-bold text-lg print:text-lg leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* What I see in you now */}
      <div className="bg-white/80 rounded-2xl p-4 sm:p-5 print:p-4 border-2 border-[#d4b896]/60 mb-5 shadow-sm print:shadow-none">
        <p className="text-[#8B6348] text-sm font-bold mb-2">מה אני רואה אצלך עכשיו:</p>
        <p className="text-[#4a3728] leading-relaxed text-sm print:text-sm">{report.yearDescription}</p>
      </div>

      {/* 3 months overview */}
      <p className="text-[#4a3728] text-sm font-bold mb-3 text-center">מה צפוי לך ב-3 החודשים הבאים:</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 print:gap-3">
        {report.months.map((m, i) => {
          const dotColors = ["bg-[#8B6348]", "bg-[#4a7a4a]", "bg-[#4a4a7a]"];
          const bgColors = ["bg-[#8B6348]/15 border-[#8B6348]/40", "bg-[#4a7a4a]/15 border-[#4a7a4a]/40", "bg-[#4a4a7a]/15 border-[#4a4a7a]/40"];
          const textColors = ["text-[#8B6348]", "text-[#4a7a4a]", "text-[#4a4a7a]"];
          return (
            <div key={i} className={`rounded-2xl p-3 text-center border-2 shadow-sm print:shadow-none ${bgColors[i % 3]}`}>
              <div className={`${dotColors[i % 3]} text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 print:w-10 print:h-10 flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-md print:shadow-none`}>
                {m.personalMonth}
              </div>
              <p className={`font-bold text-sm print:text-sm ${textColors[i % 3]}`}>{m.monthName}</p>
              <p className="text-[#5a3e2b] text-xs print:text-xs font-medium mt-0.5">{m.centralEnergy}</p>
            </div>
          );
        })}
      </div>

    </Page>
  );
}

// ─── Month Pages (2 print pages per month) ──────────────────
const MONTH_COLORS = [
  { dot: "bg-[#8B6348]", accent: "text-[#8B6348]", bg: "bg-[#8B6348]/15 border-[#8B6348]/40" },
  { dot: "bg-[#4a7a4a]", accent: "text-[#4a7a4a]", bg: "bg-[#4a7a4a]/15 border-[#4a7a4a]/40" },
  { dot: "bg-[#4a4a7a]", accent: "text-[#4a4a7a]", bg: "bg-[#4a4a7a]/15 border-[#4a4a7a]/40" },
];

function MonthPage({ month, idx, gender }: { month: ReportData["months"][0]; idx: number; gender: "female" | "male" }) {
  const c = MONTH_COLORS[idx % 3];
  const challengeHow = gender === "female"
    ? ["כשאת מזהה את הדפוס - את כבר לא בתוכו", "עצרי ושאלי: \"מה אני באמת צריכה עכשיו?\"", "זכרי: האתגר הוא זמני", "חזרי אל הפעולה המדויקת שלך"]
    : ["כשאתה מזהה את הדפוס - אתה כבר לא בתוכו", "עצור ושאל: \"מה אני באמת צריך עכשיו?\"", "זכור: האתגר הוא זמני", "חזור אל הפעולה המדויקת שלך"];

  return (
    <>
      {/* ── Month print page 1: header + energy + challenge ── */}
      <Page className="page-break">
        {/* Month header */}
        <div className={`rounded-2xl border-2 p-4 mb-5 shadow-sm print:shadow-none ${c.bg}`}>
          <div className="flex items-center gap-4">
            <div className={`${c.dot} text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow-md print:shadow-none`}>
              {month.personalMonth}
            </div>
            <div>
              <SectionTag label="חודשים" />
              <h2 className={`text-2xl font-bold ${c.accent}`}>
                {month.monthName} | מספר {month.personalMonth}
              </h2>
              <p className="text-[#7c5c47] text-sm">כל חודש נושא אנרגיה ייחודית המגיעה מהמספר האישי שלו.</p>
            </div>
          </div>

          {/* Quick summary grid */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/80 rounded-xl p-2.5 shadow-sm print:shadow-none">
              <p className="text-[#9e7860] text-xs font-bold">🌟 אנרגיה מרכזית</p>
              <p className={`font-bold ${c.accent} text-sm mt-0.5`}>{month.centralEnergy}</p>
            </div>
            <div className="bg-white/80 rounded-xl p-2.5 shadow-sm print:shadow-none">
              <p className="text-[#9e7860] text-xs font-bold">⚠️ אתגר אפשרי</p>
              <p className="font-bold text-[#4a3728] text-sm mt-0.5">{month.challenge}</p>
            </div>
          </div>
        </div>

        {/* Central energy */}
        <div className="mb-5">
          <SectionTag label="אנרגיה מרכזית" />
          <h3 className="text-xl font-bold text-[#4a3728] mb-2">האנרגיה שמניעה את החודש</h3>
          <div className="bg-[#e8ddd2] rounded-2xl p-4 border border-[#c9a98a]/50 shadow-sm print:shadow-none">
            <p className="text-[#8B6348] font-bold text-xs mb-1">האנרגיה של החודש:</p>
            <p className={`font-bold text-base ${c.accent} mb-1`}>{month.centralEnergy}</p>
            <p className="text-[#4a3728] leading-relaxed text-sm">{month.energyDescription}</p>
          </div>
        </div>

        {/* Challenge */}
        <div>
          <SectionTag label="אתגר אפשרי" />
          <h3 className="text-xl font-bold text-[#4a3728] mb-2">מה עשוי להגיע כאתגר</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fff8e7] rounded-2xl p-4 border-2 border-amber-300/60 shadow-sm print:shadow-none">
              <p className="text-amber-700 font-bold text-xs mb-2">לשים לב ל:</p>
              <ul className="space-y-1.5">
                {month.challengeItems.map((item, i) => (
                  <li key={i} className="text-[#4a3728] text-sm flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none">
              <p className="text-[#7c5c47] font-bold text-xs mb-2">איך להתמודד:</p>
              <ul className="space-y-1 text-xs text-[#4a3728]">
                {challengeHow.map((line, i) => (
                  <li key={i} className="font-medium">• {line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Page>

      {/* ── Month print page 2: what-to-do + precise action ── */}
      <Page className="page-break">
        {/* Month mini-header for context */}
        <div className={`rounded-xl border-2 px-4 py-2 mb-5 flex items-center gap-3 shadow-sm print:shadow-none ${c.bg}`}>
          <div className={`${c.dot} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-base flex-shrink-0 shadow-md print:shadow-none`}>
            {month.personalMonth}
          </div>
          <p className={`font-bold ${c.accent} text-base`}>{month.monthName} - המשך</p>
        </div>

        {/* What to do */}
        <div className="mb-5">
          <SectionTag label="מה כן לעשות" />
          <h3 className="text-xl font-bold text-[#4a3728] mb-2">כיוונים לפעולה נכונה</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 print:gap-3">
            {[0, 2, 4].map(i => (
              <div key={i} className="bg-white/80 rounded-xl p-3 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none">
                <p className="text-[#4a3728] text-sm mb-1 flex items-start gap-1">
                  <span className={`${c.accent} font-bold flex-shrink-0`}>←</span>
                  <span className="font-medium">{month.whatToDo[i]}</span>
                </p>
                <p className="text-[#4a3728] text-sm flex items-start gap-1">
                  <span className={`${c.accent} font-bold flex-shrink-0`}>←</span>
                  <span className="font-medium">{month.whatToDo[i + 1]}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Precise action */}
        <div>
          <SectionTag label="פעולה מדויקת" />
          <h3 className="text-xl font-bold text-[#4a3728] mb-2">הצעד האחד שלך לחודש זה</h3>
          <div className="bg-[#e8ddd2] rounded-2xl p-4 mb-3 border border-[#c9a98a]/50 shadow-sm print:shadow-none">
            <p className="text-[#8B6348] text-xs font-bold mb-1">🎯 הפעולה שלי לחודש:</p>
            <p className="text-[#4a3728] font-bold">{month.preciseAction}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 print:gap-3 mb-3">
            {[
              { label: "מתי?", val: month.when },
              { label: "איך?", val: month.how },
              { label: "עם מי?", val: month.withWhom },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#e8ddd2] rounded-xl p-3 text-center border border-[#c9a98a]/40 shadow-sm print:shadow-none">
                <p className="text-[#8B6348] text-xs font-bold mb-1">{label}</p>
                <p className="text-[#4a3728] text-xs font-medium">{val}</p>
              </div>
            ))}
          </div>
          <p className="text-[#7c5c47] text-sm italic font-semibold">👉 אם עשיתי - {month.feeling}</p>
        </div>
      </Page>
    </>
  );
}

// ─── Personal Message Page ───────────────────────────────────
function MessagePage({ report }: { report: ReportData }) {
  return (
    <Page className="page-break">
      <div className="flex flex-col items-center justify-center py-8 sm:py-10 print:py-10">
        <SectionTag label="מסר אישי" />
        <h2 className="text-2xl sm:text-3xl print:text-3xl font-bold text-[#4a3728] mb-6">מסר אישי עבורך</h2>
        <div className="bg-white/80 rounded-2xl p-5 sm:p-6 print:p-6 border-2 border-[#d4b896]/50 mb-5 max-w-xl w-full shadow-sm print:shadow-none">
          <p className="text-[#4a3728] leading-relaxed text-sm sm:text-base print:text-base">{report.personalMessage}</p>
        </div>
        <div className="bg-[#e8ddd2] rounded-2xl p-4 max-w-xl w-full text-center border border-[#c9a98a]/40 shadow-sm print:shadow-none">
          <p className="text-[#7c5c47] text-sm font-semibold italic">
            💛 הנומרולוגיה לא קובעת את גורלך - היא מאירה את הדרך. {report.gender === "female" ? "את זו שבוחרת" : "אתה זה שבוחר"} איך ללכת.
          </p>
        </div>
      </div>

      {/* Closing */}
      <Divider />
      <div className="text-center">
        <p className="text-[#4a3728] font-bold text-lg mb-1">גלית גרינשטיין</p>
        <p className="text-[#9e7860] text-sm">אבחון ויעוץ נומרולוגי</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 print:gap-3 mt-4 max-w-sm mx-auto">
          <div className="bg-[#e8ddd2] rounded-xl p-2.5 text-center border border-[#c9a98a]/40">
            <p className="text-[#4a3728] font-bold text-xs">גלית גרינשטיין</p>
            <p className="text-[#9e7860] text-xs">נומרולוגית</p>
          </div>
          <div className="bg-[#e8ddd2] rounded-xl p-2.5 text-center border border-[#c9a98a]/40">
            <p className="text-[#4a3728] font-bold text-xs">📞 052-2792180</p>
            <p className="text-[#9e7860] text-xs">פייסבוק | אינסטגרם</p>
          </div>
          <div className="bg-[#e8ddd2] rounded-xl p-2.5 text-center border border-[#c9a98a]/40">
            <p className="text-[#4a3728] font-bold text-xs">🌐 אתר</p>
            <p className="text-[#9e7860] text-xs">galitcoach.co.il</p>
          </div>
        </div>
      </div>
    </Page>
  );
}

// ─── Main export ─────────────────────────────────────────────
export default function ReportTemplate({ report }: Props) {
  return (
    <div className="bg-[#f5f0ea]" dir="rtl">
      <CoverPage report={report} />
      {report.months.map((m, i) => (
        <MonthPage key={i} month={m} idx={i} gender={report.gender} />
      ))}
      <MessagePage report={report} />
    </div>
  );
}
