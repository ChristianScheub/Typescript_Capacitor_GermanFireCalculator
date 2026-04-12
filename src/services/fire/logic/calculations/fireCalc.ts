import type { FireState } from '../../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

/**
 * Calculates the FIRE target using the user-defined etfWithdrawalRate as SWR.
 * Cash contributes only interest (no principal withdrawal).
 * Tax is applied to effective SWR. GKV contribution is resolved analytically.
 *
 * GKV derivation:
 *   Net monthly = T * SWR*(1-tax)/12 - T * r * GKV_RATE/12 = baseExpenses
 *   → T = baseExpenses * 12 / (SWR*(1-tax) - r*GKV_RATE)
 *
 * PKV:
 *   T = (baseExpenses + pkvContribution) * 12 / (SWR * (1-tax))
 */
export function calcFireTarget(state: FireState, weightedReturn?: number): number {
  const swr          = state.etfWithdrawalRate / 100;
  const taxFactor    = 1 - state.assetTaxRate / 100;
  const effectiveSWR = swr * taxFactor;
  const baseExpenses = state.fixedExpenses + state.variableExpenses;

  if (!state.isPkvUser && weightedReturn !== undefined) {
    const denominator = effectiveSWR - weightedReturn * FIRE_CONSTANTS.GKV_RATE;
    if (denominator > 0) {
      const uncappedTarget = (baseExpenses * 12) / denominator;
      const uncappedGKV    = (uncappedTarget * weightedReturn * FIRE_CONSTANTS.GKV_RATE) / 12;
      if (uncappedGKV <= FIRE_CONSTANTS.GKV_MAX_MONTHLY) return uncappedTarget;
      return ((baseExpenses + FIRE_CONSTANTS.GKV_MAX_MONTHLY) * 12) / effectiveSWR;
    }
  }
  const kvMonthly = state.isPkvUser ? state.pkvContribution : 0;
  return ((baseExpenses + kvMonthly) * 12) / effectiveSWR;
}

export function calcFirePercentage(netWorth: number, fireTarget: number): number {
  if (fireTarget <= 0) return 0;
  return Math.min(100, (netWorth / fireTarget) * 100);
}
