import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFireContext } from '../../context/FireContext';
import { calcMonteCarloPro, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import { fireService, FIRE_CONSTANTS, fmtPercent } from '../../services/fire';
import { HelperService } from '../../services/helper';
import type { MonteCarloResult } from '../../services/monteCarloCalculator';
import { MonteCarloView } from '../../views/MonteCarloView';
import type { SimConfig, SimRange, DrawdownConfig } from '../../views/MonteCarloView';
import { FullscreenMonteCarloContainer } from './FullscreenMonteCarloContainer';

export function MonteCarloProContainer() {
  const { t } = useTranslation();
  const { state, fireDate, fireTarget } = useFireContext();

  const [simConfig, setSimConfig] = useState<SimConfig>({
    minInflation: 1.5,
    maxInflation: 4,
    volatility: 12.5,
  });

  const [simRange, setSimRange] = useState<SimRange>({
    startCapital: fireTarget,
    startYear: fireDate.year,
    endYear: fireDate.year + Math.max(1, 100 - (state.currentAge + Math.max(0, fireDate.year - new Date().getFullYear()))),
  });

  useEffect(() => {
    setSimRange(prev => ({
      ...prev,
      startCapital: fireTarget,
      startYear: fireDate.year,
    }));
  }, [fireTarget, fireDate.year]);

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
    const annualWithdrawal = HelperService.roundToTwoDecimals(monthlyWithdrawal * 12);
    const pensionAnnualNet = HelperService.roundToTwoDecimals(state.pensionMonthly * 12);
    const yearsToFIRE = Math.max(0, simRange.startYear - currentYear);
    const simFireAge = state.currentAge + yearsToFIRE;

    return calcMonteCarloPro(
      HelperService.roundToTwoDecimals(simRange.startCapital),
      annualWithdrawal,
      state.etfRate,
      simFireAge,
      {
        minInflation: HelperService.roundToTwoDecimals(simConfig.minInflation),
        maxInflation: HelperService.roundToTwoDecimals(simConfig.maxInflation),
        volatility: HelperService.roundToTwoDecimals(simConfig.volatility),
        numSimulations: 1000,
        pensionAge: state.pensionAge,
        pensionAnnualNet,
        startYear: simRange.startYear,
        simulateUntilYear: simRange.endYear,
        drawdownThreshold: HelperService.roundToTwoDecimals(drawdownConfig.drawdownThreshold),
        recoveryThreshold: HelperService.roundToTwoDecimals(drawdownConfig.recoveryThreshold),
        reducedAnnualWithdrawal: HelperService.roundToTwoDecimals(drawdownConfig.reducedMonthlyWithdrawal * 12),
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
  const zielwert = finalPoint ? HelperService.roundToTwoDecimals(finalPoint.p50) : HelperService.roundToTwoDecimals(result.medianFinalWealth);
  const kpiZielwert = fmtEuro(zielwert);
  const kpiErfolgsrate = fmtPercent(HelperService.roundToTwoDecimals(result.successRate), 1) + '%';

  return (
    <>
      <MonteCarloView
        result={result}
        successPct={successPct}
        isBadSuccess={isBadSuccess}
        risikoLabel={t(risiko.labelKey)}
        risikoColor={risiko.color}
        simConfig={{
          minInflation: HelperService.roundToTwoDecimals(simConfig.minInflation),
          maxInflation: HelperService.roundToTwoDecimals(simConfig.maxInflation),
          volatility: HelperService.roundToTwoDecimals(simConfig.volatility),
        }}
        simRange={{
          startCapital: HelperService.roundToTwoDecimals(simRange.startCapital),
          startYear: simRange.startYear,
          endYear: simRange.endYear,
        }}
        monthlyWithdrawal={HelperService.roundToTwoDecimals(monthlyWithdrawal)}
        drawdownConfig={drawdownConfig ? {
          drawdownThreshold: HelperService.roundToTwoDecimals(drawdownConfig.drawdownThreshold),
          recoveryThreshold: HelperService.roundToTwoDecimals(drawdownConfig.recoveryThreshold),
          reducedMonthlyWithdrawal: HelperService.roundToTwoDecimals(drawdownConfig.reducedMonthlyWithdrawal),
        } : undefined}
        currentYear={currentYear}
        kpiZielwert={kpiZielwert}
        kpiErfolgsrate={kpiErfolgsrate}
        displayVolatility={HelperService.roundToTwoDecimals(displayVolatility)}
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
