import type { MonteCarloProParams, MonteCarloResult, FanDataPoint } from '../../../types/monteCarloCalculator/models/monteCarloTypes';

interface SimState {
  wealth: number;
  withdrawal: number;
  pension: number;
  failAge: number;
  ath: number;
  inReducedMode: boolean;
  troughWealth: number;
}

interface SimParams {
  annualWithdrawal: number;
  reducedAnnualWithdrawal: number;
  fireAge: number;
  pensionAge: number;
  meanReturn: number;
  stdDev: number;
  minInflation: number;
  maxInflation: number;
  drawdownFactor: number;
  recoveryFactor: number;
}

function updateSpendingMode(state: SimState, preWithdrawalWealth: number, drawdownFactor: number, recoveryFactor: number): void {
  if (state.inReducedMode) {
    if (preWithdrawalWealth < state.troughWealth) state.troughWealth = preWithdrawalWealth;
    if (preWithdrawalWealth >= state.troughWealth * recoveryFactor) state.inReducedMode = false;
  } else if (preWithdrawalWealth < state.ath * drawdownFactor) {
    state.inReducedMode = true;
    state.troughWealth = preWithdrawalWealth;
  }
}

function simulateProYear(state: SimState, y: number, p: SimParams): void {
  const annualReturn = randNormal(p.meanReturn, p.stdDev);
  const inflation    = (p.minInflation + Math.random() * (p.maxInflation - p.minInflation)) / 100;
  const preWithdrawalWealth = state.wealth * (1 + annualReturn);

  if (preWithdrawalWealth > state.ath) state.ath = preWithdrawalWealth;

  updateSpendingMode(state, preWithdrawalWealth, p.drawdownFactor, p.recoveryFactor);

  const effectiveWithdrawal = state.inReducedMode
    ? (p.reducedAnnualWithdrawal / p.annualWithdrawal) * state.withdrawal
    : state.withdrawal;

  const currentAge    = p.fireAge + y;
  const pensionOffset = currentAge >= p.pensionAge ? state.pension : 0;
  const netWithdrawal = Math.max(0, effectiveWithdrawal - pensionOffset);

  state.wealth     = preWithdrawalWealth - netWithdrawal;
  state.withdrawal = state.withdrawal * (1 + inflation);
  state.pension    = state.pension    * (1 + inflation);

  if (state.wealth <= 0) {
    state.wealth  = 0;
    if (state.failAge === -1) state.failAge = currentAge;
  }
}

/** Box-Muller normal distribution */
function randNormal(mean: number, stddev: number): number {
  const u1 = Math.random() || 1e-10;
  const u2 = Math.random();
  return mean + stddev * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo  = Math.floor(idx);
  const hi  = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Monte Carlo Pro – same as calcMonteCarlo but with dynamic spending cuts:
 * When the portfolio drops X% below its all-time-high the annual withdrawal
 * is reduced to `reducedAnnualWithdrawal`. Normal spending is restored once
 * the portfolio has recovered C% above the recorded trough.
 *
 * @param fireWealth              Portfolio value at FIRE date (€)
 * @param annualWithdrawal        Normal annual gross withdrawal (€/yr, in today's money)
 * @param meanAnnualReturn        Expected annual portfolio return (% e.g. 7)
 * @param fireAge                 User's age at FIRE date
 * @param params                  Pro simulation parameters
 */
export function calcMonteCarloPro(
  fireWealth:       number,
  annualWithdrawal: number,
  meanAnnualReturn: number,
  fireAge:          number,
  params:           MonteCarloProParams,
): MonteCarloResult {
  const {
    minInflation, maxInflation, volatility, numSimulations,
    pensionAge, pensionAnnualNet, startYear, simulateUntilYear,
    drawdownThreshold, recoveryThreshold, reducedAnnualWithdrawal,
  } = params;

  const yearsInRetirement = Math.max(1, simulateUntilYear - startYear);
  const meanReturn = meanAnnualReturn / 100;
  const stdDev     = volatility / 100;

  const drawdownFactor  = 1 - drawdownThreshold / 100;   // e.g. 0.80 for 20% drop
  const recoveryFactor  = 1 + recoveryThreshold / 100;   // e.g. 1.15 for 15% rise

  const wealthByYear: number[][] = Array.from({ length: yearsInRetirement + 1 }, () => []);

  let successCount = 0;
  const finalWealths: number[] = [];
  const failAges: number[] = [];

  const simParams: SimParams = {
    annualWithdrawal, reducedAnnualWithdrawal,
    fireAge, pensionAge, meanReturn, stdDev,
    minInflation, maxInflation, drawdownFactor, recoveryFactor,
  };

  for (let sim = 0; sim < numSimulations; sim++) {
    const state: SimState = {
      wealth: fireWealth, withdrawal: annualWithdrawal, pension: pensionAnnualNet,
      failAge: -1, ath: fireWealth, inReducedMode: false, troughWealth: fireWealth,
    };

    wealthByYear[0].push(state.wealth);

    for (let y = 1; y <= yearsInRetirement; y++) {
      simulateProYear(state, y, simParams);
      wealthByYear[y].push(state.wealth);
    }

    if (state.failAge >= 0) {
      failAges.push(state.failAge);
      finalWealths.push(0);
    } else {
      successCount++;
      finalWealths.push(state.wealth);
    }
  }

  const pessimisticAge = failAges.length > 0
    ? failAges.toSorted((a, b) => a - b)[Math.max(0, Math.floor(failAges.length * 0.05))]
    : 100;

  const sortedFinalWealths = finalWealths.toSorted((a, b) => a - b);
  const medianFinalWealth  = percentile(sortedFinalWealths, 50);

  const fanData: FanDataPoint[] = wealthByYear.map((vals, idx) => {
    const sorted = vals.toSorted((a, b) => a - b);
    return {
      age:  fireAge + idx,
      year: startYear + idx,
      p5:   Math.max(0, percentile(sorted, 5)),
      p25:  Math.max(0, percentile(sorted, 25)),
      p50:  Math.max(0, percentile(sorted, 50)),
      p75:  Math.max(0, percentile(sorted, 75)),
      p95:  Math.max(0, percentile(sorted, 95)),
    };
  });

  return {
    successRate: (successCount / numSimulations) * 100,
    successCount,
    numSimulations,
    pessimisticAge,
    medianFinalWealth,
    fanData,
  };
}
