"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calcPersonalYear, getNext3Months } from "@/lib/numerology";
import { buildReport } from "@/lib/payload";
import { getClients, saveClient, deleteClient, getLastInput, saveLastInput, SavedClient } from "@/lib/clientStorage";

export default function Home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [day,       setDay]       = useState("");
  const [month,     setMonth]     = useState("");
  const [year,      setYear]      = useState("");
  const [gender,    setGender]    = useState<"female" | "male">("female");
  const [error,     setError]     = useState("");
  const [clients,   setClients]   = useState<SavedClient[]>([]);
  const [showBank,  setShowBank]  = useState(false);

  // Load last input + client bank on mount
  useEffect(() => {
    const last = getLastInput();
    if (last) {
      setFirstName(last.firstName);
      setLastName(last.lastName);
      setDay(last.day);
      setMonth(last.month);
      setYear(last.year);
      setGender(last.gender);
    }
    setClients(getClients());
  }, []);

  function fillFromClient(c: SavedClient) {
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setDay(c.day);
    setMonth(c.month);
    setYear(c.year);
    setGender(c.gender);
    setShowBank(false);
    setError("");
  }

  function removeClient(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteClient(id);
    setClients(getClients());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const d = Number(day), m = Number(month), y = Number(year);
    if (!firstName.trim())           { setError("נא להזין שם פרטי"); return; }
    if (!d || d < 1 || d > 31)      { setError("יום לא תקין"); return; }
    if (!m || m < 1 || m > 12)      { setError("חודש לא תקין"); return; }
    if (!y || y < 1900 || y > 2020) { setError("שנה לא תקינה"); return; }

    const personalYear = calcPersonalYear(d, m);
    const months       = getNext3Months(d, m);
    const report       = buildReport(firstName.trim(), lastName.trim(), d, m, y, gender, personalYear, months);

    // Persist to localStorage
    saveLastInput({ firstName: firstName.trim(), lastName: lastName.trim(), day, month, year, gender });
    saveClient({
      firstName: firstName.trim(), lastName: lastName.trim(),
      day, month, year, gender, personalYear,
      months: months.map(mo => ({ monthName: mo.monthName, personalMonth: mo.personalMonth })),
    });

    sessionStorage.setItem("passover_report", JSON.stringify(report));
    router.push("/preview");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl font-bold text-[#4a3728]">ערכת השנה שלי</h1>
          <p className="text-[#7c5c47]">מפת 3 חודשים אישית</p>
          <p className="text-[#9e7860] text-xs mt-1">גלית גרינשטיין | אבחון ויעוץ נומרולוגי</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 rounded-3xl p-6 shadow border border-[#d4b896]/40">
          <div className="mb-4">
            <label className="block text-[#4a3728] text-sm font-semibold mb-1.5">שם פרטי *</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
              placeholder="שם פרטי"
              className="w-full bg-[#faf7f4] border border-[#d4b896]/60 rounded-xl px-4 py-2.5 text-[#4a3728] placeholder-[#c4a882] focus:outline-none focus:border-[#8B6348] text-right" />
          </div>
          <div className="mb-4">
            <label className="block text-[#4a3728] text-sm font-semibold mb-1.5">שם משפחה</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
              placeholder="שם משפחה (אופציונלי)"
              className="w-full bg-[#faf7f4] border border-[#d4b896]/60 rounded-xl px-4 py-2.5 text-[#4a3728] placeholder-[#c4a882] focus:outline-none focus:border-[#8B6348] text-right" />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-[#4a3728] text-sm font-semibold mb-1.5">מגדר</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setGender("female")}
                className={`py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                  gender === "female"
                    ? "bg-[#8B6348] text-white border-[#8B6348]"
                    : "bg-[#faf7f4] text-[#4a3728] border-[#d4b896]/60 hover:border-[#8B6348]"
                }`}>
                ♀ נקבה
              </button>
              <button type="button" onClick={() => setGender("male")}
                className={`py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                  gender === "male"
                    ? "bg-[#4a3728] text-white border-[#4a3728]"
                    : "bg-[#faf7f4] text-[#4a3728] border-[#d4b896]/60 hover:border-[#4a3728]"
                }`}>
                ♂ זכר
              </button>
            </div>
          </div>

          {/* Birth date */}
          <div className="mb-5">
            <label className="block text-[#4a3728] text-sm font-semibold mb-1.5">תאריך לידה *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: day,   set: setDay,   ph: "יום",  min: 1,    max: 31   },
                { val: month, set: setMonth, ph: "חודש", min: 1,    max: 12   },
                { val: year,  set: setYear,  ph: "שנה",  min: 1900, max: 2020 },
              ].map(({ val, set, ph, min, max }) => (
                <input key={ph} type="number" value={val} onChange={e => set(e.target.value)}
                  placeholder={ph} min={min} max={max}
                  className="w-full bg-[#faf7f4] border border-[#d4b896]/60 rounded-xl px-3 py-2.5 text-[#4a3728] placeholder-[#c4a882] focus:outline-none focus:border-[#8B6348] text-center" />
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-xl p-2">{error}</p>}

          <button type="submit"
            className="w-full py-3 bg-[#8B6348] hover:bg-[#7a5540] text-white rounded-xl font-bold transition-all">
            ✨ צור מפה אישית
          </button>
        </form>

        {/* Client bank */}
        {clients.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowBank(v => !v)}
              className="w-full text-center text-[#8B6348] text-xs font-semibold py-2 bg-[#ede5d8] rounded-2xl border border-[#d4b896]/40 hover:bg-[#e0d4c4] transition-all">
              {showBank ? "▲ הסתר" : `▼ לקוחות שמורים (${clients.length})`}
            </button>

            {showBank && (
              <div className="mt-2 bg-white/70 rounded-2xl border border-[#d4b896]/40 p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {clients.map(c => (
                    <div
                      key={c.id}
                      onClick={() => fillFromClient(c)}
                      className="flex items-center justify-between bg-[#faf7f4] hover:bg-[#f0e8de] rounded-xl px-3 py-2 cursor-pointer border border-[#d4b896]/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#4a3728] font-semibold text-sm truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-[#9e7860] text-xs">
                          {c.day}/{c.month}/{c.year} · שנה {c.personalYear} · {c.months.map(m => `${m.monthName}(${m.personalMonth})`).join(" ")}
                        </p>
                      </div>
                      <button
                        onClick={e => removeClient(c.id, e)}
                        className="text-[#c4a882] hover:text-red-400 text-xl leading-none mr-2 flex-shrink-0 transition-colors">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[#b09070] text-xs mt-4">052-2792180 | galitcoach.co.il</p>
      </div>
    </main>
  );
}
