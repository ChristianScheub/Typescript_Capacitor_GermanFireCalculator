import { useMemo }                                        from 'react';
import { useTranslation }                                from 'react-i18next';
import { useFireContext }                                from '../../context/FireContext';
import { fireService, fmtCurrency, FIRE_CONSTANTS }      from '../../services/fire';
import type { PrognoseConfig }                           from '../../types/prognose/PrognoseConfig';
import type { PrognoseTableRow }                         from '../../types/prognose/PrognoseTableRow';

function fmtCompactK(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + ' Mio.';
  if (v >= 1_000)     return Math.round(v / 1_000) + '.000';
  return String(Math.round(v));
}

interface Props {
  config: PrognoseConfig;
}

export function PrognoseContentContainer({ config }: Props) {
  const { t } = useTranslation();
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

  const currentYear     = new Date().getFullYear();
  const pensionYear     = currentYear + Math.max(0, state.pensionAge - state.currentAge);
  const yearsToFIRE     = Math.max(0, fireDate.year - currentYear);
  const isOnTrack       = fireDate.year <= baseFIREDate.year + 3;
  const realReturnPct   = Math.round((weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100);
  const monthlyWithdraw = state.fixedExpenses + state.pkvContribution + state.variableExpenses;

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
    <>
      {/* ── Hero Card ── */}
      <div className="prognose-hero">
        <p className="prognose-hero__overline">{t('prognosis.wealth')}</p>
        <h1 className="prognose-hero__title">
          Ziel-Vermögen:<br />
          {fmtCompactK(fireTarget)} € bis {fireDate.year}
        </h1>
        <div className="prognose-hero__stats">
          <div className="prognose-hero__stat">
            <p className="prognose-hero__stat-label">FORTSCHRITT</p>
            <p className="prognose-hero__stat-value">{firePercentage.toFixed(1).replace('.', ',')}%</p>
          </div>
          <div className="prognose-hero__divider" />
          <div className="prognose-hero__stat">
            <p className="prognose-hero__stat-label">RESTZEIT</p>
            <p className="prognose-hero__stat-value">{yearsToFIRE} Jahre</p>
          </div>
        </div>
        <div className={`prognose-hero__status${isOnTrack ? ' prognose-hero__status--on-track' : ''}`}>
          <span className="prognose-hero__status-icon">{isOnTrack ? '⚡' : '⚠'}</span>
          <span>{isOnTrack ? t('prognosis.onTrack') : t('prognosis.slightlyDelayed')}</span>
        </div>
        <div className="prognose-hero__bar">
          <div className="prognose-hero__bar-fill" style={{ width: `${Math.min(100, firePercentage)}%` }} />
        </div>
      </div>

      {/* ── Milestone Cards ── */}
      <div className="milestone-list">
        <div className="milestone-card">
          <div className="milestone-icon milestone-icon--default">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">HEUTE</p>
            <p className="milestone-year">{currentYear}</p>
            <p className="milestone-sub">Startpunkt · {fmtCurrency(netWorth)} €</p>
          </div>
        </div>

        <div className="milestone-card milestone-card--fire">
          <div className="milestone-icon milestone-icon--fire">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">FIRE REACHED</p>
            <p className="milestone-year">{fireDate.year}</p>
            <p className="milestone-sub">Entnahme möglich · {fmtCurrency(netSWR)} € / Monat</p>
          </div>
        </div>

        <div className="milestone-card">
          <div className="milestone-icon milestone-icon--default">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">RENTE</p>
            <p className="milestone-year">{pensionYear}</p>
            <p className="milestone-sub">Zusatz-Einkommen · +{fmtCurrency(state.pensionMonthly)} € / Monat</p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="prognose-table-section">
        <h2 className="prognose-table-title">Vermögensentwicklung</h2>
        <p className="prognose-table-subtitle">
          Projektion basierend auf {realReturnPct}% Realrendite p.a. (gewichtet)
        </p>

        <div className="prognose-table">
          <div className="prognose-table__row prognose-table__row--header">
            <span>JAHR</span>
            <span>{t('prognosis.wealth')}</span>
            <span>{t('prognosis.incomeFromAssets')}</span>
          </div>

          {tableRows.map(row => (
            <div key={row.year} className={row.rowClassName}>
              <span className="prognose-table__year">
                {row.year}
                {row.isToday   && <span className="prognose-table__tag prognose-table__tag--heute">HEUTE</span>}
                {row.isFire    && <span className="prognose-table__tag prognose-table__tag--fire">FIRE</span>}
                {row.isPension && <span className="prognose-table__tag prognose-table__tag--rente">RENTE</span>}
              </span>
              <span className="prognose-table__value">{row.valueFormatted} €</span>
              <span className="prognose-table__income">{row.incomeFormatted} €</span>
            </div>
          ))}
        </div>

        <p className="prognose-table__footnote">
          Einkommen aus Assets = Portfoliowert × {(weightedReturn * 100).toFixed(1).replace('.', ',')}% p.a. (gewichtete Rendite)
        </p>
      </div>

      {/* ── Disclaimer ── */}
      <div className="prognose-disclaimer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="prognose-disclaimer__text">
          Diese Prognose dient zur Orientierung. Berechnungen erfolgen inflationsbereinigt (Realwerte).
          Tatsächliche Marktvolatilität kann zu Abweichungen führen. Überprüfen Sie Ihre Annahmen
          regelmäßig in den <strong>Scenarios</strong>.
        </p>
      </div>
    </>
  );
}
