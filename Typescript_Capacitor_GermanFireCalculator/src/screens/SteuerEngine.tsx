import { useMemo, useState }      from 'react';
import { useFireContext }          from '../context/FireContext';
import { fmtCurrency, fmtPercent, fireService, FIRE_CONSTANTS } from '../services/fire';
import { PrognoseContent }        from './PrognoseScreen';
import type { PrognoseConfig }    from '../types/prognose/PrognoseConfig';

export function SteuerEngine() {
  const { state, firePercentage, netWorth, fireDate, monthlySavings, fireTarget, weightedReturn } = useFireContext();

  const [selectedScenario, setSelectedScenario] = useState<PrognoseConfig | null>(null);

  // ── Szenario-Vorschaurechnungen ─────────────────────────────────────────────

  const teilzeitFIREDate = useMemo(() => {
    const reduced = state.savingsRate * FIRE_CONSTANTS.TEILZEIT_FACTOR;
    const savings = state.monthlyNetto * (reduced / 100);
    return fireService.calcFIREDate(netWorth, savings, fireTarget, weightedReturn);
  }, [state.savingsRate, state.monthlyNetto, netWorth, fireTarget, weightedReturn]);

  const teilzeitDeltaYears = teilzeitFIREDate.year - fireDate.year;

  const crashFIREDate = useMemo(() => {
    const crashedPortfolio = netWorth * FIRE_CONSTANTS.CRASH_FACTOR;
    return fireService.calcFIREDate(crashedPortfolio, monthlySavings, fireTarget, weightedReturn);
  }, [netWorth, monthlySavings, fireTarget, weightedReturn]);

  const crashDeltaMonths = Math.round(
    (crashFIREDate.year - fireDate.year) * 12
    + (new Date(crashFIREDate.year, 0).getMonth()
      - new Date(fireDate.year, 0).getMonth()),
  );

  const handleScenarioClick = (cfg: PrognoseConfig) => {
    setSelectedScenario(prev => prev?.title === cfg.title ? null : cfg);
  };

  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>FIRE LEDGER</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content">
        {/* ── Page Title ── */}
        <section className="page-title-section">
          <p className="label-overline">AKTUELLER STATUS</p>
          <div className="page-title-row">
            <h1 className="page-heading" style={{ marginBottom: 0 }}>Szenarien</h1>
            <span className="page-title-pct">{Math.round(firePercentage)}% zum Ziel</span>
          </div>
        </section>

        {/* ── FIRE-Datum Hero Card ── */}
        <div className="card scenario-hero-card">
          <p className="scenario-hero-card__overline">Voraussichtliches FIRE-Datum</p>
          <p className="scenario-hero-card__date">{fireDate.month} {fireDate.year}</p>
          <div className="scenario-hero-card__progress-row">
            <span className="scenario-hero-card__progress-label">Fortschritt</span>
            <span className="scenario-hero-card__progress-values">
              {fmtCurrency(netWorth)} € / {fmtCurrency(fireTarget)} €
            </span>
          </div>
          <div className="scenario-hero-card__bar">
            <div
              className="scenario-hero-card__bar-fill"
              style={{ width: `${Math.min(100, firePercentage)}%` }}
            />
          </div>
          <div className="scenario-hero-card__info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span>
              <strong>Basis-Szenario aktiv</strong><br />
              Dein aktueller Plan basiert auf einer Sparrate von{' '}
              <strong>{fmtCurrency(monthlySavings)} €</strong> und einer erwarteten Rendite von{' '}
              <strong>{fmtPercent(FIRE_CONSTANTS.ANNUAL_RETURN * 100, 0)}% p.a.</strong>
            </span>
          </div>
        </div>

        {/* ── Card 1: Teilzeit-Turbo ── */}
        <button
          className={`card scenario-analysis-card${selectedScenario?.title === 'Teilzeit-Turbo (80%)' ? ' scenario-analysis-card--selected' : ''}`}
          onClick={() => handleScenarioClick({
            title: 'Teilzeit-Turbo (80%)',
            badge: 'TEILZEIT',
            stateOverride: { savingsRate: state.savingsRate * FIRE_CONSTANTS.TEILZEIT_FACTOR },
          })}
        >
          <div className="scenario-analysis-card__type-row">
            <div className="scenario-analysis-card__icon scenario-analysis-card__icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="4"/>
                <line x1="12" y1="20" x2="12" y2="22"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="2" y1="12" x2="4" y2="12"/>
                <line x1="20" y1="12" x2="22" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </div>
            <span className="scenario-analysis-card__type-badge scenario-analysis-card__type-badge--lifestyle">LIFESTYLE</span>
          </div>
          <div className="scenario-analysis-card__title-wrap">
            <p className="scenario-analysis-card__title">Teilzeit-Turbo (80%)</p>
            <p className="scenario-analysis-card__sub">Was, wenn ich ab sofort einen Tag weniger arbeite?</p>
          </div>
          <div className="scenario-analysis-card__result">
            <span className="scenario-analysis-card__result-badge scenario-analysis-card__result-badge--warn">
              +{teilzeitDeltaYears} {teilzeitDeltaYears === 1 ? 'Jahr' : 'Jahre'} bis FIRE
            </span>
            <span className="scenario-analysis-card__result-text">
              +1 freier Tag pro Woche ab jetzt.
            </span>
          </div>
        </button>

        {/* ── Card 2: Börsen-Sturm ── */}
        <button
          className={`card scenario-analysis-card${selectedScenario?.title === 'Börsen-Sturm (-20%)' ? ' scenario-analysis-card--selected' : ''}`}
          onClick={() => handleScenarioClick({
            title: 'Börsen-Sturm (-20%)',
            badge: 'CRASH',
            stateOverride: {
              etfBalance:    state.etfBalance    * FIRE_CONSTANTS.CRASH_FACTOR,
              cryptoBalance: state.cryptoBalance * FIRE_CONSTANTS.CRASH_FACTOR,
            },
          })}
        >
          <div className="scenario-analysis-card__type-row">
            <div className="scenario-analysis-card__icon scenario-analysis-card__icon--red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span className="scenario-analysis-card__type-badge scenario-analysis-card__type-badge--risk">MARKT-RISIKO</span>
          </div>
          <div className="scenario-analysis-card__title-wrap">
            <p className="scenario-analysis-card__title">Börsen-Sturm (-20%)</p>
            <p className="scenario-analysis-card__sub">Hält mein Plan einen Crash im nächsten Jahr aus?</p>
          </div>
          <div className="scenario-analysis-card__result">
            <span className="scenario-analysis-card__result-badge scenario-analysis-card__result-badge--danger">
              {crashDeltaMonths > 0 ? `+${crashDeltaMonths}` : String(crashDeltaMonths)} Monate Verschiebung
            </span>
          </div>
        </button>

        {/* ── Inline Prognose (shown when a scenario is selected) ── */}
        {selectedScenario && (
          <div className="scenario-inline-prognose">
            <PrognoseContent config={selectedScenario} />
          </div>
        )}
      </div>
    </div>
  );
}
