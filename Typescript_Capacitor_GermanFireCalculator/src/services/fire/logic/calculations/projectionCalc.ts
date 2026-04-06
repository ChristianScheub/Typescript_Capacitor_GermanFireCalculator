import type { FireState } from '../../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

export function calcMonthlySavings(state: FireState): number {
  return state.monthlyNetto * (state.savingsRate / 100);
}

export function calcFIREDate(
  startCapital:   number,
  monthlySavings: number,
  fireTarget:     number,
  annualReturn:   number = FIRE_CONSTANTS.ANNUAL_RETURN,
): { year: number; month: string } {
  const monthlyReturn = annualReturn / 12;
  let capital = startCapital;
  let months  = 0;

  while (capital < fireTarget && months < 600) {
    capital = capital * (1 + monthlyReturn) + monthlySavings;
    months++;
  }

  const fireDate   = new Date();
  fireDate.setMonth(fireDate.getMonth() + months);

  const MONTH_NAMES = [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
  ];
  return { year: fireDate.getFullYear(), month: MONTH_NAMES[fireDate.getMonth()] };
}
