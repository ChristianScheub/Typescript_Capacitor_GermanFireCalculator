import { useState, useMemo, useCallback } from 'react';
import { useFireContext } from '../../context/FireContext';
import { calcMonteCarloPro, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import { fireService, FIRE_CONSTANTS } from '../../services/fire';
import type { MonteCarloResult } from '../../services/monteCarloCalculator';
import { MonteCarloView } from '../../views/MonteCarloView';
import type { SimConfig, SimRange, DrawdownConfig } from '../../views/MonteCarloView';
import { FullscreenMonteCarloContainer } from './FullscreenMonteCarloContainer';

export function MonteCarloProContainer() {
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

  const defaultMonthlyWithdrawal = useMemo(() => {
    const baseExpenses = state.fixedExpenses + state.variableExpenses;
    if (state.isPkvUser) {
      return baseExpenses + state.pkvContribution;
    }
    const weightedReturn = fireService.calcWeightedReturn(state);
    const uncappedGKV = (baseExpenses * 12) / (state.etfWithdrawalRate / 100 * (1 - state.assetTaxRate / 100))
      * weightedReturn * FIRE_CONSTANTS.GKV_RATE / 12;
    const kvMonthly = Math.min(uncappedGKV, FIRE_CONSTANTS.GKV_MAX_MONTHLY);
    return baseExpenses + kvMonthly;
  }, [state]);

  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(defaultMonthlyWithdrawal);

  const [drawdownConfig, setDrawdownConfig] = useState<DrawdownConfig>({
    drawdownThreshold: 20,
    recoveryThreshold: 15,
    reducedMonthlyWithdrawal: Math.round(defaultMonthlyWithdrawal * 0.7),
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

    return calcMonteCarloPro(
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
        drawdownThreshold: drawdownConfig.drawdownThreshold,
        recoveryThreshold: drawdownConfig.recoveryThreshold,
        reducedAnnualWithdrawal: drawdownConfig.reducedMonthlyWithdrawal * 12,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simRange, simConfig, drawdownConfig, state.etfRate, state.pensionAge, state.pensionMonthly, state.currentAge, monthlyWithdrawal, runKey]);

  const handleRerun = useCallback(() => setRunKey(k => k + 1), []);
  const handleVolatilityChange = useCallback((v: number) => setDisplayVolatility(v), []);

  const successPct = Math.round(result.successRate);
  const isBadSuccess = successPct < 60;
  const risiko = getRisiko(result.successRate);

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
        drawdownConfig={drawdownConfig}
        currentYear={currentYear}
        kpiZielwert={kpiZielwert}
        kpiErfolgsrate={kpiErfolgsrate}
        displayVolatility={displayVolatility}
        titleKey="monteCarloProView.title"
        subtitleKey="monteCarloProView.subtitle"
        onSimConfigChange={setSimConfig}
        onSimRangeChange={setSimRange}
        onMonthlyWithdrawalChange={setMonthlyWithdrawal}
        onDrawdownConfigChange={setDrawdownConfig}
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
