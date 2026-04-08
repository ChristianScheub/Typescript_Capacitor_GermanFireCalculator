import { type ReactNode }    from 'react';
import { useTranslation }   from 'react-i18next';

interface SteuerViewProps {
  firePercentageRounded:   number;
  firePercentage:          number;
  fireDateMonth:           string;
  fireDateYear:            number;
  netWorthFormatted:       string;
  fireTargetFormatted:     string;
  monthlySavingsFormatted: string;
  annualReturnFormatted:   string;
  // Scenario deltas
  teilzeitDeltaYears:      number;
  crashDeltaMonths:        number;
  hardcoreDeltaYears:      number;
  // Selection state
  isTeilzeitSelected:      boolean;
  isCrashSelected:         boolean;
  isHardcoreSelected:      boolean;
  isMonteCarloSelected:    boolean;
  // Handlers
  onSelectTeilzeit:        () => void;
  onSelectCrash:           () => void;
  onSelectHardcore:        () => void;
  onSelectMonteCarlo:      () => void;
  // Inline prognose
  inlinePrognose:          ReactNode;
}

export function SteuerView({
  firePercentageRounded,
  firePercentage,
  fireDateMonth,
  fireDateYear,
  netWorthFormatted,
  fireTargetFormatted,
  monthlySavingsFormatted,
  annualReturnFormatted,
  teilzeitDeltaYears,
  crashDeltaMonths,
  hardcoreDeltaYears,
  isTeilzeitSelected,
  isCrashSelected,
  isHardcoreSelected,
  isMonteCarloSelected,
  onSelectTeilzeit,
  onSelectCrash,
  onSelectHardcore,
  onSelectMonteCarlo,
  inlinePrognose,
}: SteuerViewProps) {
  const { t } = useTranslation();

  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>{t('tax.title')}</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d={t('tax.icon1')} />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content">
        <section className="page-title-section">
          <p className="label-overline">AKTUELLER STATUS</p>
          <div className="page-title-row">
            <h1 className="page-heading" style={{ marginBottom: 0 }}>Szenarien</h1>
            <span className="page-title-pct">{firePercentageRounded}% zum Ziel</span>
          </div>
        </section>

        {/* ── FIRE-Datum Hero Card ── */}
        <div className="card scenario-hero-card">
          <p className="scenario-hero-card__overline">Voraussichtliches FIRE-Datum</p>
          <p className="scenario-hero-card__date">{fireDateMonth} {fireDateYear}</p>
          <div className="scenario-hero-card__progress-row">
            <span className="scenario-hero-card__progress-label">Fortschritt</span>
            <span className="scenario-hero-card__progress-values">
              {netWorthFormatted} € / {fireTargetFormatted} €
            </span>
          </div>
          <div className="scenario-hero-card__bar">
            <div className="scenario-hero-card__bar-fill" style={{ width: `${Math.min(100, firePercentage)}%` }} />
          </div>
          <div className="scenario-hero-card__info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <span>
              <strong>{t('tax.baseScenario')}</strong><br />
              Dein aktueller Plan basiert auf einer Sparrate von{' '}
              <strong>{monthlySavingsFormatted} €</strong> und einer erwarteten Rendite von{' '}
              <strong>{annualReturnFormatted}% p.a.</strong>
            </span>
          </div>
        </div>

        {/* ── Card 1: Teilzeit-Turbo ── */}
        <button
          className={`card scenario-analysis-card${isTeilzeitSelected ? ' scenario-analysis-card--selected' : ''}`}
          onClick={onSelectTeilzeit}
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
            <p className="scenario-analysis-card__title">{t('tax.partTime')}</p>
            <p className="scenario-analysis-card__sub">Was, wenn ich ab sofort einen Tag weniger arbeite? (Senkung der Sparrate um 30%)</p>
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
          className={`card scenario-analysis-card${isCrashSelected ? ' scenario-analysis-card--selected' : ''}`}
          onClick={onSelectCrash}
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
            <p className="scenario-analysis-card__title">{t('tax.crash')}</p>
            <p className="scenario-analysis-card__sub">Hält mein Plan einen Crash im nächsten Jahr aus?</p>
          </div>
          <div className="scenario-analysis-card__result">
            <span className="scenario-analysis-card__result-badge scenario-analysis-card__result-badge--danger">
              {crashDeltaMonths > 0 ? `+${crashDeltaMonths}` : String(crashDeltaMonths)} Monate Verschiebung
            </span>
          </div>
        </button>

        {/* ── Card 3: Hardcore FIRE ── */}
        <button
          className={`card scenario-analysis-card${isHardcoreSelected ? ' scenario-analysis-card--selected' : ''}`}
          onClick={onSelectHardcore}
        >
          <div className="scenario-analysis-card__type-row">
            <div className="scenario-analysis-card__icon scenario-analysis-card__icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t('tax.icon2')}/>
              </svg>
            </div>
            <span className="scenario-analysis-card__type-badge scenario-analysis-card__type-badge--lifestyle">SPAREN</span>
          </div>
          <div className="scenario-analysis-card__title-wrap">
            <p className="scenario-analysis-card__title">{t('tax.hardcoreFire')}</p>
            <p className="scenario-analysis-card__sub">{t('tax.hardcoreFireSub')}</p>
          </div>
          <div className="scenario-analysis-card__result">
            <span className="scenario-analysis-card__result-badge scenario-analysis-card__result-badge--positive">
              {hardcoreDeltaYears} {Math.abs(hardcoreDeltaYears) === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} {hardcoreDeltaYears <= 0 ? t('tax.earlier') : t('tax.later')}
            </span>
            <span className="scenario-analysis-card__result-text">
              {t('tax.hardcoreFireHint')}
            </span>
          </div>
        </button>

        {/* ── Card 4: Monte-Carlo Simulation ── */}
        <button
          className={`card scenario-analysis-card${isMonteCarloSelected ? ' scenario-analysis-card--selected' : ''}`}
          onClick={onSelectMonteCarlo}
        >
          <div className="scenario-analysis-card__type-row">
            <div className="scenario-analysis-card__icon scenario-analysis-card__icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="9" height="9" rx="1"/>
                <rect x="13" y="2" width="9" height="9" rx="1"/>
                <rect x="2" y="13" width="9" height="9" rx="1"/>
                <rect x="13" y="13" width="9" height="9" rx="1"/>
                <circle cx="6.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                <circle cx="20.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                <circle cx="6.5" cy="17.5" r="1" fill="currentColor" stroke="none"/>
                <circle cx="17.5" cy="17.5" r="1" fill="currentColor" stroke="none"/>
                <circle cx="17.5" cy="20.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="scenario-analysis-card__type-badge scenario-analysis-card__type-badge--risk">SIMULATION</span>
          </div>
          <div className="scenario-analysis-card__title-wrap">
            <p className="scenario-analysis-card__title">Monte-Carlo Simulation</p>
            <p className="scenario-analysis-card__sub">Wie wahrscheinlich reicht mein Kapital bis zum 100. Lebensjahr?</p>
          </div>
          <div className="scenario-analysis-card__result">
            <span className="scenario-analysis-card__result-badge scenario-analysis-card__result-badge--positive">
              1.000 Marktszenarien
            </span>
            <span className="scenario-analysis-card__result-text">
              Stochastische Analyse mit Inflations-Bandbreite &amp; Volatilität.
            </span>
          </div>
        </button>

        {inlinePrognose}
      </div>
    </div>
  );
}
