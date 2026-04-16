import type { FireState } from '../../../../types/fire/models/FireState';

export function calcMonthlySavings(state: FireState): number {
  return state.monthlySavingsAmount;
}

function getLocalizedMonthName(monthIndex: number): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short' })
    .format(new Date(2000, monthIndex, 1));
}

/**
 * Simulates month-by-month growth of ETF and Cash separately until total >= fireTarget.
 * Monthly savings are added exclusively to ETF.
 * Cash grows only via interest — no savings added, no principal withdrawn.
 */
export function calcFIREDate(
  etfBalance:       number,
  cashBalance:      number,
  etfRate:          number,   // annual return % (e.g. 7)
  cashRate:         number,   // annual interest % (e.g. 2)
  monthlySavings:   number,
  fireTarget:       number,
  savingsGrowthRate: number = 0,  // annual savings growth % (e.g. 3)
): { year: number; month: string } {
  const etfMonthly  = etfRate  / 100 / 12;
  const cashMonthly = cashRate / 100 / 12;

  let etf     = etfBalance;
  let cash    = cashBalance;
  let savings = monthlySavings;
  let months  = 0;

  while (etf + cash < fireTarget && months < 600) {
    // Apply savings growth at the start of each new year (after the first)
    if (months > 0 && months % 12 === 0 && savingsGrowthRate > 0) {
      savings *= (1 + savingsGrowthRate / 100);
    }
    etf  = etf  * (1 + etfMonthly)  + savings;
    cash = cash * (1 + cashMonthly);
    months++;
  }

  const fireDate = new Date();
  fireDate.setMonth(fireDate.getMonth() + months);
  return { year: fireDate.getFullYear(), month: getLocalizedMonthName(fireDate.getMonth()) };
}
