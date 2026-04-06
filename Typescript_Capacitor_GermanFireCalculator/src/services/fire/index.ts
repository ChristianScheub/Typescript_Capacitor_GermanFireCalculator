import type { IFireService } from './IFireService';
import { calcNetWorth, calcGrossSWR, calcWeightedReturn, calcAssetIncome } from './logic/calculations/netWorthCalc';
import { calcAbgabenQuote, calcNetSWR }           from './logic/calculations/taxCalc';
import { calcFireTarget, calcFirePercentage }     from './logic/calculations/fireCalc';
import { calcMonthlySavings, calcFIREDate }       from './logic/calculations/projectionCalc';
import { calcProjectedWealth }                    from './logic/calculations/wealthProjection';
import type { FireState } from '../../types/fire/models/FireState';

export { fmtCurrency, fmtPercent } from './logic/formatters';
export { FIRE_CONSTANTS }          from './logic/fireConfig';

const DEFAULT_STATE: FireState = {
  monthlyBrutto:    6500,
  monthlyNetto:     3800,
  savingsRate:      25,
  etfBalance:       125000,
  etfRate:          7,
  cashBalance:      15000,
  cashRate:         2,
  cryptoBalance:    5000,
  cryptoRate:       15,
  pensionExpenses:  2800,
  isPkvUser:        false,
  pkvContribution:  0,
  hasKirchensteuer: false,
};

export const fireService: IFireService = {
  calcNetWorth,
  calcGrossSWR,
  calcWeightedReturn,
  calcAssetIncome,
  calcAbgabenQuote,
  calcNetSWR,
  calcFireTarget,
  calcFirePercentage,
  calcMonthlySavings,
  calcFIREDate,
  calcProjectedWealth,
  getDefaultState: () => ({ ...DEFAULT_STATE }),
};
