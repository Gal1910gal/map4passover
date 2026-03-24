"use client";

import Image from "next/image";
import { CardContent } from "@/app/api/card/route";

interface InsightCardProps {
  card: CardContent;
  name: string;
}

export default function InsightCard({ card, name }: InsightCardProps) {
  return (
    <div
      id="insight-card"
      dir="rtl"
      style={{ fontFamily: "var(--font-frank-ruhl), 'Frank Ruhl Libre', serif" }}
      className="
        w-[148mm] min-h-[210mm]
        bg-[#f8f0dc]
        border-[3px] border-[#8B6348]
        rounded-sm
        mx-auto
        px-10 py-10
        flex flex-col items-center justify-between
        text-[#3d2b1f]
        relative
        shadow-xl
        print:shadow-none print:border-2
      "
    >
      {/* Corner ornaments */}
      <span className="absolute top-3 right-3 text-[#8B6348] text-lg select-none">✦</span>
      <span className="absolute top-3 left-3 text-[#8B6348] text-lg select-none">✦</span>
      <span className="absolute bottom-3 right-3 text-[#8B6348] text-lg select-none">✦</span>
      <span className="absolute bottom-3 left-3 text-[#8B6348] text-lg select-none">✦</span>

      {/* Header */}
      <div className="text-center w-full mb-2">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="גלית גרינשטיין" width={64} height={64} className="object-contain" />
        </div>
        <p className="text-[#8B6348] text-xs tracking-widest uppercase mb-3 font-bold">
          ◆ קלף תובנות ◆
        </p>
        <h1 className="text-2xl font-black leading-snug text-[#3d2b1f]">
          {card.title}
        </h1>
        <p className="text-[#8B6348] text-xs mt-1">{name}</p>
      </div>

      {/* Divider */}
      <Divider />

      {/* Central sentence */}
      <div className="text-center w-full my-2">
        <p className="text-lg font-bold italic leading-relaxed text-[#4a3728]">
          &ldquo;{card.centralSentence}&rdquo;
        </p>
      </div>

      {/* Divider */}
      <Divider />

      {/* Numerological insight */}
      <div className="w-full my-2">
        <p className="text-xs font-bold text-[#8B6348] mb-2 tracking-widest text-center">✦ תובנה נומרולוגית ✦</p>
        <p className="text-sm leading-relaxed text-[#3d2b1f] text-right">{card.insight}</p>
      </div>

      {/* Divider */}
      <Divider />

      {/* Action points */}
      <div className="w-full my-2">
        <p className="text-xs font-bold text-[#8B6348] mb-3 text-center tracking-widest">✦ שלוש פעולות לתקופה ✦</p>
        <ul className="space-y-2">
          {card.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#3d2b1f]">
              <span className="text-[#8B6348] font-bold mt-0.5 shrink-0">{["א", "ב", "ג"][i]}.</span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <Divider />

      {/* Closing */}
      <div className="text-center w-full mt-2">
        <p className="text-sm italic text-[#4a3728] leading-relaxed">{card.closing}</p>
        <p className="text-[#8B6348] text-xs mt-4 font-bold tracking-widest">◆ גלית גרינשטיין | נומרולוגיה ◆</p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2 w-full my-3">
      <div className="flex-1 h-px bg-[#8B6348]/40" />
      <span className="text-[#8B6348] text-xs">◆</span>
      <div className="flex-1 h-px bg-[#8B6348]/40" />
    </div>
  );
}
