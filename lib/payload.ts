import { CONTENT, YEAR_MONTH_INTERACTION, buildPersonalMessage, genderize } from "@/data/content";
import { MonthInfo } from "./numerology";

/** Full content for one "month half" (used for both normal months and the second-half birthday page) */
export interface MonthHalfData {
  personalYear: number;
  personalMonth: number;
  centralEnergy: string;
  energyDescription: string;
  challenge: string;
  challengeItems: [string, string];
  whatToDo: [string, string, string, string, string, string];
  preciseAction: string;
  when: string;
  how: string;
  withWhom: string;
  feeling: string;
  yearMonthInteraction: string;
}

export interface ReportData {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: "female" | "male";
  personalYear: number;
  yearTag: string;
  yearDescription: string;
  /** Populated only when a birthday in the 3-month period changes the personal year */
  nextPersonalYear?: number;
  nextYearTag?: string;
  nextYearDescription?: string;
  months: Array<{
    monthName: string;
    calendarMonth: number;
    calendarYear: number;
    personalYear: number;
    personalMonth: number;
    centralEnergy: string;
    energyDescription: string;
    challenge: string;
    challengeItems: [string, string];
    whatToDo: [string, string, string, string, string, string];
    preciseAction: string;
    when: string;
    how: string;
    withWhom: string;
    feeling: string;
    yearMonthInteraction: string;
    isBirthdayMonth: boolean;
    birthDay?: number;
    /** Full content for the post-birthday part of this month (new personal year) */
    secondHalf?: MonthHalfData;
  }>;
  personalMessage: string;
}

function buildHalf(
  personalYear: number,
  personalMonth: number,
  calendarMonth: number,
  g: (s: string) => string
): MonthHalfData {
  const c = CONTENT[personalMonth] ?? CONTENT[1];
  return {
    personalYear,
    personalMonth,
    centralEnergy: g(c.month.centralEnergy),
    energyDescription: g(c.month.energyDescription),
    challenge: g(c.month.challenge),
    challengeItems: [g(c.month.challengeItems[0]), g(c.month.challengeItems[1])] as [string, string],
    whatToDo: c.month.whatToDo.map(g) as [string, string, string, string, string, string],
    preciseAction: g(c.month.preciseAction),
    when: g(c.month.when),
    how: g(c.month.how),
    withWhom: g(c.month.withWhom),
    feeling: g(c.month.feeling),
    yearMonthInteraction: g(YEAR_MONTH_INTERACTION[personalYear]?.[personalMonth] ?? ""),
  };
}

export function buildReport(
  firstName: string,
  lastName: string,
  day: number,
  month: number,
  year: number,
  gender: "female" | "male",
  personalYear: number,
  months: MonthInfo[]
): ReportData {
  const yearContent = CONTENT[personalYear]?.year;
  const birthdate = `${day}.${month}.${year}`;

  const g = (text: string) => genderize(text, gender);

  // Check if any month has a year transition
  const transition = months.find(m => m.isBirthdayMonth && m.nextPersonalYear);
  const nextYearContent = transition ? CONTENT[transition.nextPersonalYear!]?.year : undefined;

  const reportMonths = months.map(m => {
    const c = CONTENT[m.personalMonth] ?? CONTENT[1];

    // Build secondHalf when birthday changes the personal year this month
    const secondHalf = (m.isBirthdayMonth && m.nextPersonalYear && m.nextPersonalMonth)
      ? buildHalf(m.nextPersonalYear, m.nextPersonalMonth, m.calendarMonth, g)
      : undefined;

    return {
      monthName: m.monthName,
      calendarMonth: m.calendarMonth,
      calendarYear: m.calendarYear,
      personalYear: m.personalYear,
      personalMonth: m.personalMonth,
      centralEnergy: g(c.month.centralEnergy),
      energyDescription: g(c.month.energyDescription),
      challenge: g(c.month.challenge),
      challengeItems: [g(c.month.challengeItems[0]), g(c.month.challengeItems[1])] as [string, string],
      whatToDo: c.month.whatToDo.map(g) as [string, string, string, string, string, string],
      preciseAction: g(c.month.preciseAction),
      when: g(c.month.when),
      how: g(c.month.how),
      withWhom: g(c.month.withWhom),
      feeling: g(c.month.feeling),
      yearMonthInteraction: g(YEAR_MONTH_INTERACTION[m.personalYear]?.[m.personalMonth] ?? ""),
      isBirthdayMonth: m.isBirthdayMonth,
      birthDay: m.birthDay,
      secondHalf,
    };
  });

  return {
    firstName,
    lastName,
    birthdate,
    gender,
    personalYear,
    yearTag: g(yearContent?.tag ?? ""),
    yearDescription: g(yearContent?.description ?? ""),
    nextPersonalYear: transition?.nextPersonalYear,
    nextYearTag: nextYearContent ? g(nextYearContent.tag) : undefined,
    nextYearDescription: nextYearContent ? g(nextYearContent.description) : undefined,
    months: reportMonths,
    personalMessage: g(buildPersonalMessage(firstName, personalYear, months[0]?.monthName ?? "", months[2]?.monthName ?? "")),
  };
}

export function buildCanvaPayload(templateId: string, report: ReportData) {
  const data: Record<string, { type: "text"; text: string }> = {
    name:            { type: "text", text: `${report.firstName} ${report.lastName}`.trim() },
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
    m.whatToDo.forEach((a, ai) => {
      data[`month${n}ToDo${ai + 1}`] = { type: "text", text: a };
    });
    data[`month${n}Action`]   = { type: "text", text: m.preciseAction };
    data[`month${n}When`]     = { type: "text", text: m.when };
    data[`month${n}How`]      = { type: "text", text: m.how };
    data[`month${n}WithWhom`] = { type: "text", text: m.withWhom };
    data[`month${n}Feeling`]  = { type: "text", text: m.feeling };
  });

  return {
    brand_template_id: templateId,
    title: `מפת 3 חודשים - ${report.firstName} ${report.lastName}`,
    data,
  };
}
