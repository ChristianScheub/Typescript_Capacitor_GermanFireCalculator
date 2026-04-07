import { useMemo }                                        from 'react';
import { useFireContext }                                 from '../../context/FireContext';
import { fireService, fmtCurrency, FIRE_CONSTANTS }      from '../../services/fire';
import { PrognoseView }                                  from '../../views/PrognoseView';
import type { PrognoseConfig }                           from '../../types/prognose/PrognoseConfig';
import type { PrognoseTableRow }                         from '../../types/prognose/PrognoseTableRow';

function fmtK(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return '€' + (v / 1_000_000).toFixed(1).replace('.', ',') + ' Mio.';
  if (abs >= 1_000)     return '€' + Math.round(v / 1_000) + 'k';
  return '€' + Math.round(v);
}

interface Props {
  config: PrognoseConfig;
  onBack: () => void;
}

export function PrognoseContainer({ config, onBack }: Props) {
  const { state: baseState, fireDate: baseFIREDate } = useFireContext();

  const state = useMemo(
    () => ({ ...baseState, ...config.stateOverride }),
    [baseState, config.stateOverride],
  );

  const netWorth        = useMemo(() => fireService.calcNetWorth(state),                                                [state]);
  const weightedReturn  = useMemo(() => fireService.calcWeightedReturn(state),                                          [state]);
  const fireTarget      = useMemo(() => fireService.calcFireTarget(state, weightedReturn),                              [state, weightedReturn]);
  const firePercentage  = useMemo(() => fireService.calcFirePercentage(netWorth, fireTarget),                           [netWorth, fireTarget]);
  const monthlySavings  = useMemo(() => fireService.calcMonthlySavings(state),                                          [state]);
  const fireDate        = useMemo(() => fireService.calcFIREDate(state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, fireTarget, state.savingsGrowthRate), [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, fireTarget, state.savingsGrowthRate]);
  const grossSWR        = useMemo(() => fireService.calcGrossSWR(state),                                               [state]);
  const netSWR          = useMemo(() => fireService.calcNetSWR(state, grossSWR),                                        [state, grossSWR]);

  const currentYear       = new Date().getFullYear();
  const pensionYear       = currentYear + Math.max(0, state.pensionAge - state.currentAge);
  const yearsToFIRE       = Math.max(0, fireDate.year - currentYear);
  const isOnTrack         = fireDate.year <= baseFIREDate.year + 3;
  const realReturnPct     = Math.round((weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100);

  const tableYears = useMemo(() => {
    const raw = [
      currentYear, currentYear + 1, currentYear + 2, currentYear + 6, currentYear + 11,
      fireDate.year, fireDate.year + 4, fireDate.year + 9, pensionYear,
    ];
    return [...new Set(raw)].filter(y => y >= currentYear).sort((a, b) => a - b);
  }, [currentYear, fireDate.year, pensionYear]);

  const monthlyWithdraw = state.fixedExpenses + state.pkvContribution + state.variableExpenses;

  const tableData = useMemo(
    () => fireService.calcProjectedWealth(
      state.etfBalance, state.cashBalance, state.etfRate, state.cashRate,
      monthlySavings, monthlyWithdraw, state.assetTaxRate,
      fireDate.year, tableYears, pensionYear,
      state.savingsGrowthRate, state.inflationRate,
    ),
    [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, monthlyWithdraw, state.assetTaxRate, fireDate.year, tableYears, pensionYear, state.savingsGrowthRate, state.inflationRate],
  );

  const baseGrossNeededAnnual = monthlyWithdraw * 12 / (1 - state.assetTaxRate / 100);

  const tableRows: PrognoseTableRow[] = tableData.map(row => {
    const isFire    = row.year === fireDate.year;
    const isPension = row.year === pensionYear;
    const isPost    = row.year >= fireDate.year;

    const badge = isFire    ? 'FIRE BEGINN'
      : isPension           ? 'STAATLICHE RENTE BEGINN'
      : isPost              ? 'FIRE-RENTE'
      : 'ANSPAREN';

    // Inflation-adjusted annual withdrawal for this year
    const yearsPostFire      = isPost ? Math.max(0, row.year - fireDate.year) : 0;
    const grossNeededAnnual  = isPost ? Math.round(baseGrossNeededAnnual * Math.pow(1 + state.inflationRate / 100, yearsPostFire)) : 0;
    const cashInterestAnnual = isPost ? Math.round(row.cashValue * state.cashRate / 100) : 0;
    const cashUsedAnnual     = isPost ? Math.min(cashInterestAnnual, grossNeededAnnual)  : 0;
    const etfWithdrawalAnnual = isPost ? Math.max(0, grossNeededAnnual - cashUsedAnnual) : 0;

    const annualIncome = Math.round(row.etfValue * state.etfRate / 100 + row.cashValue * state.cashRate / 100);

    return {
      year:       row.year,
      badge,
      isFeatured: isFire,
      entnahmeTotalFormatted: isPost ? fmtK(grossNeededAnnual) : '€0',
      entnahmeEtfFormatted:   isPost ? fmtK(etfWithdrawalAnnual) : '€0',
      entnahmeCashFormatted:  isPost ? fmtK(cashUsedAnnual) : '€0',
      totalValueFormatted:    fmtK(row.value),
      etfValueFormatted:      fmtK(row.etfValue),
      cashValueFormatted:     fmtK(row.cashValue),
      renditeTotalFormatted:  '+' + fmtK(annualIncome),
      etfRateDisplay:         `${state.etfRate}%`,
      cashRateDisplay:        `${state.cashRate}%`,
      isToday:   row.year === currentYear,
      isFire,
      isPension,
    };
  });

  return (
    <PrognoseView
      config={config}
      onBack={onBack}
      fireTargetText={`${fmtK(fireTarget)} bis ${fireDate.year}`}
      firePercentageText={firePercentage.toFixed(1).replace('.', ',')}
      yearsToFIRE={yearsToFIRE}
      isOnTrack={isOnTrack}
      progressWidth={Math.min(100, firePercentage)}
      currentYear={currentYear}
      fireYear={fireDate.year}
      netWorthFormatted={fmtCurrency(netWorth)}
      netSWRFormatted={fmtCurrency(netSWR)}
      pensionYear={pensionYear}
      pensionMonthlyFormatted={fmtCurrency(state.pensionMonthly)}
      realReturnPct={realReturnPct}
      weightedReturnText={(weightedReturn * 100).toFixed(1).replace('.', ',')}
      tableRows={tableRows}
    />
  );
}
