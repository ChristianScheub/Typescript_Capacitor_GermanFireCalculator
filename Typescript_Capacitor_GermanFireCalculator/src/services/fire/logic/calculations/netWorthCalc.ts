import type { FireState } from '../../../../types/fire/models/FireState';
import { FIRE_CONSTANTS }  from '../fireConfig';

export function calcNetWorth(state: FireState): number {
  return state.etfBalance + state.cashBalance + state.cryptoBalance;
}

export function calcGrossSWR(netWorth: number): number {
  return (netWorth * FIRE_CONSTANTS.SWR_RATE) / 12;
}
