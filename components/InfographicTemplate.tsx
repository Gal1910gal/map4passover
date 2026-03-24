"use client";

import { forwardRef } from "react";
import { ReportData } from "@/lib/payload";

interface Props {
  report: ReportData;
}

const S = {
  wrap: {
    direction: "rtl" as const,
    background: "linear-gradient(145deg, #f8f0e3 0%, #f0e2c8 50%, #e8d5b0 100%)",
    width: "1200px",
    minHeight: "675px",
    padding: "40px 48px",
    fontFamily: "Arial, 'Segoe UI', sans-serif",
    position: "relative" as const,
    boxSizing: "border-box" as const,
    border: "4px double #b8935a",
    borderRadius: "4px",
  },
  cornerTL: {
    position: "absolute" as const, top: 8, right: 8,
    fontSize: 32, opacity: 0.35, color: "#8B6348",
  },
  cornerTR: {
    position: "absolute" as const, top: 8, left: 8,
    fontSize: 32, opacity: 0.35, color: "#8B6348",
  },
  cornerBL: {
    position: "absolute" as const, bottom: 8, right: 8,
    fontSize: 32, opacity: 0.35, color: "#8B6348",
  },
  cornerBR: {
    position: "absolute" as const, bottom: 8, left: 8,
    fontSize: 32, opacity: 0.35, color: "#8B6348",
  },
  titleBox: {
    textAlign: "center" as const,
    marginBottom: 32,
    borderBottom: "2px solid #c9a96e",
    paddingBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 900,
    color: "#2a1a0a",
    lineHeight: 1.3,
    margin: 0,
  },
  titleHighlight: { color: "#8B6348" },
  subtitle: {
    fontSize: 15,
    color: "#7a5c38",
    marginTop: 6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    marginBottom: 28,
  },
  panel: {
    background: "rgba(255,255,255,0.45)",
    border: "1px solid #c9a96e",
    borderRadius: 12,
    padding: "20px 22px",
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: "#5a3a18",
    borderBottom: "1px solid #d4b896",
    paddingBottom: 10,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  box: {
    background: "rgba(201,169,110,0.18)",
    border: "1px solid #d4b896",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "#4a2e10",
    marginBottom: 4,
  },
  boxText: {
    fontSize: 13,
    color: "#5a3c20",
    lineHeight: 1.55,
    margin: 0,
  },
  monthCard: {
    background: "rgba(255,255,255,0.5)",
    border: "1px solid #d4b896",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 12,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: 800,
    color: "#3a2008",
    marginBottom: 4,
  },
  monthEnergy: {
    fontSize: 13,
    color: "#6a4828",
    marginBottom: 4,
  },
  monthAction: {
    fontSize: 12,
    color: "#8B6348",
    fontStyle: "italic" as const,
  },
  footer: {
    textAlign: "center" as const,
    borderTop: "1px solid #c9a96e",
    paddingTop: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#3a2008",
  },
  footerBrand: {
    fontSize: 13,
    color: "#8B6348",
  },
  footerDate: {
    fontSize: 13,
    color: "#7a5c38",
  },
};

const InfographicTemplate = forwardRef<HTMLDivElement, Props>(({ report }, ref) => {
  const m1 = report.months[0];
  const m2 = report.months[1];
  const m3 = report.months[2];
  const shortDesc = report.yearDescription.split(".").slice(0, 2).join(". ");

  return (
    <div ref={ref} style={S.wrap}>
      {/* Corner decorations */}
      <span style={S.cornerTL}>✦</span>
      <span style={S.cornerTR}>✦</span>
      <span style={S.cornerBL}>✦</span>
      <span style={S.cornerBR}>✦</span>

      {/* Title */}
      <div style={S.titleBox}>
        <h1 style={S.title}>
          שנה אישית {report.personalYear}:{" "}
          <span style={S.titleHighlight}>{report.yearTag}</span>
        </h1>
        <p style={S.subtitle}>
          מפת 3 חודשים אישית | {report.firstName} {report.lastName}
        </p>
      </div>

      {/* Two-column grid */}
      <div style={S.grid}>
        {/* Left panel — year essence */}
        <div style={S.panel}>
          <div style={S.panelTitle}>
            <span>🌟</span>
            <span>מהות השנה — {m1.centralEnergy}</span>
          </div>

          <div style={S.box}>
            <div style={S.boxTitle}>האנרגיה של השנה</div>
            <p style={S.boxText}>{shortDesc}</p>
          </div>

          <div style={S.box}>
            <div style={S.boxTitle}>האתגר המרכזי</div>
            <p style={S.boxText}>{m1.challenge}</p>
          </div>

          <div style={S.box}>
            <div style={S.boxTitle}>מסר אישי</div>
            <p style={S.boxText}>{report.personalMessage.split(".")[0]}.</p>
          </div>
        </div>

        {/* Right panel — 3 months */}
        <div style={S.panel}>
          <div style={S.panelTitle}>
            <span>📅</span>
            <span>שלושת החודשים הקרובים</span>
          </div>

          {[m1, m2, m3].filter(Boolean).map((m, i) => (
            <div key={i} style={S.monthCard}>
              <div style={S.monthHeader}>
                {m.monthName} | אנרגיה {m.personalMonth}
              </div>
              <div style={S.monthEnergy}>{m.centralEnergy}</div>
              <div style={S.monthAction}>✦ {m.preciseAction}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <div style={S.footerName}>
          {report.firstName} {report.lastName} | {report.birthdate}
        </div>
        <div style={{ fontSize: 20, color: "#c9a96e" }}>🦋</div>
        <div style={S.footerBrand}>
          גלית גרינשטיין | אבחון ויעוץ נומרולוגי
        </div>
      </div>
    </div>
  );
});

InfographicTemplate.displayName = "InfographicTemplate";
export default InfographicTemplate;
