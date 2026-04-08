import { useState, useMemo, useCallback } from 'react';
import { useFireContext } from '../../context/FireContext';
import { calcMonteCarlo, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import { fireService, FIRE_CONSTANTS } from '../../services/fire';
import type { MonteCarloResult } from '../../services/monteCarloCalculator';
import { MonteCarloView } from '../../views/MonteCarloView';
import { FullscreenMonteCarloContainer } from './FullscreenMonteCarloContainer';

interface SimConfig {
  minInflation: number;
  maxInflation: number;
  volatility: number;
}

interface SimRange {
  startCapital: number;
  startYear: number;
  endYear: number;
}

export function MonteCarloContainer() {
  const { state, fireDate, fireTarget } = useFireContext();

  const [simConfig, setSimConfig] = useState<SimConfig>({
    minInflation: 1.5,
    maxInflation: 4.0,
    volatility: 12.5,
  });

  const [simRange, setSimRange] = useState<SimRange>({
    startCapital: fireTarget,
    startYear: fireDate.year,
    endYear: fireDate.year + Math.max(1, 100 - (state.currentAge + Math.max(0, fireDate.year - new Date().getFullYear()))),
  });

  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(() => {
    const baseExpenses = state.fixedExpenses + state.variableExpenses;
    if (state.isPkvUser) {
      return baseExpenses + state.pkvContribution;
    }
    // GKV: Berechne Beitrag basierend auf Portfolio-Return
    const weightedReturn = fireService.calcWeightedReturn(state);
    const uncappedGKV = (baseExpenses * 12) / (state.etfWithdrawalRate / 100 * (1 - state.assetTaxRate / 100))
      * weightedReturn * FIRE_CONSTANTS.GKV_RATE / 12;
    const kvMonthly = Math.min(uncappedGKV, FIRE_CONSTANTS.GKV_MAX_MONTHLY);
    return baseExpenses + kvMonthly;
  });

  const [runKey, setRunKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayVolatility, setDisplayVolatility] = useState(simConfig.volatility);

  const currentYear = new Date().getFullYear();

  const result: MonteCarloResult = useMemo(() => {
    const annualWithdrawal = monthlyWithdrawal * 12;
    const pensionAnnualNet = state.pensionMonthly * 12;
    const yearsToFIRE = Math.max(0, simRange.startYear - currentYear);
    const simFireAge = state.currentAge + yearsToFIRE;

    return calcMonteCarlo(
      simRange.startCapital,
      annualWithdrawal,
      state.etfRate,
      simFireAge,
      {
        minInflation: simConfig.minInflation,
        maxInflation: simConfig.maxInflation,
        volatility: simConfig.volatility,
        numSimulations: 1000,
        pensionAge: state.pensionAge,
        pensionAnnualNet,
        startYear: simRange.startYear,
        simulateUntilYear: simRange.endYear,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simRange, simConfig, state.etfRate, state.pensionAge, state.pensionMonthly, state.currentAge, monthlyWithdrawal, runKey]);

  const handleRerun = useCallback(() => setRunKey(k => k + 1), []);

  const handleVolatilityChange = useCallback((v: number) => setDisplayVolatility(v), []);

  const successPct = Math.round(result.successRate);
  const isBadSuccess = successPct < 60;
  const risiko = getRisiko(result.successRate);

  // Format values for views
  const finalPoint = result.fanData.at(-1);
  const zielwert = finalPoint ? finalPoint.p50 : result.medianFinalWealth;
  const kpiZielwert = fmtEuro(zielwert);
  const kpiErfolgsrate = result.successRate.toFixed(1).replace('.', ',') + '%';

  return (
    <>
      <MonteCarloView
        result={result}
        successPct={successPct}
        isBadSuccess={isBadSuccess}
        risikoLabel={risiko.label}
        risikoColor={risiko.color}
        simConfig={simConfig}
        simRange={simRange}
        monthlyWithdrawal={monthlyWithdrawal}
        currentYear={currentYear}
        kpiZielwert={kpiZielwert}
        kpiErfolgsrate={kpiErfolgsrate}
        displayVolatility={displayVolatility}
        onSimConfigChange={setSimConfig}
        onSimRangeChange={setSimRange}
        onMonthlyWithdrawalChange={setMonthlyWithdrawal}
        onVolatilityChange={handleVolatilityChange}
        onFullscreenOpen={() => setIsFullscreen(true)}
        onRerun={handleRerun}
      />
      <FullscreenMonteCarloContainer
        simConfig={simConfig}
        simRange={simRange}
        monthlyWithdrawal={monthlyWithdrawal}
        runKey={runKey}
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
}
