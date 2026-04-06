import { useMemo }                                        from 'react';
import { useFireContext }                                 from '../../context/FireContext';
import { fireService, fmtCurrency, FIRE_CONSTANTS }      from '../../services/fire';
import { PrognoseView }                                  from '../../views/PrognoseView';
import type { PrognoseConfig }                           from '../../types/prognose/PrognoseConfig';
import type { PrognoseTableRow }                         from '../../types/prognose/PrognoseTableRow';

function fmtCompactK(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + ' Mio.';
  if (v >= 1_000)     return Math.round(v / 1_000) + '.000';
  return String(Math.round(v));
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
  const fireTarget      = useMemo(() => fireService.calcFireTarget(state),                                              [state]);
  const firePercentage  = useMemo(() => fireService.calcFirePercentage(netWorth, fireTarget),                           [netWorth, fireTarget]);
  const monthlySavings  = useMemo(() => fireService.calcMonthlySavings(state),                                          [state]);
  const weightedReturn  = useMemo(() => fireService.calcWeightedReturn(state),                                          [state]);
  const fireDate        = useMemo(() => fireService.calcFIREDate(netWorth, monthlySavings, fireTarget, weightedReturn), [netWorth, monthlySavings, fireTarget, weightedReturn]);
  const grossSWR        = useMemo(() => fireService.calcGrossSWR(netWorth),                                             [netWorth]);
  const netSWR          = useMemo(() => fireService.calcNetSWR(state, grossSWR),                                        [state, grossSWR]);

  const currentYear       = new Date().getFullYear();
  const pensionYear       = currentYear + Math.max(0, state.pensionAge - state.currentAge);
  const yearsToFIRE       = Math.max(0, fireDate.year - currentYear);
  const isOnTrack         = fireDate.year <= baseFIREDate.year + 3;
  const realReturnPct     = Math.round((weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100);
  const monthlyWithdraw   = state.fixedExpenses + state.pkvContribution + state.variableExpenses;

  const tableYears = useMemo(() => {
    const raw = [
      currentYear, currentYear + 1, currentYear + 2, currentYear + 6, currentYear + 11,
      fireDate.year, fireDate.year + 4, fireDate.year + 9, pensionYear,
    ];
    return [...new Set(raw)].filter(y => y >= currentYear).sort((a, b) => a - b);
  }, [currentYear, fireDate.year, pensionYear]);

  const tableData = useMemo(
    () => fireService.calcProjectedWealth(
      netWorth, monthlySavings, monthlyWithdraw, fireDate.year, tableYears, weightedReturn,
    ),
    [netWorth, monthlySavings, monthlyWithdraw, fireDate.year, tableYears, weightedReturn],
  );

  const tableRows: PrognoseTableRow[] = tableData.map(row => {
    const isFire    = row.year === fireDate.year;
    const isPension = row.year === pensionYear;
    return {
      year:            row.year,
      valueFormatted:  fmtCurrency(row.value),
      incomeFormatted: fmtCurrency(Math.round(row.value * weightedReturn)),
      rowClassName:    ['prognose-table__row', isFire ? 'prognose-table__row--fire' : '', isPension ? 'prognose-table__row--pension' : ''].join(' ').trim(),
      isToday:         row.year === currentYear,
      isFire,
      isPension,
    };
  });

  return (
    <PrognoseView
      config={config}
      onBack={onBack}
      fireTargetText={`${fmtCompactK(fireTarget)} € bis ${fireDate.year}`}
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
