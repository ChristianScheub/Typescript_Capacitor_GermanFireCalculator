import type { IMonteCarloCalculatorService } from './IMonteCarloCalculatorService';
import { calcMonteCarlo } from './logic/monteCarloCalc';

export const monteCarloCalculatorService: IMonteCarloCalculatorService = {
  calcMonteCarlo,
};

export { calcMonteCarlo } from './logic/monteCarloCalc';
export { calcMonteCarloPro } from './logic/monteCarloProCalc';
export { fmtM, fmtEuro } from './logic/monteCarloDisplayFormatters';
export { getRisiko } from './logic/monteCarloRisk';
export type { MonteCarloParams, MonteCarloProParams, FanDataPoint, MonteCarloResult } from '../../types/monteCarloCalculator/models/monteCarloTypes';
