import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export interface CardContent {
  title: string;
  centralSentence: string;
  insight: string;
  actions: [string, string, string];
  closing: string;
}

const SYSTEM_INSTRUCTION = `אתה נומרולוג מומחה ומאמן אישי בשפה העברית.
כתוב בגוף שני (אתה/את בהתאם למגדר), בשפה אישית, רגשית ומדויקת — לא גנרית.
החזר תמיד JSON בלבד, ללא markdown, ללא הסברים.`;

export async function POST(req: NextRequest) {
  try {
    const { name, gender, personalYear, months, nextPersonalYear, birthdayMonth } = await req.json() as {
      name: string;
      gender: "female" | "male";
      personalYear: number;
      months: Array<{ number: number; name: string; centralEnergy: string; isTransition?: boolean }>;
      nextPersonalYear?: number;
      birthdayMonth?: string;
    };

    const genderWord = gender === "female" ? "נקבה (את, שלך, עשי)" : "זכר (אתה, שלך, עשה)";
    const monthsText = months.map((m, i) =>
      `חודש ${i + 1} — ${m.name}: אנרגיה ${m.number} (${m.centralEnergy})${m.isTransition ? " [חודש יומולדת — השנה מתחלפת באמצע החודש]" : ""}`
    ).join("\n");

    const transitionNote = nextPersonalYear && birthdayMonth
      ? `\nחשוב: בחודש ${birthdayMonth} חל יום הולדת — השנה האישית עוברת מ-${personalYear} ל-${nextPersonalYear}. יש לתת ביטוי לנקודת המפנה הזו בקלף.`
      : "";

    const userPrompt = `
שם: ${name}
מגדר: ${genderWord}
שנה אישית: ${personalYear}${nextPersonalYear ? ` (עד יום הולדת) → ${nextPersonalYear} (אחרי יום הולדת)` : ""}
שלושת החודשים הקרובים:
${monthsText}${transitionNote}

צור קלף תובנות אישי. החזר JSON בדיוק בפורמט הבא (ללא markdown):
{
  "title": "כותרת קצרה ואישית (5-7 מילים)",
  "centralSentence": "משפט רגשי מרכזי אחד — האמת הגדולה של התקופה הזו",
  "insight": "תובנה נומרולוגית של 2-3 משפטים המחברת את השנה האישית עם אנרגיות החודשים",
  "actions": [
    "פעולה קונקרטית ראשונה",
    "פעולה קונקרטית שנייה",
    "פעולה קונקרטית שלישית"
  ],
  "closing": "משפט סיום מעצים ואישי"
}
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(userPrompt);
    let text = result.response.text().trim();

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    const card = JSON.parse(text) as CardContent;
    return NextResponse.json(card);
  } catch (err) {
    console.error("Card generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "שגיאה בייצור הקלף" },
      { status: 500 }
    );
  }
}
