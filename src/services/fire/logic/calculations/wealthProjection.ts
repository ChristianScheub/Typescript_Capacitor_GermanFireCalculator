import type { ChartDataPoint } from '../../../../types/fire/models/ChartDataPoint';
import { FIRE_CONSTANTS }       from '../fireConfig';

export interface ChartPointLabels {
  today?:   string;
  fire?:    string;
  pension?: string;
}

export interface WealthProjectionPortfolio {
  etfBalance:      number;
  cashBalance:     number;
  monthlySavings:  number;
  monthlyWithdraw: number;
  assetTaxRate:    number;
}

export interface WealthProjectionRates {
  etfRate:           number;
  cashRate:          number;
  savingsGrowthRate?: number;
  inflationRate?:    number;
}

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
  portfolio:   WealthProjectionPortfolio,
  rates:       WealthProjectionRates,
  fireYear:    number,
  targetYears: number[],
  pensionYear?: number,
  labels:      ChartPointLabels = {},
): ChartDataPoint[] {
  const { etfBalance, cashBalance, monthlySavings, monthlyWithdraw, assetTaxRate } = portfolio;
  const { etfRate, cashRate, savingsGrowthRate = 0, inflationRate = 0 } = rates;
  const todayLabel   = labels.today   ?? 'TODAY';
  const fireLabel    = labels.fire    ?? '(FIRE)';
  const pensionLabel = labels.pension ?? '(PENSION)';
  const currentYear       = new Date().getFullYear();
  const etfGrowthMonthly  = etfRate  / 100 / 12;
  const cashGrowthMonthly = cashRate / 100 / 12;

  // Base gross needed before inflation (increases each year post-FIRE)
  const baseMonthlyGrossNeeded = monthlyWithdraw / (1 - assetTaxRate / 100);

  return targetYears.map(year => {
    const months = Math.max(0, (year - currentYear) * 12);
    let etf  = etfBalance;
    let cash = cashBalance;

    for (let m = 0; m < months; m++) {
      const yearOffset   = Math.floor(m / 12);
      const calendarYear = currentYear + m / 12;

      if (calendarYear < fireYear) {
        // Accumulation phase: savings grow each year
        const currentMonthlySavings = monthlySavings * Math.pow(1 + savingsGrowthRate / 100, yearOffset);
        etf  = etf  * (1 + etfGrowthMonthly) + currentMonthlySavings;
        cash = cash * (1 + cashGrowthMonthly);
      } else {
        // Withdrawal phase: expenses grow with inflation each year post-FIRE
        const yearsPostFire          = Math.floor(calendarYear - fireYear);
        const monthlyGrossNeeded     = baseMonthlyGrossNeeded * Math.pow(1 + inflationRate / 100, yearsPostFire);
        const cashInterestThisMonth  = cash * cashGrowthMonthly;
        const cashUsedThisMonth      = Math.min(cashInterestThisMonth, monthlyGrossNeeded);
        const cashSurplusThisMonth   = cashInterestThisMonth - cashUsedThisMonth;
        const etfWithdrawThisMonth   = Math.max(0, monthlyGrossNeeded - cashUsedThisMonth);
        etf  = etf * (1 + etfGrowthMonthly) - etfWithdrawThisMonth;
        cash = cash + cashSurplusThisMonth;
      }
      // ETF can go negative (portfolio depleted = debt); cash principal is never touched
      cash = Math.max(0, cash);
    }

    const total    = etf + cash;
    const label    = year === currentYear ? todayLabel : String(year);
    const resolvedPensionYear = pensionYear ?? fireYear + FIRE_CONSTANTS.YEARS_TO_PENSION;
    let sublabel: string | undefined;
    if (year === fireYear) {
      sublabel = fireLabel;
    } else if (year === resolvedPensionYear) {
      sublabel = pensionLabel;
    }

    return { year, value: total, etfValue: etf, cashValue: cash, label, sublabel, isFIRE: year === fireYear };
  });
}
