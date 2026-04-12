import type { FireState }      from '../models/FireState';
import type { ChartDataPoint } from '../models/ChartDataPoint';

export interface IFireService {
  calcNetWorth(state: FireState): number;
  calcGrossSWR(state: FireState): number;
  calcAbgabenQuote(state: FireState, grossMonthly: number): number;
  calcNetSWR(state: FireState, grossSWR: number): number;
  calcFireTarget(state: FireState, weightedReturn?: number): number;
  calcFirePercentage(netWorth: number, fireTarget: number): number;
  calcMonthlySavings(state: FireState): number;
  calcWeightedReturn(state: FireState): number;
  calcAssetIncome(portfolioValue: number, weightedReturn: number): number;
  calcFIREDate(
    etfBalance:        number,
    cashBalance:       number,
    etfRate:           number,
    cashRate:          number,
    monthlySavings:    number,
    fireTarget:        number,
    savingsGrowthRate?: number,
  ): { year: number; month: string };
  calcProjectedWealth(
    etfBalance:         number,
    cashBalance:        number,
    etfRate:            number,
    cashRate:           number,
    monthlySavings:     number,
    monthlyWithdraw:    number,
    assetTaxRate:       number,
    fireYear:           number,
    targetYears:        number[],
    pensionYear?:       number,
    savingsGrowthRate?: number,
    inflationRate?:     number,
  ): ChartDataPoint[];
  getDefaultState(): FireState;
}
