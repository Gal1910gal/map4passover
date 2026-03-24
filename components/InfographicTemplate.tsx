"use client";

import { forwardRef } from "react";
import { ReportData } from "@/lib/payload";

interface Props { report: ReportData; }

/* ── Butterfly SVG ─────────────────────────────────── */
function ButterflyDecor() {
  return (
    <svg viewBox="0 0 320 220" width="320" height="220"
      style={{ position: "absolute", top: "50%", left: "50%",
               transform: "translate(-50%,-52%)", opacity: 0.18, pointerEvents: "none" }}>
      {/* upper-left wing */}
      <path d="M160,110 C140,70 90,20 30,30 C-10,38 10,80 60,95 C95,106 130,102 160,110Z"
            fill="#6a3e18"/>
      {/* lower-left wing */}
      <path d="M160,110 C145,130 100,160 50,155 C10,150 20,120 65,115 C105,110 140,112 160,110Z"
            fill="#8B5a2b"/>
      {/* upper-right wing */}
      <path d="M160,110 C180,70 230,20 290,30 C330,38 310,80 260,95 C225,106 190,102 160,110Z"
            fill="#6a3e18"/>
      {/* lower-right wing */}
      <path d="M160,110 C175,130 220,160 270,155 C310,150 300,120 255,115 C215,110 180,112 160,110Z"
            fill="#8B5a2b"/>
      {/* inner decorative swirl left */}
      <path d="M160,110 C150,90 110,55 70,58 C40,61 50,85 85,93 C115,100 145,106 160,110Z"
            fill="#c9a96e" opacity="0.5"/>
      {/* inner decorative swirl right */}
      <path d="M160,110 C170,90 210,55 250,58 C280,61 270,85 235,93 C205,100 175,106 160,110Z"
            fill="#c9a96e" opacity="0.5"/>
      {/* body */}
      <ellipse cx="160" cy="108" rx="5" ry="28" fill="#2a1608"/>
      {/* antennae */}
      <path d="M158,82 C150,60 140,50 135,42" stroke="#2a1608" strokeWidth="1.5" fill="none"/>
      <circle cx="135" cy="42" r="3" fill="#2a1608"/>
      <path d="M162,82 C170,60 180,50 185,42" stroke="#2a1608" strokeWidth="1.5" fill="none"/>
      <circle cx="185" cy="42" r="3" fill="#2a1608"/>
    </svg>
  );
}

/* ── Callout box ───────────────────────────────────── */
function CalloutBox({ title, text, accent = "#8B6348" }: { title: string; text: string; accent?: string }) {
  return (
    <div style={{
      background: "rgba(255,252,245,0.80)",
      border: `1.5px solid ${accent}`,
      borderRadius: 10,
      padding: "10px 14px",
      marginBottom: 10,
      boxShadow: "0 2px 6px rgba(90,50,10,0.10)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: accent, marginBottom: 3, letterSpacing: 0.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 12.5, color: "#3a2008", lineHeight: 1.55 }}>
        {text}
      </div>
    </div>
  );
}

/* ── Month card ────────────────────────────────────── */
function MonthCard({ m, idx }: { m: ReportData["months"][0]; idx: number }) {
  const colors = ["#7a4f28", "#8B6348", "#6a3e18"];
  const bg = ["rgba(122,79,40,0.10)", "rgba(139,99,72,0.10)", "rgba(106,62,24,0.10)"];
  return (
    <div style={{
      background: bg[idx],
      border: `1.5px solid ${colors[idx]}55`,
      borderRadius: 10, padding: "10px 14px", marginBottom: 9,
      borderRight: `4px solid ${colors[idx]}`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: colors[idx], marginBottom: 2 }}>
        {m.monthName} | חודש {m.personalMonth}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#2a1608", marginBottom: 3 }}>
        {m.centralEnergy}
      </div>
      <div style={{ fontSize: 11.5, color: "#6a4828", lineHeight: 1.45 }}>
        {m.preciseAction}
      </div>
    </div>
  );
}

/* ── Section label (curved look via absolute) ───────── */
function SectionLabel({ text, side }: { text: string; side: "right" | "left" }) {
  return (
    <div style={{
      fontSize: 14, fontWeight: 800, color: "#5a3010",
      textAlign: "center",
      background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.25), transparent)",
      borderBottom: "1px solid #c9a96e44",
      padding: "6px 0 8px",
      marginBottom: 12,
      letterSpacing: 0.5,
      direction: "rtl",
    }}>
      {side === "right" ? "🌟 " : "📅 "}{text}
    </div>
  );
}

/* ── Main component ────────────────────────────────── */
const InfographicTemplate = forwardRef<HTMLDivElement, Props>(({ report }, ref) => {
  const m1 = report.months[0];
  const m2 = report.months[1];
  const m3 = report.months[2];
  const shortDesc = report.yearDescription.split(".")[0].trim();
  const shortMsg   = report.personalMessage.split(".")[0].trim();

  return (
    <div
      ref={ref}
      dir="rtl"
      style={{
        width: 1100,
        height: 650,
        background: "radial-gradient(ellipse at 50% 40%, #fdf5e8 0%, #f0e2c8 55%, #e2cba8 100%)",
        fontFamily: "Arial, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "0",
      }}
    >
      {/* ── outer decorative border ── */}
      <div style={{
        position: "absolute", inset: 8,
        border: "2px solid #c9a96e88",
        borderRadius: 4,
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", inset: 14,
        border: "1px solid #c9a96e44",
        borderRadius: 2,
        pointerEvents: "none",
      }}/>

      {/* ── corner ornaments ── */}
      {["topRight:24px:20px","topLeft:24px:auto:20px","bottomRight:auto:20px:24px:auto","bottomLeft:auto:auto:24px:20px"].map((d,i) => {
        const [, top, right, bottom, left] = d.split(":");
        return <span key={i} style={{ position:"absolute", top, right, bottom, left, fontSize:18, color:"#b8935a", opacity:0.6, lineHeight:1 }}>✦</span>;
      })}

      {/* ── TITLE ── */}
      <div style={{
        textAlign: "center",
        paddingTop: 26,
        paddingBottom: 14,
        borderBottom: "1px solid #c9a96e55",
        marginBottom: 0,
        position: "relative", zIndex: 2,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#9a7040", textTransform: "uppercase", marginBottom: 4 }}>
          מפת 3 חודשים אישית
        </div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, color: "#1e0e02", lineHeight: 1.2 }}>
          שנה אישית {report.personalYear}:{" "}
          <span style={{ color: "#8B6348" }}>{report.yearTag}</span>
        </h1>
        <div style={{ fontSize: 13, color: "#7a5030", marginTop: 5 }}>
          {report.firstName} {report.lastName} &nbsp;|&nbsp; {report.birthdate}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px 1fr",
        gap: 0,
        padding: "18px 28px 0",
        position: "relative",
        height: 450,
      }}>
        {/* ── LEFT PANEL — year ── */}
        <div style={{ paddingLeft: 8, paddingRight: 16 }}>
          <SectionLabel text={`מהות השנה — ${m1.centralEnergy}`} side="right" />
          <CalloutBox
            title="האנרגיה של השנה"
            text={shortDesc}
          />
          <CalloutBox
            title="האתגר המרכזי"
            text={m1.challenge}
            accent="#6a3e18"
          />
          <CalloutBox
            title="המסר האישי"
            text={shortMsg}
            accent="#9a6030"
          />
        </div>

        {/* ── CENTER — butterfly ── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <ButterflyDecor />
          {/* year number badge */}
          <div style={{
            position: "relative", zIndex: 3,
            width: 64, height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, #8B6348, #5a3010)",
            boxShadow: "0 0 0 3px #c9a96e, 0 4px 12px rgba(90,48,16,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "#fff",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{report.personalYear}</div>
            <div style={{ fontSize: 9, opacity: 0.85, marginTop: 1 }}>שנה</div>
          </div>

          {/* decorative dots */}
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              position: "absolute",
              width: 5, height: 5, borderRadius: "50%",
              background: "#c9a96e",
              opacity: 0.5,
              top: `${30 + i * 14}%`,
              left: "50%",
              transform: "translateX(-50%)",
            }}/>
          ))}
        </div>

        {/* ── RIGHT PANEL — months ── */}
        <div style={{ paddingRight: 8, paddingLeft: 16 }}>
          <SectionLabel text="דגשים לשלושת החודשים הקרובים" side="left" />
          {[m1, m2, m3].filter(Boolean).map((m, i) => (
            <MonthCard key={i} m={m} idx={i} />
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: "absolute", bottom: 22, right: 32, left: 32,
        borderTop: "1px solid #c9a96e55",
        paddingTop: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 11,
        color: "#7a5030",
      }}>
        <span>galitcoach.co.il &nbsp;|&nbsp; 052-2792180</span>
        <span style={{ fontSize: 16, color: "#c9a96e" }}>✦ 🦋 ✦</span>
        <span>גלית גרינשטיין &nbsp;|&nbsp; אבחון ויעוץ נומרולוגי</span>
      </div>
    </div>
  );
});

InfographicTemplate.displayName = "InfographicTemplate";
export default InfographicTemplate;
