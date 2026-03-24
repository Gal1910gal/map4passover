import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { ReportData } from "@/lib/payload";

export async function POST(req: NextRequest) {
  try {
    const report = await req.json() as ReportData;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const prompt = buildPrompt(report);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData?.data) throw new Error("לא נוצרה תמונה");

    return NextResponse.json({ image: imagePart.inlineData.data });
  } catch (err) {
    console.error("Infographic error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "שגיאה ביצירת האינפוגרפיקה" },
      { status: 500 }
    );
  }
}

function buildPrompt(report: ReportData): string {
  const name = `${report.firstName} ${report.lastName}`;
  const m1 = report.months[0];
  const m2 = report.months[1];
  const m3 = report.months[2];
  const shortDesc = report.yearDescription.split(".")[0];

  return `Create a beautiful spiritual Hebrew infographic poster in landscape format (16:9 ratio).

VISUAL STYLE:
- Warm cream/parchment background in beige and sand tones
- Large central decorative butterfly in warm mahogany and brown tones with decorative swirling patterns inside wings
- Each butterfly wing contains small illustrated vignettes (a flowing river, a dancing woman, a sprouting plant, a glowing star and open door)
- Gold and dark brown color palette
- Decorative white owl perched on a branch with roots on the left side
- Elegant swirling botanical flourishes around the butterfly
- Mystical, warm, spiritual aesthetic

HEBREW TEXT LAYOUT (all text must be in correct Hebrew, right-to-left):

Large bold title at top center:
"שנה אישית ${report.personalYear}: ${report.yearTag}"

Curved text label arching over left wing:
"מהות השנה – ${m1.centralEnergy}"

Curved text label arching over right wing:
"דגשים ופעולה לשלושת החודשים הקרובים"

LEFT SIDE callout boxes:
Box 1 title: "הזדמנויות מהגורל"
Box 1 text: "${shortDesc}"

Box 2 title: "זרימה ללא מאמץ"
Box 2 text: "${m1.challenge}"

RIGHT SIDE callout boxes:
Box 3 title: "האתגר: ${m2?.centralEnergy ?? ""}"
Box 3 text: "${m2?.challenge ?? ""}"

Box 4 title: "לפעול בתוך הקיים"
Box 4 text: "${m3?.centralEnergy ?? ""}"

Bottom center: "${name}"

IMPORTANT: All Hebrew text must be legible, correctly formed, and right-to-left. The infographic should feel personal, warm, and spiritually uplifting.`;
}
