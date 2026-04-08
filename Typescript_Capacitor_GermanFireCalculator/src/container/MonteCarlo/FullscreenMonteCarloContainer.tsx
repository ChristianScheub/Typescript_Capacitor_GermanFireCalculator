import { useMemo } from 'react';
import { useFireContext } from '../../context/FireContext';
import { fireService } from '../../services/fire';
import { calcMonteCarlo, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import type { MonteCarloResult } from '../../services/monteCarloCalculator';
import { FullscreenMonteCarloView } from '../../views/FullscreenMonteCarloView';

interface FullscreenMonteCarloContainerProps {
  simConfig: {
    minInflation: number;
    maxInflation: number;
    volatility: number;
  };
  simRange: {
    startCapital: number;
    startYear: number;
    endYear: number;
  };
  runKey: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenMonteCarloContainer({
  simConfig,
  simRange,
  runKey,
  isOpen,
  onClose,
}: FullscreenMonteCarloContainerProps) {
  const { state } = useFireContext();

  if (!isOpen) return null;

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

  const risiko = getRisiko(result.successRate);

  // Format values for view
  const finalPoint = result.fanData.at(-1);
  const zielwert = finalPoint ? finalPoint.p50 : result.medianFinalWealth;
  const kpiZielwert = fmtEuro(zielwert);
  const kpiErfolgsrate = result.successRate.toFixed(1).replace('.', ',') + '%';

  return (
    <FullscreenMonteCarloView
      fanData={result.fanData}
      zielwert={kpiZielwert}
      erfolgsrate={kpiErfolgsrate}
      risikoLabel={risiko.label}
      risikoColor={risiko.color}
      onClose={onClose}
    />
  );
}
