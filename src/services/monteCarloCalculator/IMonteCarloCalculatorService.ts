import type { MonteCarloParams, MonteCarloResult } from '../../types/monteCarloCalculator/models/monteCarloTypes';

export interface IMonteCarloCalculatorService {
  calcMonteCarlo(
    fireWealth:        number,
    annualWithdrawal:  number,
    meanAnnualReturn:  number,
    fireAge:           number,
    params:            MonteCarloParams,
  ): MonteCarloResult;
}
