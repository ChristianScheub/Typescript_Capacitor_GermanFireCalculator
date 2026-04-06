import { useMemo }                                        from 'react';
import { useTranslation }                                from 'react-i18next';
import { useFireContext }                                from '../../context/FireContext';
import { fireService, fmtCurrency, FIRE_CONSTANTS }      from '../../services/fire'; // fmtCurrency used in milestone cards
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
}

export function PrognoseContentContainer({ config }: Props) {
  const { t } = useTranslation();
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
  const fireDate        = useMemo(() => fireService.calcFIREDate(state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, fireTarget), [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, fireTarget]);
  const grossSWR        = useMemo(() => fireService.calcGrossSWR(state),                                               [state]);
  const netSWR          = useMemo(() => fireService.calcNetSWR(state, grossSWR),                                        [state, grossSWR]);

  const currentYear     = new Date().getFullYear();
  const pensionYear     = currentYear + Math.max(0, state.pensionAge - state.currentAge);
  const yearsToFIRE     = Math.max(0, fireDate.year - currentYear);
  const isOnTrack       = fireDate.year <= baseFIREDate.year + 3;
  const realReturnPct   = Math.round((weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100);

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
    ),
    [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, monthlyWithdraw, state.assetTaxRate, fireDate.year, tableYears, pensionYear],
  );

  const grossNeededAnnual = Math.round(monthlyWithdraw * 12 / (1 - state.assetTaxRate / 100));

  const tableRows: PrognoseTableRow[] = tableData.map(row => {
    const isFire    = row.year === fireDate.year;
    const isPension = row.year === pensionYear;
    const isPost    = row.year >= fireDate.year;

    const badge = isFire    ? 'FIRE BEGINN'
      : isPension           ? 'STAATLICHE RENTE BEGINN'
      : isPost              ? 'FIRE-RENTE'
      : 'ANSPAREN';

    const cashInterestAnnual  = isPost ? Math.round(row.cashValue * state.cashRate / 100) : 0;
    const cashUsedAnnual      = isPost ? Math.min(cashInterestAnnual, grossNeededAnnual)  : 0;
    const etfWithdrawalAnnual = isPost ? Math.max(0, grossNeededAnnual - cashUsedAnnual)  : 0;
    const annualIncome        = Math.round(row.etfValue * state.etfRate / 100 + row.cashValue * state.cashRate / 100);

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
    <>
      {/* ── Hero Card ── */}
      <div className="prognose-hero">
        <p className="prognose-hero__overline">{t('prognosis.wealth')}</p>
        <h1 className="prognose-hero__title">
          Ziel-Vermögen:<br />
          {fmtK(fireTarget)} bis {fireDate.year}
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

      {/* ── Cards ── */}
      <div className="prognose-table-section">
        <h2 className="prognose-table-title">Vermögensentwicklung</h2>
        <p className="prognose-table-subtitle">
          Projektion basierend auf {realReturnPct}% Realrendite p.a. (gewichtet)
        </p>

        <div className="prognose-cards">
          {tableRows.map(row => (
            <div key={row.year} className={`prognose-card${row.isFeatured ? ' prognose-card--featured' : ''}`}>
              <div className="prognose-card__header">
                <span className="prognose-card__year">
                  {row.year}
                  {row.isToday && <span className="prognose-card__tag prognose-card__tag--heute">HEUTE</span>}
                </span>
                <span className="prognose-card__badge">{row.badge}</span>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">ENTNAHME</p>
                <p className="prognose-card__value">{row.entnahmeTotalFormatted}</p>
                <p className="prognose-card__sub">ETF {row.entnahmeEtfFormatted} · Cash {row.entnahmeCashFormatted}</p>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">VERMÖGEN</p>
                <p className="prognose-card__value">{row.totalValueFormatted}</p>
                <p className="prognose-card__sub">ETF {row.etfValueFormatted} · Cash {row.cashValueFormatted}</p>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">RENDITE</p>
                <p className="prognose-card__value">{row.renditeTotalFormatted}</p>
                <p className="prognose-card__sub">ETF {row.etfRateDisplay} · Cash {row.cashRateDisplay}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="prognose-table__footnote">
          Rendite = Portfoliowert × {(weightedReturn * 100).toFixed(1).replace('.', ',')}% p.a. (gewichtete Rendite)
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
