import { useState, useMemo, useCallback } from 'react';
import { useFireContext } from '../../context/FireContext';
import { fireService } from '../../services/fire';
import { calcMonteCarlo, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
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

  const [runKey, setRunKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentYear = new Date().getFullYear();

  const result: MonteCarloResult = useMemo(() => {
    const grossSWR = fireService.calcGrossSWR(state);
    const annualWithdrawal = grossSWR * 12;
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
  }, [simRange, simConfig, state.etfRate, state.pensionAge, state.pensionMonthly, state.currentAge, runKey]);

  const handleRerun = useCallback(() => setRunKey(k => k + 1), []);

  const successPct = Math.round(result.successRate);
  const isBadSuccess = successPct < 60;
  const risiko = getRisiko(result.successRate);

  // Format values for views
  const fireTargetFormatted = fmtEuro(fireTarget);
  const finalPoint = result.fanData.at(-1);
  const zielwert = finalPoint ? finalPoint.p50 : result.medianFinalWealth;
  const kpiZielwert = fmtEuro(zielwert);
  const kpiErfolgsrate = result.successRate.toFixed(1).replace('.', ',') + '%';

  return (
    <>
      <MonteCarloView
        result={result}
        fireTargetFormatted={fireTargetFormatted}
        fireYear={fireDate.year}
        successPct={successPct}
        isBadSuccess={isBadSuccess}
        risikoLabel={risiko.label}
        risikoColor={risiko.color}
        simConfig={simConfig}
        simRange={simRange}
        currentYear={currentYear}
        kpiZielwert={kpiZielwert}
        kpiErfolgsrate={kpiErfolgsrate}
        onSimConfigChange={setSimConfig}
        onSimRangeChange={setSimRange}
        onFullscreenOpen={() => setIsFullscreen(true)}
        onRerun={handleRerun}
      />
      <FullscreenMonteCarloContainer
        simConfig={simConfig}
        simRange={simRange}
        runKey={runKey}
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
}
