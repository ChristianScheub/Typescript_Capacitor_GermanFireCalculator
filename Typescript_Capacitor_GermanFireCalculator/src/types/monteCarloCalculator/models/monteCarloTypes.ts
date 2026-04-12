export interface MonteCarloParams {
  minInflation:     number;  // % e.g. 1.5
  maxInflation:     number;  // % e.g. 4.0
  volatility:       number;  // stddev % e.g. 12.5
  numSimulations:   number;  // e.g. 1000
  pensionAge:       number;  // age at which state pension starts
  pensionAnnualNet: number;  // annual net pension income (€/yr, in today's money)
  startYear:        number;  // calendar year the simulation begins (= FIRE year)
  simulateUntilYear: number; // calendar year to simulate until (e.g. 2090)
}

export interface MonteCarloProParams extends MonteCarloParams {
  drawdownThreshold:        number;  // % drop from ATH that triggers spending reduction (e.g. 20)
  recoveryThreshold:        number;  // % rise from trough that restores normal spending (e.g. 15)
  reducedAnnualWithdrawal:  number;  // reduced annual withdrawal amount (€/yr) when in drawdown mode
}

export interface FanDataPoint {
  age:  number;
  year: number;  // calendar year corresponding to this data point
  p5:   number;
  p25:  number;
  p50:  number;
  p75:  number;
  p95:  number;
}

export interface MonteCarloResult {
  successRate:       number;
  successCount:      number;
  numSimulations:    number;
  pessimisticAge:    number;
  medianFinalWealth: number;
  fanData:           FanDataPoint[];
}
