import { useMemo } from 'react';
import { useFireContext }                      from '../context/FireContext';
import { fireService, fmtCurrency, FIRE_CONSTANTS } from '../services/fire';
import type { PrognoseConfig }                 from '../types/prognose/PrognoseConfig';
import type { ChartDataPoint }                 from '../types/fire/models/ChartDataPoint';

interface Props {
  config: PrognoseConfig;
  onBack: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtCompactK(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + ' Mio.';
  if (v >= 1_000)     return Math.round(v / 1_000) + '.000';
  return String(Math.round(v));
}

function fmtAssetIncome(portfolioValue: number, weightedReturn: number): string {
  const annual = portfolioValue * weightedReturn;
  return fmtCurrency(Math.round(annual)) + ' €';
}

// ─── Shared content (used inline in Szenarien and standalone in PrognoseScreen) ──

export function PrognoseContent({ config }: { config: PrognoseConfig }) {
  const { state: baseState, fireDate: baseFIREDate } = useFireContext();

  const state = useMemo(
    () => ({ ...baseState, ...config.stateOverride }),
    [baseState, config.stateOverride],
  );

  const netWorth        = useMemo(() => fireService.calcNetWorth(state),                                    [state]);
  const fireTarget      = useMemo(() => fireService.calcFireTarget(state),                                   [state]);
  const firePercentage  = useMemo(() => fireService.calcFirePercentage(netWorth, fireTarget),               [netWorth, fireTarget]);
  const monthlySavings  = useMemo(() => fireService.calcMonthlySavings(state),                              [state]);
  const weightedReturn  = useMemo(() => fireService.calcWeightedReturn(state),                              [state]);
  const fireDate        = useMemo(() => fireService.calcFIREDate(netWorth, monthlySavings, fireTarget, weightedReturn), [netWorth, monthlySavings, fireTarget, weightedReturn]);
  const grossSWR        = useMemo(() => fireService.calcGrossSWR(netWorth),                                 [netWorth]);
  const netSWR          = useMemo(() => fireService.calcNetSWR(state, grossSWR),                            [state, grossSWR]);

  const currentYear  = new Date().getFullYear();
  const pensionYear  = fireDate.year + FIRE_CONSTANTS.YEARS_TO_PENSION;
  const yearsToFIRE  = Math.max(0, fireDate.year - currentYear);
  const isOnTrack    = fireDate.year <= baseFIREDate.year + 3;

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

  const tableData = useMemo(
    () => fireService.calcProjectedWealth(
      netWorth, monthlySavings, state.pensionExpenses, fireDate.year, tableYears, weightedReturn,
    ),
    [netWorth, monthlySavings, state.pensionExpenses, fireDate.year, tableYears, weightedReturn],
  );

  const realReturnPct = Math.round(
    (weightedReturn - FIRE_CONSTANTS.ANNUAL_INFLATION) * 100,
  );

  return (
    <>
      {/* ── Hero Card ── */}
      <div className="prognose-hero">
        <p className="prognose-hero__overline">GESAMTZIEL &amp; VISION</p>
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
          <span>{isOnTrack ? 'Auf Kurs' : 'Leicht verzögert'}</span>
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
            <p className="milestone-sub">Zusatz-Einkommen · +{fmtCurrency(FIRE_CONSTANTS.STATUTORY_PENSION_MONTHLY)} € / Monat</p>
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
            <span>VERMÖGEN</span>
            <span>EINK. AUS ASSETS</span>
          </div>

          {tableData.map(row => {
            const isFire    = row.year === fireDate.year;
            const isPension = row.year === pensionYear;
            return (
              <div
                key={row.year}
                className={[
                  'prognose-table__row',
                  isFire    ? 'prognose-table__row--fire'    : '',
                  isPension ? 'prognose-table__row--pension'  : '',
                ].join(' ').trim()}
              >
                <span className="prognose-table__year">
                  {row.year}
                  {row.year === currentYear && (
                    <span className="prognose-table__tag prognose-table__tag--heute">HEUTE</span>
                  )}
                  {isFire && (
                    <span className="prognose-table__tag prognose-table__tag--fire">FIRE</span>
                  )}
                  {isPension && (
                    <span className="prognose-table__tag prognose-table__tag--rente">RENTE</span>
                  )}
                </span>
                <span className="prognose-table__value">{fmtCurrency(row.value)} €</span>
                <span className="prognose-table__income">{fmtAssetIncome(row.value, weightedReturn)}</span>
              </div>
            );
          })}
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

// ─── Full Screen (with header + back navigation) ──────────────────────────────

export function PrognoseScreen({ config, onBack }: Props) {
  return (
    <div className="screen">
      {/* ── Header ── */}
      <header className="app-header">
        <button className="icon-btn prognose-back" onClick={onBack} aria-label="Zurück">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="app-header__brand">
          <span>PROGNOSE</span>
          {config.badge && <span className="prognose-header-badge">{config.badge}</span>}
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="screen__content">
        <PrognoseContent config={config} />
      </div>
    </div>
  );
}
