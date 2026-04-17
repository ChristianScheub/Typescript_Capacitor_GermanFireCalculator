import type { MonteCarloParams, MonteCarloResult, FanDataPoint } from '../../../types/monteCarloCalculator/models/monteCarloTypes';

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
 * Runs a Monte Carlo simulation for retirement sustainability.
 *
 * @param fireWealth       Portfolio value at FIRE date (€)
 * @param annualWithdrawal Annual gross withdrawal at FIRE date (€/yr, in today's money)
 * @param meanAnnualReturn Expected annual portfolio return (% e.g. 7)
 * @param fireAge          User's age at FIRE date
 * @param params           Simulation parameters (inflation range, volatility, iterations)
 */
export function calcMonteCarlo(
  fireWealth:        number,
  annualWithdrawal:  number,
  meanAnnualReturn:  number,
  fireAge:           number,
  params:            MonteCarloParams,
): MonteCarloResult {
  const { minInflation, maxInflation, volatility, numSimulations, pensionAge, pensionAnnualNet, startYear, simulateUntilYear } = params;
  const yearsInRetirement = Math.max(1, simulateUntilYear - startYear);
  const meanReturn = meanAnnualReturn / 100;
  const stdDev     = volatility / 100;

  // Wealth path by year index (0 = at FIRE): array of sim values per year
  const wealthByYear: number[][] = Array.from({ length: yearsInRetirement + 1 }, () => []);

  let successCount = 0;
  const finalWealths: number[] = [];
  const failAges: number[] = [];

  for (let sim = 0; sim < numSimulations; sim++) {
    let wealth     = fireWealth;
    let withdrawal = annualWithdrawal;
    let pension    = pensionAnnualNet;
    let failAge    = -1;

    wealthByYear[0].push(wealth);

    for (let y = 1; y <= yearsInRetirement; y++) {
      const annualReturn = randNormal(meanReturn, stdDev);
      const inflation    = (minInflation + Math.random() * (maxInflation - minInflation)) / 100;

      // From pensionAge onwards, state pension reduces portfolio withdrawal
      const currentAge      = fireAge + y;
      const pensionOffset   = currentAge >= pensionAge ? pension : 0;
      const netWithdrawal   = Math.max(0, withdrawal - pensionOffset);

      wealth     = wealth * (1 + annualReturn) - netWithdrawal;
      withdrawal = withdrawal * (1 + inflation);
      pension    = pension    * (1 + inflation);

      if (wealth <= 0) {
        wealth = 0;
        if (failAge === -1) failAge = fireAge + y;
      }

      wealthByYear[y].push(wealth);
    }

    if (failAge >= 0) {
      failAges.push(failAge);
      finalWealths.push(0);
    } else {
      successCount++;
      finalWealths.push(wealth);
    }
  }

  // Pessimistic age: 5th percentile of ages when money ran out
  const pessimisticAge = failAges.length > 0
    ? failAges.toSorted((a, b) => a - b)[Math.max(0, Math.floor(failAges.length * 0.05))]
    : 100;

  // Median final wealth (0 for failed simulations)
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
