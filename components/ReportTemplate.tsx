/**
 * HTML preview of the numerology report — printable as A4 PDF via browser.
 * Strategy: cover = 1 page, each month = 1 dense page, closing = 1 page.
 * Total: 5 pages (1 cover + 3 month + 1 closing).
 */
import Image from "next/image";
import { ReportData, MonthHalfData } from "@/lib/payload";

interface Props { report: ReportData }

// ─── helpers ───────────────────────────────────────────────
function Page({ children, className = "", tight = false }: {
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
}) {
  const py = tight ? "py-4 print:py-4" : "py-5 print:py-5";
  return (
    <div className={`print-page bg-[#f5f0ea] w-full max-w-3xl mx-auto px-4 sm:px-8 print:px-6 ${py} ${className}`}>
      {children}
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <div className="inline-block bg-[#d4b896] text-[#4a3728] text-xs font-bold px-3 py-0.5 rounded-full mb-1 shadow-sm print:shadow-none">
      {label}
    </div>
  );
}

function Divider() {
  return <div className="border-t-2 border-[#d4b896]/60 my-3" />;
}

// ─── Cover Page ─────────────────────────────────────────────
function CoverPage({ report }: { report: ReportData }) {
  return (
    <Page>
      {/* Logo + Title */}
      <div className="text-center mb-4 pt-1">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="לוגו גלית גרינשטיין" width={80} height={80} className="object-contain" />
        </div>
        <h1 className="text-3xl sm:text-4xl print:text-4xl font-bold text-[#4a3728] mb-1">ערכת השנה שלי</h1>
        <p className="text-[#7c5c47] text-lg sm:text-xl print:text-xl font-semibold">מפת 3 חודשים אישית</p>
        <p className="text-[#8B6348] text-sm print:text-sm mt-1 font-medium">
          שלושת החודשים הקרובים לא מבקשים ממך לדעת הכל - הם מבקשים ממך לפעול נכון בתוך מה שיש.
        </p>
      </div>

      <Divider />

      {/* Client info boxes */}
      <div className="grid grid-cols-3 gap-2 mb-4">
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
      <div className="bg-white/80 rounded-2xl p-4 print:p-4 border-2 border-[#d4b896]/60 mb-3 shadow-sm print:shadow-none">
        <p className="text-[#8B6348] text-sm font-bold mb-2">
          מה אני רואה אצלך עכשיו — שנה אישית {report.personalYear}:
        </p>
        <p className="text-[#4a3728] leading-relaxed text-sm print:text-sm">{report.yearDescription}</p>
      </div>

      {/* New year description — only when birthday transitions the year mid-period */}
      {report.nextPersonalYear && report.nextYearDescription && (
        <div className="bg-[#fff0d6] rounded-2xl p-4 print:p-4 border-2 border-[#d4a843]/60 mb-4 shadow-sm print:shadow-none">
          <p className="text-[#7c4a00] text-sm font-bold mb-2">
            🎂 שנה אישית {report.nextPersonalYear} — האנרגיה שנכנסת מיום הולדתך:
          </p>
          <p className="text-[#4a3728] leading-relaxed text-sm print:text-sm">{report.nextYearDescription}</p>
        </div>
      )}

      {/* 3 months overview */}
      <p className="text-[#4a3728] text-sm font-bold mb-2 text-center">מה צפוי לך ב-3 החודשים הבאים:</p>
      <div className="grid grid-cols-3 gap-2">
        {report.months.map((m, i) => {
          const dotColors = ["bg-[#8B6348]", "bg-[#4a7a4a]", "bg-[#4a4a7a]"];
          const bgColors = ["bg-[#8B6348]/15 border-[#8B6348]/40", "bg-[#4a7a4a]/15 border-[#4a7a4a]/40", "bg-[#4a4a7a]/15 border-[#4a4a7a]/40"];
          const textColors = ["text-[#8B6348]", "text-[#4a7a4a]", "text-[#4a4a7a]"];
          return (
            <div key={i} className={`rounded-2xl p-3 text-center border-2 shadow-sm print:shadow-none ${bgColors[i % 3]}`}>
              <div className={`${dotColors[i % 3]} text-white rounded-full w-10 h-10 print:w-10 print:h-10 flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-md print:shadow-none`}>
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

// ─── Month Colors ────────────────────────────────────────────
const MONTH_COLORS = [
  { dot: "bg-[#8B6348]", accent: "text-[#8B6348]", bg: "bg-[#8B6348]/15 border-[#8B6348]/40" },
  { dot: "bg-[#4a7a4a]", accent: "text-[#4a7a4a]", bg: "bg-[#4a7a4a]/15 border-[#4a7a4a]/40" },
  { dot: "bg-[#4a4a7a]", accent: "text-[#4a4a7a]", bg: "bg-[#4a4a7a]/15 border-[#4a4a7a]/40" },
];

// ─── Month Page (1 dense page per month) ────────────────────
function MonthPage({ month, idx, gender }: { month: ReportData["months"][0]; idx: number; gender: "female" | "male" }) {
  const c = MONTH_COLORS[idx % 3];
  const challengeHow = gender === "female"
    ? ["כשאת מזהה את הדפוס - את כבר לא בתוכו", "עצרי ושאלי: \"מה אני באמת צריכה עכשיו?\"", "זכרי: האתגר הוא זמני", "חזרי אל הפעולה המדויקת שלך"]
    : ["כשאתה מזהה את הדפוס - אתה כבר לא בתוכו", "עצור ושאל: \"מה אני באמת צריך עכשיו?\"", "זכור: האתגר הוא זמני", "חזור אל הפעולה המדויקת שלך"];

  return (
    <Page className="page-break" tight>

      {/* ── Month header ── */}
      <div className={`rounded-xl border-2 p-3 mb-4 shadow-sm print:shadow-none ${c.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`${c.dot} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md print:shadow-none`}>
            {month.personalMonth}
          </div>
          <div className="flex-1">
            <h2 className={`text-base font-bold ${c.accent} leading-tight`}>
              {month.monthName} | מספר {month.personalMonth}
              {month.isBirthdayMonth && (
                <span className="text-[#9e7860] font-normal text-xs mr-1"> — עד יום הולדתך ב-{month.birthDay}</span>
              )}
            </h2>
            <p className="text-[#7c5c47] text-xs">כל חודש נושא אנרגיה ייחודית המגיעה מהמספר האישי שלו.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-white/80 rounded-lg p-2 shadow-sm print:shadow-none">
            <p className="text-[#9e7860] text-xs font-bold">🌟 אנרגיה מרכזית</p>
            <p className={`font-bold ${c.accent} text-xs mt-0.5`}>{month.centralEnergy}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2 shadow-sm print:shadow-none">
            <p className="text-[#9e7860] text-xs font-bold">⚠️ אתגר אפשרי</p>
            <p className="font-bold text-[#4a3728] text-xs mt-0.5">{month.challenge}</p>
          </div>
        </div>
      </div>

      {/* ── Year × Month interaction ── */}
      {month.yearMonthInteraction && (
        <div className="bg-[#fdf6e3] border border-[#c9a98a]/70 rounded-xl px-3 py-2 mb-4 flex items-start gap-2 shadow-sm print:shadow-none">
          <span className="text-[#8B6348] font-bold text-xs flex-shrink-0 mt-0.5">✦ השפעת השנה על החודש:</span>
          <p className="text-[#4a3728] text-xs leading-relaxed">{month.yearMonthInteraction}</p>
        </div>
      )}

      {/* ── Energy + Challenge side by side ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Energy */}
        <div className="bg-[#e8ddd2] rounded-xl p-3 border border-[#c9a98a]/50 shadow-sm print:shadow-none">
          <SectionTag label="אנרגיה מרכזית" />
          <p className="text-[#4a3728] text-xs leading-relaxed mt-1">{month.energyDescription}</p>
        </div>

        {/* Challenge */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#fff8e7] rounded-xl p-3 border-2 border-amber-300/60 shadow-sm print:shadow-none flex-1">
            <p className="text-amber-700 text-xs font-bold mb-1.5">לשים לב ל:</p>
            <ul className="space-y-1">
              {month.challengeItems.map((item, i) => (
                <li key={i} className="text-[#4a3728] text-xs flex items-start gap-1">
                  <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none flex-1">
            <p className="text-[#7c5c47] text-xs font-bold mb-1.5">איך להתמודד:</p>
            <ul className="space-y-1">
              {challengeHow.map((line, i) => (
                <li key={i} className="text-[#4a3728] text-xs font-medium">• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── What to do ── */}
      <div className="mb-4">
        <SectionTag label="מה כן לעשות" />
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[0, 2, 4].map(i => (
            <div key={i} className="bg-white/80 rounded-lg p-3 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none">
              <p className="text-[#4a3728] text-xs mb-1.5 flex items-start gap-1">
                <span className={`${c.accent} font-bold flex-shrink-0`}>←</span>
                <span className="font-medium">{month.whatToDo[i]}</span>
              </p>
              <p className="text-[#4a3728] text-xs flex items-start gap-1">
                <span className={`${c.accent} font-bold flex-shrink-0`}>←</span>
                <span className="font-medium">{month.whatToDo[i + 1]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Precise action ── */}
      <div>
        <SectionTag label="פעולה מדויקת" />
        <div className="bg-[#e8ddd2] rounded-xl p-3 mb-2.5 border border-[#c9a98a]/50 shadow-sm print:shadow-none mt-2">
          <p className="text-[#8B6348] text-xs font-bold mb-0.5">🎯 הפעולה שלי לחודש:</p>
          <p className="text-[#4a3728] font-bold text-sm">{month.preciseAction}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-2.5">
          {[
            { label: "מתי?", val: month.when },
            { label: "איך?", val: month.how },
            { label: "עם מי?", val: month.withWhom },
          ].map(({ label, val }) => (
            <div key={label} className="bg-[#e8ddd2] rounded-lg p-2 text-center border border-[#c9a98a]/40 shadow-sm print:shadow-none">
              <p className="text-[#8B6348] text-xs font-bold mb-0.5">{label}</p>
              <p className="text-[#4a3728] text-xs font-medium">{val}</p>
            </div>
          ))}
        </div>
        <p className="text-[#7c5c47] text-xs italic font-semibold">👉 אם עשיתי - {month.feeling}</p>
      </div>
    </Page>
  );
}

// ─── Second Half Page (post-birthday, new personal year) ─────
function SecondHalfPage({
  half, monthName, birthDay, idx, gender,
}: {
  half: MonthHalfData;
  monthName: string;
  birthDay: number;
  idx: number;
  gender: "female" | "male";
}) {
  const c = MONTH_COLORS[(idx + 1) % 3];
  const challengeHow = gender === "female"
    ? ["כשאת מזהה את הדפוס - את כבר לא בתוכו", "עצרי ושאלי: \"מה אני באמת צריכה עכשיו?\"", "זכרי: האתגר הוא זמני", "חזרי אל הפעולה המדויקת שלך"]
    : ["כשאתה מזהה את הדפוס - אתה כבר לא בתוכו", "עצור ושאל: \"מה אני באמת צריך עכשיו?\"", "זכור: האתגר הוא זמני", "חזור אל הפעולה המדויקת שלך"];

  return (
    <Page className="page-break" tight>

      {/* ── Header ── */}
      <div className="bg-[#fff0d6] border-2 border-[#d4a843]/70 rounded-xl p-3 mb-4 shadow-sm print:shadow-none">
        <div className="flex items-center gap-3">
          <div className="bg-[#d4a843] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md print:shadow-none">
            {half.personalMonth}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#7c4a00] leading-tight">
              🎂 {monthName} | מספר {half.personalMonth}
              <span className="text-[#9e7860] font-normal text-xs mr-1"> — מיום הולדתך ב-{birthDay} | שנה אישית {half.personalYear}</span>
            </h2>
            <p className="text-[#7c5c47] text-xs">אנרגיה חדשה נכנסת מיום הולדתך — שנה אישית חדשה מתחילה.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-white/80 rounded-lg p-2 shadow-sm print:shadow-none">
            <p className="text-[#9e7860] text-xs font-bold">🌟 אנרגיה מרכזית</p>
            <p className="font-bold text-[#7c4a00] text-xs mt-0.5">{half.centralEnergy}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2 shadow-sm print:shadow-none">
            <p className="text-[#9e7860] text-xs font-bold">⚠️ אתגר אפשרי</p>
            <p className="font-bold text-[#4a3728] text-xs mt-0.5">{half.challenge}</p>
          </div>
        </div>
      </div>

      {/* ── Year × Month interaction ── */}
      {half.yearMonthInteraction && (
        <div className="bg-[#fdf6e3] border border-[#c9a98a]/70 rounded-xl px-3 py-2 mb-4 flex items-start gap-2 shadow-sm print:shadow-none">
          <span className="text-[#8B6348] font-bold text-xs flex-shrink-0 mt-0.5">✦ השפעת השנה על החודש:</span>
          <p className="text-[#4a3728] text-xs leading-relaxed">{half.yearMonthInteraction}</p>
        </div>
      )}

      {/* ── Energy + Challenge ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#e8ddd2] rounded-xl p-3 border border-[#c9a98a]/50 shadow-sm print:shadow-none">
          <SectionTag label="אנרגיה מרכזית" />
          <p className="text-[#4a3728] text-xs leading-relaxed mt-1">{half.energyDescription}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-[#fff8e7] rounded-xl p-3 border-2 border-amber-300/60 shadow-sm print:shadow-none flex-1">
            <p className="text-amber-700 text-xs font-bold mb-1.5">לשים לב ל:</p>
            <ul className="space-y-1">
              {half.challengeItems.map((item, i) => (
                <li key={i} className="text-[#4a3728] text-xs flex items-start gap-1">
                  <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none flex-1">
            <p className="text-[#7c5c47] text-xs font-bold mb-1.5">איך להתמודד:</p>
            <ul className="space-y-1">
              {challengeHow.map((line, i) => (
                <li key={i} className="text-[#4a3728] text-xs font-medium">• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── What to do ── */}
      <div className="mb-4">
        <SectionTag label="מה כן לעשות" />
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[0, 2, 4].map(i => (
            <div key={i} className="bg-white/80 rounded-lg p-3 border-2 border-[#d4b896]/50 shadow-sm print:shadow-none">
              <p className="text-[#4a3728] text-xs mb-1.5 flex items-start gap-1">
                <span className="text-[#7c4a00] font-bold flex-shrink-0">←</span>
                <span className="font-medium">{half.whatToDo[i]}</span>
              </p>
              <p className="text-[#4a3728] text-xs flex items-start gap-1">
                <span className="text-[#7c4a00] font-bold flex-shrink-0">←</span>
                <span className="font-medium">{half.whatToDo[i + 1]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Precise action ── */}
      <div>
        <SectionTag label="פעולה מדויקת" />
        <div className="bg-[#fff0d6] rounded-xl p-3 mb-2.5 border border-[#d4a843]/50 shadow-sm print:shadow-none mt-2">
          <p className="text-[#7c4a00] text-xs font-bold mb-0.5">🎯 הפעולה שלי לחודש:</p>
          <p className="text-[#4a3728] font-bold text-sm">{half.preciseAction}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-2.5">
          {[
            { label: "מתי?", val: half.when },
            { label: "איך?", val: half.how },
            { label: "עם מי?", val: half.withWhom },
          ].map(({ label, val }) => (
            <div key={label} className="bg-[#fff0d6] rounded-lg p-2 text-center border border-[#d4a843]/40 shadow-sm print:shadow-none">
              <p className="text-[#7c4a00] text-xs font-bold mb-0.5">{label}</p>
              <p className="text-[#4a3728] text-xs font-medium">{val}</p>
            </div>
          ))}
        </div>
        <p className="text-[#7c5c47] text-xs italic font-semibold">👉 אם עשיתי - {half.feeling}</p>
      </div>
    </Page>
  );
}

// ─── Personal Message Page ───────────────────────────────────
function MessagePage({ report }: { report: ReportData }) {
  return (
    <Page className="page-break">
      <div className="flex flex-col items-center justify-center py-6 print:py-6">
        <SectionTag label="מסר אישי" />
        <h2 className="text-2xl sm:text-3xl print:text-3xl font-bold text-[#4a3728] mb-5">מסר אישי עבורך</h2>
        <div className="bg-white/80 rounded-2xl p-5 border-2 border-[#d4b896]/50 mb-4 max-w-xl w-full shadow-sm print:shadow-none">
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
        <div className="grid grid-cols-3 gap-2 mt-4 max-w-sm mx-auto">
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
        <>
          <MonthPage key={`month-${i}`} month={m} idx={i} gender={report.gender} />
          {m.secondHalf && (
            <SecondHalfPage
              key={`half-${i}`}
              half={m.secondHalf}
              monthName={m.monthName}
              birthDay={m.birthDay!}
              idx={i}
              gender={report.gender}
            />
          )}
        </>
      ))}
      <MessagePage report={report} />
    </div>
  );
}
