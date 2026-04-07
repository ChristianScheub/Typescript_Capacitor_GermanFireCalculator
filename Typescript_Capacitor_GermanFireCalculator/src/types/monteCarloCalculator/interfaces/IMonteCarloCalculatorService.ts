import type { MonteCarloParams, MonteCarloResult } from '../models/monteCarloTypes';

export interface IMonteCarloCalculatorService {
  calcMonteCarlo(
    fireWealth:        number,
    annualWithdrawal:  number,
    meanAnnualReturn:  number,
    fireAge:           number,
    params:            MonteCarloParams,
  ): MonteCarloResult;
}
