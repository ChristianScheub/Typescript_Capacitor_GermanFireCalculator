import type { FireState } from '../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

export function calcFireTarget(state: FireState): number {
  return (state.pensionExpenses * 12) / FIRE_CONSTANTS.SWR_RATE;
}

export function calcFirePercentage(netWorth: number, fireTarget: number): number {
  if (fireTarget <= 0) return 0;
  return Math.min(100, (netWorth / fireTarget) * 100);
}
