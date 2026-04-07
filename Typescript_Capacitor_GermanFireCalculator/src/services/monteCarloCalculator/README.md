# Monte Carlo Calculator Service

Singleton facade for stochastic retirement sustainability simulations.

## Responsibilities
- Monte Carlo simulation over configurable number of market cycles
- Stochastic modelling of annual portfolio returns (Box-Muller normal distribution)
- Random inflation sampling within a configurable min/max range
- Success rate calculation (portfolio survives to age 100)
- Pessimistic age estimation (5th percentile of failure ages)
- Fan chart data generation (p5 / p25 / p50 / p75 / p95 wealth percentiles per year)

## Folder structure
- `index.ts` – public facade (exports `calcMonteCarlo` and all types)
- `IMonteCarloCalculatorService.ts` – re-exports the interface from `types/`
- `logic/monteCarloCalc.ts` – core simulation engine
