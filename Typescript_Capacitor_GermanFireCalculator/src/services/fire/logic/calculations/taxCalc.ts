import type { FireState } from '../../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

/**
 * Berechnet die Abgaben-Quote (Steuer + KV) auf eine monatliche Brutto-Entnahme.
 * Steuer: pauschal state.assetTaxRate % auf den gesamten Betrag (der Einfachheit halber).
 * Rückgabe: Prozentwert 0–100.
 */
export function calcAbgabenQuote(state: FireState, grossMonthly: number): number {
  if (grossMonthly <= 0) return 0;
  const kvCost  = state.isPkvUser
    ? state.pkvContribution
    : grossMonthly * FIRE_CONSTANTS.GKV_RATE;
  const taxCost = grossMonthly * (state.assetTaxRate / 100);
  return ((kvCost + taxCost) / grossMonthly) * 100;
}

export function calcNetSWR(state: FireState, grossSWR: number): number {
  const quote = calcAbgabenQuote(state, grossSWR);
  return grossSWR * (1 - quote / 100);
}
