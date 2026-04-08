import { type ReactNode }        from 'react';
import { useTranslation }       from 'react-i18next';
import { ScenarioAnalysisCard } from '../ui/cards/ScenarioAnalysisCard';

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
      <div className="screen__content">
        <section className="page-title-section">
          <p className="label-overline">{t('tax.currentStatus')}</p>
          <div className="page-title-row">
            <h1 className="page-heading" style={{ marginBottom: 0 }}>{t('tax.scenarios')}</h1>
            <span className="page-title-pct">{firePercentageRounded}% zum Ziel</span>
          </div>
        </section>

        {/* ── FIRE-Datum Hero Card ── */}
        <div className="card scenario-hero-card">
          <p className="scenario-hero-card__overline">{t('tax.expectedFireDate')}</p>
          <p className="scenario-hero-card__date">{fireDateMonth} {fireDateYear}</p>
          <div className="scenario-hero-card__progress-row">
            <span className="scenario-hero-card__progress-label">{t('tax.progress')}</span>
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
              {t('tax.baseScenarioInfo')}{' '}
              <strong>{monthlySavingsFormatted} €</strong> {t('tax.baseScenarioInfoReturn')}{' '}
              <strong>{annualReturnFormatted}% p.a.</strong>
            </span>
          </div>
        </div>

        <ScenarioAnalysisCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
          iconVariant="teal"
          typeBadge={t('tax.badgeLifestyle')}
          typeBadgeVariant="lifestyle"
          title={t('tax.partTime')}
          subtitle={t('tax.partTimeSub')}
          resultBadge={`+${teilzeitDeltaYears} ${teilzeitDeltaYears === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${t('tax.untilFire')}`}
          resultBadgeVariant="warn"
          resultText={t('tax.partTimeHint')}
          selected={isTeilzeitSelected}
          onClick={onSelectTeilzeit}
        />

        <ScenarioAnalysisCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          iconVariant="red"
          typeBadge={t('tax.badgeRisk')}
          typeBadgeVariant="risk"
          title={t('tax.crash')}
          subtitle={t('tax.crashSub')}
          resultBadge={`${crashDeltaMonths > 0 ? `+${crashDeltaMonths}` : String(crashDeltaMonths)} ${t('tax.crashDeltaUnit')}`}
          resultBadgeVariant="danger"
          selected={isCrashSelected}
          onClick={onSelectCrash}
        />

        <ScenarioAnalysisCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t('tax.icon2')}/></svg>}
          iconVariant="orange"
          typeBadge={t('tax.badgeSavings')}
          typeBadgeVariant="lifestyle"
          title={t('tax.hardcoreFire')}
          subtitle={t('tax.hardcoreFireSub')}
          resultBadge={`${hardcoreDeltaYears} ${Math.abs(hardcoreDeltaYears) === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${hardcoreDeltaYears <= 0 ? t('tax.earlier') : t('tax.later')}`}
          resultBadgeVariant="positive"
          resultText={t('tax.hardcoreFireHint')}
          selected={isHardcoreSelected}
          onClick={onSelectHardcore}
        />

        <ScenarioAnalysisCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="20.5" cy="6.5" r="1" fill="currentColor" stroke="none"/><circle cx="6.5" cy="17.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="17.5" r="1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20.5" r="1" fill="currentColor" stroke="none"/></svg>}
          iconVariant="teal"
          typeBadge={t('tax.badgeSimulation')}
          typeBadgeVariant="risk"
          title={t('tax.monteCarloTitle')}
          subtitle={t('tax.monteCarloSub')}
          resultBadge={t('tax.monteCarloSimulations')}
          resultBadgeVariant="positive"
          resultText={t('tax.monteCarloHint')}
          selected={isMonteCarloSelected}
          onClick={onSelectMonteCarlo}
        />

        {inlinePrognose}
      </div>
    </div>
  );
}
