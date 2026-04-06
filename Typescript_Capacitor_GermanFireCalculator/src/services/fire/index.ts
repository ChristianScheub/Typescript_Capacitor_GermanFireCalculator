import type { IFireService } from './IFireService';
import { calcNetWorth, calcGrossSWR }             from './logic/netWorthCalc';
import { calcAbgabenQuote, calcNetSWR }           from './logic/taxCalc';
import { calcFireTarget, calcFirePercentage }     from './logic/fireCalc';
import { calcMonthlySavings, calcFIREDate }       from './logic/projectionCalc';
import { calcProjectedWealth }                    from './logic/wealthProjection';
import type { FireState } from '../../types/fire/models/FireState';

const DEFAULT_STATE: FireState = {
  monthlyBrutto:    6500,
  monthlyNetto:     3800,
  savingsRate:      25,
  etfBalance:       125000,
  cashBalance:      15000,
  cryptoBalance:    5000,
  currentExpenses:  2400,
  pensionExpenses:  2800,
  isPkvUser:        false,
  pkvContribution:  0,
  hasKirchensteuer: false,
};

export const fireService: IFireService = {
  calcNetWorth,
  calcGrossSWR,
  calcAbgabenQuote,
  calcNetSWR,
  calcFireTarget,
  calcFirePercentage,
  calcMonthlySavings,
  calcFIREDate,
  calcProjectedWealth,
  getDefaultState: () => ({ ...DEFAULT_STATE }),
};
