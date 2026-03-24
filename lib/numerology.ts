export const MONTHS_HE = [
  "ינואר","פברואר","מרץ","אפריל","מאי","יוני",
  "יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"
];

function digitSum(n: number): number {
  return String(Math.abs(n)).split("").reduce((acc, d) => acc + Number(d), 0);
}

/** Always reduce to 1–9 (no master numbers for personal year/month) */
function reduce19(n: number): number {
  while (n > 9) n = digitSum(n);
  return n;
}

/**
 * Personal year rules (always 1–9):
 *
 * Born Jan–Jun:
 *   Before birthday this year → add (currentYear - 1) to day+month
 *   After birthday this year  → add currentYear
 *
 * Born Jul–Dec:
 *   Before birthday this year → add currentYear to day+month
 *   After birthday this year  → add (currentYear + 1)
 */
export function calcPersonalYear(birthDay: number, birthMonth: number): number {
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthdayThisYear = new Date(currentYear, birthMonth - 1, birthDay);
  const birthdayPassed = today >= birthdayThisYear;

  let yearToUse: number;
  if (birthMonth <= 6) {
    yearToUse = birthdayPassed ? currentYear : currentYear - 1;
  } else {
    yearToUse = birthdayPassed ? currentYear + 1 : currentYear;
  }

  return reduce19(digitSum(birthDay) + digitSum(birthMonth) + digitSum(yearToUse));
}

/** Personal month = reduce(personalYear + calendarMonth), always 1–9 */
export function calcPersonalMonth(personalYear: number, calendarMonth: number): number {
  return reduce19(personalYear + calendarMonth);
}

export interface MonthInfo {
  calendarMonth: number;  // 1-12
  calendarYear: number;
  monthName: string;
  personalMonth: number;
}

/** Returns info for the next 3 calendar months from today */
export function getNext3Months(personalYear: number): MonthInfo[] {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    const cm = d.getMonth() + 1;
    return {
      calendarMonth: cm,
      calendarYear: d.getFullYear(),
      monthName: MONTHS_HE[cm - 1],
      personalMonth: calcPersonalMonth(personalYear, cm),
    };
  });
}
