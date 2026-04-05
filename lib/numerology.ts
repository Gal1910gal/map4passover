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

/** Calculate personal year as of today (used for cover page + client bank) */
export function calcPersonalYear(birthDay: number, birthMonth: number): number {
  const today = new Date();
  return calcPersonalYearAt(birthDay, birthMonth, today.getFullYear(), today.getMonth() + 1, today.getDate());
}

/** Calculate personal year as of the 1st day of a given calendar month */
function calcPersonalYearAt(
  birthDay: number,
  birthMonth: number,
  refYear: number,
  refMonth: number,
  refDay = 1
): number {
  const birthdayThisYear = new Date(refYear, birthMonth - 1, birthDay);
  const refDate = new Date(refYear, refMonth - 1, refDay);
  const birthdayPassed = refDate >= birthdayThisYear;

  let yearToUse: number;
  if (birthMonth <= 6) {
    yearToUse = birthdayPassed ? refYear : refYear - 1;
  } else {
    yearToUse = birthdayPassed ? refYear + 1 : refYear;
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
  personalYear: number;
  personalMonth: number;
  /** True if the person's birthday falls in this calendar month AND the personal year changes */
  isBirthdayMonth: boolean;
  /** The birth day (only set when isBirthdayMonth = true) */
  birthDay?: number;
  /** Personal year AFTER the birthday (only set when isBirthdayMonth = true, and differs from personalYear) */
  nextPersonalYear?: number;
  /** Personal month AFTER the birthday, based on nextPersonalYear */
  nextPersonalMonth?: number;
}

/** Returns info for the next 3 calendar months from today, with per-month personal year */
export function getNext3Months(birthDay: number, birthMonth: number): MonthInfo[] {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    const cm = d.getMonth() + 1;
    const cy = d.getFullYear();

    // Personal year as of the 1st of this month
    const py = calcPersonalYearAt(birthDay, birthMonth, cy, cm, 1);
    const isBirthdayMonth = cm === birthMonth;

    let nextPersonalYear: number | undefined;
    let nextPersonalMonth: number | undefined;
    if (isBirthdayMonth) {
      // Personal year from the birthday onward (day after birthday)
      const pyAfter = calcPersonalYearAt(birthDay, birthMonth, cy, cm, birthDay + 1);
      if (pyAfter !== py) {
        // Year actually changes — flag the transition
        nextPersonalYear = pyAfter;
        nextPersonalMonth = calcPersonalMonth(pyAfter, cm);
      }
    }

    return {
      calendarMonth: cm,
      calendarYear: cy,
      monthName: MONTHS_HE[cm - 1],
      personalYear: py,
      personalMonth: calcPersonalMonth(py, cm),
      isBirthdayMonth: isBirthdayMonth && nextPersonalYear !== undefined,
      birthDay: isBirthdayMonth ? birthDay : undefined,
      nextPersonalYear,
      nextPersonalMonth,
    };
  });
}
