import type { FireState } from '../../../../types/fire/models/FireState';

export function calcMonthlySavings(state: FireState): number {
  return state.monthlySavingsAmount;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

/**
 * Simulates month-by-month growth of ETF and Cash separately until total >= fireTarget.
 * Monthly savings are added exclusively to ETF.
 * Cash grows only via interest — no savings added, no principal withdrawn.
 */
export function calcFIREDate(
  etfBalance:    number,
  cashBalance:   number,
  etfRate:       number,   // annual return % (e.g. 7)
  cashRate:      number,   // annual interest % (e.g. 2)
  monthlySavings: number,
  fireTarget:    number,
): { year: number; month: string } {
  const etfMonthly  = etfRate  / 100 / 12;
  const cashMonthly = cashRate / 100 / 12;

  let etf  = etfBalance;
  let cash = cashBalance;
  let months = 0;

  while (etf + cash < fireTarget && months < 600) {
    etf  = etf  * (1 + etfMonthly)  + monthlySavings;
    cash = cash * (1 + cashMonthly);
    months++;
  }

  const fireDate = new Date();
  fireDate.setMonth(fireDate.getMonth() + months);
  return { year: fireDate.getFullYear(), month: MONTH_NAMES[fireDate.getMonth()] };
}
