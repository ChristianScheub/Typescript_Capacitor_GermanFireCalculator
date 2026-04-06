import type { ChartDataPoint } from '../../../../types/fire/models/ChartDataPoint';
import { FIRE_CONSTANTS }       from '../fireConfig';

/**
 * Projects ETF and Cash wealth separately for each target year.
 *
 * Before FIRE:
 *   - ETF: grows at etfRate, monthly savings added
 *   - Cash: grows at cashRate (interest re-invested)
 *
 * After FIRE:
 *   - Gross needed per month = monthlyWithdraw / (1 - assetTaxRate/100)
 *   - Cash covers its interest first: cashMonthlyInterest = cash * cashRate/100/12
 *   - Remaining needed from ETF: max(0, grossNeeded - cashInterest)
 *   - ETF: grows at etfRate minus only the required withdrawal (not the full etfWithdrawalRate)
 *   - Cash: stays constant (interest is consumed for expenses, principal untouched)
 */
export function calcProjectedWealth(
  etfBalance:        number,
  cashBalance:       number,
  etfRate:           number,          // annual % (e.g. 7)
  cashRate:          number,          // annual % (e.g. 2)
  monthlySavings:    number,
  monthlyWithdraw:   number,          // net monthly expenses (post-tax basis)
  assetTaxRate:      number,          // % (e.g. 26.375)
  fireYear:          number,
  targetYears:       number[],
  pensionYear?:      number,
): ChartDataPoint[] {
  const currentYear       = new Date().getFullYear();
  const etfGrowthMonthly  = etfRate  / 100 / 12;
  const cashGrowthMonthly = cashRate / 100 / 12;

  // After FIRE: how much gross must be generated each month to net out to monthlyWithdraw
  const monthlyGrossNeeded = monthlyWithdraw / (1 - assetTaxRate / 100);

  return targetYears.map(year => {
    const months = Math.max(0, (year - currentYear) * 12);
    let etf  = etfBalance;
    let cash = cashBalance;

    for (let m = 0; m < months; m++) {
      const calendarYear = currentYear + m / 12;
      if (calendarYear < fireYear) {
        // Accumulation phase
        etf  = etf  * (1 + etfGrowthMonthly) + monthlySavings;
        cash = cash * (1 + cashGrowthMonthly);
      } else {
        // Withdrawal phase: use only as much cash interest as needed
        const cashInterestThisMonth = cash * cashGrowthMonthly;
        const cashUsedThisMonth     = Math.min(cashInterestThisMonth, monthlyGrossNeeded);
        const cashSurplusThisMonth  = cashInterestThisMonth - cashUsedThisMonth;
        const etfWithdrawThisMonth  = Math.max(0, monthlyGrossNeeded - cashUsedThisMonth);
        etf  = etf * (1 + etfGrowthMonthly) - etfWithdrawThisMonth;
        cash = cash + cashSurplusThisMonth;  // surplus interest stays in cash
      }
      etf  = Math.max(0, etf);
      cash = Math.max(0, cash);
    }

    const total    = etf + cash;
    const label    = year === currentYear ? 'HEUTE' : String(year);
    const resolvedPensionYear = pensionYear ?? fireYear + FIRE_CONSTANTS.YEARS_TO_PENSION;
    const sublabel = year === fireYear
      ? '(FIRE)'
      : year === resolvedPensionYear
      ? '(RENTE)'
      : undefined;

    return { year, value: total, etfValue: etf, cashValue: cash, label, sublabel, isFIRE: year === fireYear };
  });
}
