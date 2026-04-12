import type { FireState } from '../../../../types/fire/models/FireState';

export function calcNetWorth(state: FireState): number {
  return state.etfBalance + state.cashBalance;
}

/** Monthly gross safe withdrawal: ETF uses etfWithdrawalRate, Cash yields only interest. */
export function calcGrossSWR(state: FireState): number {
  return (
    state.etfBalance * (state.etfWithdrawalRate / 100)
    + state.cashBalance * (state.cashRate / 100)
  ) / 12;
}
