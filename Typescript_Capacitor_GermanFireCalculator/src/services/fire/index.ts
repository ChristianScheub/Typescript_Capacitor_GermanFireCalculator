import type { IFireService } from './IFireService';
import { calcNetWorth, calcGrossSWR }                                       from './logic/calculations/netWorthCalc';
import { calcWeightedReturn, calcAssetIncome }                              from './logic/weightedReturnCalc';
import { calcAbgabenQuote, calcNetSWR }           from './logic/calculations/taxCalc';
import { calcFireTarget, calcFirePercentage }     from './logic/calculations/fireCalc';
import { calcMonthlySavings, calcFIREDate }       from './logic/calculations/projectionCalc';
import { calcProjectedWealth }                    from './logic/calculations/wealthProjection';
import type { FireState } from '../../types/fire/models/FireState';

export { fmtCurrency, fmtPercent } from './logic/formatters';
export { FIRE_CONSTANTS }          from './logic/fireConfig';

const DEFAULT_STATE: FireState = {
  monthlySavingsAmount: 950,
  etfBalance:           125000,
  etfRate:              7,
  cashBalance:          15000,
  cashRate:             2,
  cryptoBalance:        5000,
  cryptoRate:           15,
  fixedExpenses:        1500,
  variableExpenses:     800,
  isPkvUser:            false,
  pkvContribution:      0,
  hasKirchensteuer:     false,
  currentAge:           35,
  pensionAge:           67,
  pensionMonthly:       1450,
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
