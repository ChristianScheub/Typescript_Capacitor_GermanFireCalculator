import type { FireState } from '../../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

/**
 * Berechnet die Abgaben-Quote (Steuern + KV) auf eine monatliche Brutto-Entnahme.
 * Rückgabe: Prozentwert 0–100.
 */
export function calcAbgabenQuote(state: FireState, grossMonthly: number): number {
  if (grossMonthly <= 0) return 0;

  // KV
  const kvCost = state.isPkvUser
    ? state.pkvContribution
    : grossMonthly * FIRE_CONSTANTS.GKV_RATE;

  // Kapitalertragsteuer (Simulationsannahme: 50 % Gewinnanteil)
  const gainPortion      = grossMonthly * FIRE_CONSTANTS.GAIN_RATIO;
  const taxableGain      = gainPortion * (1 - FIRE_CONSTANTS.ETF_TEILFREISTELLUNG);
  const monthlyPausch    = FIRE_CONSTANTS.SPARER_PAUSCHBETRAG / 12;
  const taxBase          = Math.max(0, taxableGain - monthlyPausch);
  const abgeltungssteuer = taxBase * FIRE_CONSTANTS.ABGELTUNGSSTEUER_RATE;
  const soli             = abgeltungssteuer * FIRE_CONSTANTS.SOLI_RATE;
  const kirchensteuer    = state.hasKirchensteuer
    ? abgeltungssteuer * FIRE_CONSTANTS.KIRCHENSTEUER_RATE
    : 0;

  const total = kvCost + abgeltungssteuer + soli + kirchensteuer;
  return (total / grossMonthly) * 100;
}

export function calcNetSWR(state: FireState, grossSWR: number): number {
  const quote = calcAbgabenQuote(state, grossSWR);
  return grossSWR * (1 - quote / 100);
}
