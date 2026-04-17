import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFireContext } from '../../context/useFireContext';
import { fireService, FIRE_CONSTANTS, fmtPercent, fmtK } from '../../services/fire';
import type { PrognoseConfig } from '../../types/prognose/PrognoseConfig';
import type { PrognoseTableRow } from '../../types/prognose/PrognoseTableRow';
import { usePrognoseChartData } from '../../hooks/prognose/usePrognoseChartData';
import { PrognoseContentView } from '../../views/PrognoseContentView';
import { FullscreenMonteCarloView } from '../../views/FullscreenMonteCarloView';

interface Props {
  readonly config: PrognoseConfig;
}

export function PrognoseContentContainer({ config }: Props) {
  const { t } = useTranslation();
  const { state: baseState, fireDate: baseFIREDate } = useFireContext();
  const [isMcFullscreenOpen, setIsMcFullscreenOpen] = useState(false);

  // Merged state
  const state = useMemo(() => ({ ...baseState, ...config.stateOverride }), [baseState, config.stateOverride]);

  // Core calculations
  const netWorth = useMemo(() => fireService.calcNetWorth(state), [state]);
  const weightedReturn = useMemo(() => fireService.calcWeightedReturn(state), [state]);
  const fireTarget = useMemo(() => fireService.calcFireTarget(state, weightedReturn), [state, weightedReturn]);
  const firePercentage = useMemo(() => fireService.calcFirePercentage(netWorth, fireTarget), [netWorth, fireTarget]);
  const monthlySavings = useMemo(() => fireService.calcMonthlySavings(state), [state]);
  const grossSWR = useMemo(() => fireService.calcGrossSWR(state), [state]);
  const netSWR = useMemo(() => fireService.calcNetSWR(state, grossSWR), [state, grossSWR]);

  // FIRE date calculation
  const fireDate = useMemo(
    () =>
      fireService.calcFIREDate(
        state.etfBalance,
        state.cashBalance,
        state.etfRate,
        state.cashRate,
        monthlySavings,
        fireTarget,
        state.savingsGrowthRate,
      ),
    [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, fireTarget, state.savingsGrowthRate],
  );

  const currentYear = new Date().getFullYear();
  const pensionYear = currentYear + Math.max(0, state.pensionAge - state.currentAge);
  const yearsToFIRE = Math.max(0, fireDate.year - currentYear);
  const isOnTrack = fireDate.year <= baseFIREDate.year + 3;
  const realReturnPct = Math.round((weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100);

  // Table data
  const tableYears = useMemo(() => {
    const raw = [
      currentYear,
      currentYear + 1,
      currentYear + 2,
      currentYear + 6,
      currentYear + 11,
      fireDate.year,
      fireDate.year + 4,
      fireDate.year + 9,
      pensionYear,
    ];
    return [...new Set(raw)].filter(y => y >= currentYear).sort((a, b) => a - b);
  }, [currentYear, fireDate.year, pensionYear]);

  const monthlyWithdraw = state.fixedExpenses + state.pkvContribution + state.variableExpenses;

  const tableData = useMemo(
    () =>
      fireService.calcProjectedWealth(
        { etfBalance: state.etfBalance, cashBalance: state.cashBalance, monthlySavings, monthlyWithdraw, assetTaxRate: state.assetTaxRate },
        { etfRate: state.etfRate, cashRate: state.cashRate, savingsGrowthRate: state.savingsGrowthRate, inflationRate: state.inflationRate },
        fireDate.year, tableYears, pensionYear,
        { today: t('prognosis.chartTodayLabel'), fire: t('prognosis.chartFireLabel'), pension: t('prognosis.chartPensionLabel') },
      ),
    [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, monthlyWithdraw, state.assetTaxRate, fireDate.year, tableYears, pensionYear, state.savingsGrowthRate, state.inflationRate, t],
  );

  // Build table rows
  const baseGrossNeededAnnual = monthlyWithdraw * 12 / (1 - state.assetTaxRate / 100);

  const tableRows: PrognoseTableRow[] = useMemo(
    () =>
      tableData.map(row => {
        const isFire = row.year === fireDate.year;
        const isPension = row.year === pensionYear;
        const isPost = row.year >= fireDate.year;

        let badge: string;
        if (isFire) {
          badge = t('prognosis.badgeFireBegin');
        } else if (isPension) {
          badge = t('prognosis.badgePensionBegin');
        } else if (isPost) {
          badge = t('prognosis.badgeFirePension');
        } else {
          badge = t('prognosis.badgeSavings');
        }

        const yearsPostFire = isPost ? Math.max(0, row.year - fireDate.year) : 0;
        const grossNeededAnnual = isPost
          ? Math.round(baseGrossNeededAnnual * Math.pow(1 + state.inflationRate / 100, yearsPostFire))
          : 0;
        const cashInterestAnnual = isPost ? Math.round((row.cashValue * state.cashRate) / 100) : 0;
        const cashUsedAnnual = isPost ? Math.min(cashInterestAnnual, grossNeededAnnual) : 0;
        const etfWithdrawalAnnual = isPost ? Math.max(0, grossNeededAnnual - cashUsedAnnual) : 0;
        const annualIncome = Math.round((row.etfValue * state.etfRate) / 100 + (row.cashValue * state.cashRate) / 100);

        return {
          year: row.year,
          badge,
          isFeatured: isFire,
          entnahmeTotalFormatted: isPost ? fmtK(grossNeededAnnual) : '€0',
          entnahmeEtfFormatted: isPost ? fmtK(etfWithdrawalAnnual) : '€0',
          entnahmeCashFormatted: isPost ? fmtK(cashUsedAnnual) : '€0',
          totalValueFormatted: fmtK(row.value),
          etfValueFormatted: fmtK(row.etfValue),
          cashValueFormatted: fmtK(row.cashValue),
          renditeTotalFormatted: '+' + fmtK(annualIncome),
          etfRateDisplay: `${state.etfRate}%`,
          cashRateDisplay: `${state.cashRate}%`,
          isToday: row.year === currentYear,
          isFire,
          isPension,
        };
      }),
    [tableData, fireDate.year, pensionYear, baseGrossNeededAnnual, state.inflationRate, state.etfRate, state.cashRate, currentYear, t],
  );

  // Generate continuous year-by-year fan data for chart visualization
  const { fanData } = usePrognoseChartData(
    state,
    currentYear,
    fireDate.year,
    pensionYear,
    monthlySavings,
    monthlyWithdraw,
  );

  return (
    <>
      <PrognoseContentView
        fireTarget={fireTarget}
        fireYear={fireDate.year}
        firePercentage={firePercentage}
        yearsToFIRE={yearsToFIRE}
        isOnTrack={isOnTrack}
        currentYear={currentYear}
        netWorth={netWorth}
        netSWR={netSWR}
        pensionYear={pensionYear}
        pensionMonthly={state.pensionMonthly}
        tableRows={tableRows}
        weightedReturn={weightedReturn}
        realReturnPct={realReturnPct}
        fmtK={fmtK}
        fanData={fanData}
        onMcFullscreenOpen={() => setIsMcFullscreenOpen(true)}
      />
      {isMcFullscreenOpen && (
        <FullscreenMonteCarloView
          fanData={fanData}
          zielwert={fmtK(fireTarget)}
          erfolgsrate={fmtPercent(firePercentage, 1)}
          risikoLabel={t('prognosis.forecastLabel')}
          risikoColor="#3DAA72"
          onClose={() => setIsMcFullscreenOpen(false)}
        />
      )}
    </>
  );
}
