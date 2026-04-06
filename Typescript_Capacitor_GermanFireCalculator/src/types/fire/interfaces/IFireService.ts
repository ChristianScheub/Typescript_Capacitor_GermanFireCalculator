import type { FireState }      from '../models/FireState';
import type { ChartDataPoint } from '../models/ChartDataPoint';

export interface IFireService {
  calcNetWorth(state: FireState): number;
  calcGrossSWR(netWorth: number): number;
  calcAbgabenQuote(state: FireState, grossMonthly: number): number;
  calcNetSWR(state: FireState, grossSWR: number): number;
  calcFireTarget(state: FireState): number;
  calcFirePercentage(netWorth: number, fireTarget: number): number;
  calcMonthlySavings(state: FireState): number;
  calcFIREDate(
    startCapital:   number,
    monthlySavings: number,
    fireTarget:     number,
  ): { year: number; month: string };
  calcProjectedWealth(
    startCapital:    number,
    monthlySavings:  number,
    monthlyWithdraw: number,
    fireYear:        number,
    targetYears:     number[],
  ): ChartDataPoint[];
  getDefaultState(): FireState;
}
