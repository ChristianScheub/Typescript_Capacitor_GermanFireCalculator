import type { ChartDataPoint } from '../../../../types/fire/models/ChartDataPoint';
import { FIRE_CONSTANTS }       from '../fireConfig';

export function calcProjectedWealth(
  startCapital:    number,
  monthlySavings:  number,
  monthlyWithdraw: number,
  fireYear:        number,
  targetYears:     number[],
  annualReturn:    number = FIRE_CONSTANTS.ANNUAL_RETURN,
): ChartDataPoint[] {
  const currentYear   = new Date().getFullYear();
  const monthlyReturn = annualReturn / 12;

  return targetYears.map(year => {
    const months = Math.max(0, (year - currentYear) * 12);
    let capital  = startCapital;

    for (let m = 0; m < months; m++) {
      const calendarYear = currentYear + m / 12;
      const saving       = calendarYear < fireYear;
      capital = capital * (1 + monthlyReturn)
              + (saving ? monthlySavings  : 0)
              - (saving ? 0               : monthlyWithdraw);
      capital = Math.max(0, capital);
    }

    const label    = year === currentYear ? 'HEUTE' : String(year);
    const sublabel = year === fireYear
      ? '(FIRE)'
      : year === fireYear + FIRE_CONSTANTS.YEARS_TO_PENSION
      ? '(RENTE)'
      : undefined;

    return { year, value: capital, label, sublabel, isFIRE: year === fireYear };
  });
}
