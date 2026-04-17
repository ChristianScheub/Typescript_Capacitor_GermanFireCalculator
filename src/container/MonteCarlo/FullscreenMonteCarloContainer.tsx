import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFireContext } from '../../context/useFireContext';
import { calcMonteCarlo, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import { fmtPercent } from '../../services/fire';
import type { MonteCarloResult } from '../../services/monteCarloCalculator';
import { FullscreenMonteCarloView } from '../../views/FullscreenMonteCarloView';

interface FullscreenMonteCarloContainerProps {
  readonly simConfig: {
    readonly minInflation: number;
    readonly maxInflation: number;
    readonly volatility: number;
  };
  readonly simRange: {
    readonly startCapital: number;
    readonly startYear: number;
    readonly endYear: number;
  };
  readonly monthlyWithdrawal: number;
  readonly runKey: number;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function FullscreenMonteCarloContainer({
  simConfig,
  simRange,
  monthlyWithdrawal,
  runKey,
  isOpen,
  onClose,
}: FullscreenMonteCarloContainerProps) {
  const { t } = useTranslation();
  const { state } = useFireContext();

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

  if (!isOpen) return null;

  const risiko = getRisiko(result.successRate);

  // Format values for view
  const finalPoint = result.fanData.at(-1);
  const zielwert = finalPoint ? finalPoint.p50 : result.medianFinalWealth;
  const kpiZielwert = fmtEuro(zielwert);
  const kpiErfolgsrate = fmtPercent(result.successRate, 1) + '%';

  return (
    <FullscreenMonteCarloView
      fanData={result.fanData}
      zielwert={kpiZielwert}
      erfolgsrate={kpiErfolgsrate}
      risikoLabel={t(risiko.labelKey)}
      risikoColor={risiko.color}
      onClose={onClose}
    />
  );
}
