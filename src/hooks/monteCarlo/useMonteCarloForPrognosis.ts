import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { calcMonteCarlo, getRisiko, fmtEuro } from '../../services/monteCarloCalculator';
import { fmtPercent } from '../../services/fire';
import type { MonteCarloForPrognosisResult } from '../../types/hooks/MonteCarloForPrognosisResult';

interface UseMonteCarloForPrognosisParams {
  fireTarget: number;
  fireYear: number;
  annualWithdrawal: number;
  weightedReturn: number;
  pensionAge: number;
  pensionMonthly: number;
  currentAge: number;
}

export function useMonteCarloForPrognosis({
  fireTarget,
  fireYear,
  annualWithdrawal,
  weightedReturn,
  pensionAge,
  pensionMonthly,
  currentAge,
}: UseMonteCarloForPrognosisParams): MonteCarloForPrognosisResult {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const pensionAnnualNet = pensionMonthly * 12;
  const yearsToFIRE = Math.max(0, fireYear - currentYear);
  const simFireAge = currentAge + yearsToFIRE;
  const pensionYearForSim = currentYear + Math.max(0, pensionAge - currentAge);

  // Extend simulation 10 years past pension
  const endYearForSim = pensionYearForSim + 10;

  const mcResult = useMemo(() => {
    return calcMonteCarlo(
      fireTarget,
      annualWithdrawal,
      weightedReturn * 100, // Convert to percentage
      simFireAge,
      {
        minInflation: 1.5,
        maxInflation: 4,
        volatility: 12.5,
        numSimulations: 1000,
        pensionAge,
        pensionAnnualNet,
        startYear: fireYear,
        simulateUntilYear: endYearForSim,
      },
    );
  }, [fireTarget, annualWithdrawal, weightedReturn, simFireAge, pensionAge, pensionAnnualNet, fireYear, endYearForSim]);

  const finalPoint = mcResult.fanData.at(-1);
  const mcZielwert = finalPoint ? finalPoint.p50 : mcResult.medianFinalWealth;
  const mcKpiZielwert = fmtEuro(mcZielwert);
  const mcKpiErfolgsrate = fmtPercent(mcResult.successRate, 1) + '%';
  const risiko = getRisiko(mcResult.successRate);

  return {
    fanData: mcResult.fanData,
    zielwert: mcKpiZielwert,
    erfolgsrate: mcKpiErfolgsrate,
    risikoLabel: t(risiko.labelKey),
    risikoColor: risiko.color,
  };
}
