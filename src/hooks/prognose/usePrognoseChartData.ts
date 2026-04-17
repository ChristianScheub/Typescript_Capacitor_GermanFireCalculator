import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fireService } from '../../services/fire';
import type { FanDataPoint } from '../../types/monteCarloCalculator/models/monteCarloTypes';
import type { FireState } from '../../types/fire/models/FireState';
import type { ChartDataPoint } from '../../types/fire/models/ChartDataPoint';

interface ChartDataResult {
  fanData: FanDataPoint[];
}

export function usePrognoseChartData(
  state: FireState,
  currentYear: number,
  fireYear: number,
  pensionYear: number,
  monthlySavings: number,
  monthlyWithdraw: number,
): ChartDataResult {
  const { t } = useTranslation();
  const chartEndYear = pensionYear + 10;
  const chartYears = useMemo(
    () => Array.from({ length: chartEndYear - currentYear + 1 }, (_, i) => currentYear + i),
    [currentYear, chartEndYear],
  );

  const chartData = useMemo(
    () =>
      fireService.calcProjectedWealth(
        { etfBalance: state.etfBalance, cashBalance: state.cashBalance, monthlySavings, monthlyWithdraw, assetTaxRate: state.assetTaxRate },
        { etfRate: state.etfRate, cashRate: state.cashRate, savingsGrowthRate: state.savingsGrowthRate, inflationRate: state.inflationRate },
        fireYear, chartYears, pensionYear,
        { today: t('prognosis.chartTodayLabel'), fire: t('prognosis.chartFireLabel'), pension: t('prognosis.chartPensionLabel') },
      ),
    [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, monthlyWithdraw, state.assetTaxRate, fireYear, chartYears, pensionYear, state.savingsGrowthRate, state.inflationRate, t],
  );

  const fanData: FanDataPoint[] = useMemo(() => {
    return chartData.map((row: ChartDataPoint) => {
      const age = state.currentAge + (row.year - currentYear);
      return {
        year: row.year,
        age,
        p5:  row.value,
        p25: row.value,
        p50: row.value,
        p75: row.value,
        p95: row.value,
      };
    });
  }, [chartData, state.currentAge, currentYear]);

  return { fanData };
}
