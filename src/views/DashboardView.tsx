import { useTranslation }      from 'react-i18next';
import './DashboardView.css';
import { BarChart }            from '../ui/charts/BarChart';
import { KpiCard }             from '../ui/cards/KpiCard';
import { MilestoneCard }       from '../ui/cards/MilestoneCard';
import { Icon }                from '../ui/icons';
import type { ChartDataPoint } from '../types/fire/models/ChartDataPoint';
import type { Tab }            from '../types/navigation/Tab';

// Fill-based sparkle — not a stroke icon, intentionally kept inline
const SPARKLE_PATH = 'M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z';

const MASKED = '***';

interface DashboardViewProps {
  firePercentage:          number;
  yearsToFire:             number;
  netWorthFormatted:       string;
  monthlySavingsFormatted: string;
  annualReturnFormatted:   string;
  assetIncomeFormatted:    string;
  nextMilestoneText:       string;
  chartData:               ChartDataPoint[];
  showAbsoluteNumbers:     boolean;
  onTabChange:             (tab: Tab) => void;
}

export function DashboardView({
  firePercentage,
  yearsToFire,
  netWorthFormatted,
  monthlySavingsFormatted,
  annualReturnFormatted,
  assetIncomeFormatted,
  nextMilestoneText,
  chartData,
  showAbsoluteNumbers,
  onTabChange,
}: DashboardViewProps) {
  const { t } = useTranslation();

  return (
    <div className="screen">
      <div className="screen__content">

        {/* ── Title ── */}
        <section className="page-title-section">
          <p className="label-overline">{t('dashboard.financialIndependence')}</p>
          <h1 className="page-heading">{t('dashboard.foundationTitle')}</h1>
        </section>

        {/* ── Hero achievement card ── */}
        <div className="card scenario-hero-card">
          <div className="scenario-hero-card__top-row">
            <p className="scenario-hero-card__overline">{t('dashboard.goalAchievement')}</p>
            <svg className="dashboard-hero__sparkle" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d={SPARKLE_PATH}/>
            </svg>
          </div>
          <p className="scenario-hero-card__date">
            {t('dashboard.financialFreedomIn')}<br />
            <span className="dashboard-hero__years">{yearsToFire}</span>
            {' '}{t('dashboard.yearsUnit')}
          </p>
          <div className="scenario-hero-card__progress-row">
            <span className="scenario-hero-card__progress-label">{t('dashboard.progressStart')}</span>
            <span className="scenario-hero-card__progress-values">
              {Math.round(firePercentage)}% {t('dashboard.progressAchieved')}
            </span>
            <span className="scenario-hero-card__progress-label">{t('dashboard.progressGoal')}</span>
          </div>
          <div className="scenario-hero-card__bar">
            <div
              className="scenario-hero-card__bar-fill"
              style={{ '--width': `${Math.min(100, firePercentage)}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <div className="kpi-grid">
          <KpiCard
            label={t('dashboard.currentDepot')}
            value={showAbsoluteNumbers ? netWorthFormatted : MASKED}
            unit={showAbsoluteNumbers ? '€' : ''}
            iconVariant="green"
            icon={<Icon name="wallet" size="sm" />}
          />
          <KpiCard
            label={t('dashboard.savingsRateLabel')}
            value={showAbsoluteNumbers ? monthlySavingsFormatted : MASKED}
            unit={showAbsoluteNumbers ? t('dashboard.perMonth') : ''}
            iconVariant="teal"
            icon={<Icon name="heart" size="sm" />}
          />
          <KpiCard
            label={t('dashboard.assumedReturn')}
            value={annualReturnFormatted}
            unit={t('dashboard.paUnit')}
            iconVariant="orange"
            icon={<Icon name="trending" size="sm" />}
          />
          <KpiCard
            label={t('dashboard.assetIncome')}
            value={showAbsoluteNumbers ? assetIncomeFormatted : MASKED}
            unit={showAbsoluteNumbers ? t('dashboard.perMonth') : ''}
            iconVariant="red"
            icon={<Icon name="wallet_2" size="sm" />}
          />
        </div>

        {/* ── Zeitstrahl-Projektion ── */}
        <div className="chart-section-header">
          <h2 className="chart-section-header__title">{t('dashboard.timelineTitle')}</h2>
          <button className="chart-section-header__more" aria-label="mehr" onClick={() => onTabChange('scenarios')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>

        <button
          className="card chart-card chart-card--clickable"
          onClick={() => onTabChange('scenarios')}
          aria-label={t('dashboard.openPrognosis')}
        >
          <MilestoneCard
            icon={<Icon name="flag" size="md" />}
            label={t('dashboard.nextMilestone')}
            subtitle={nextMilestoneText}
            variant="fire"
          />
          <div className="chart-wrap">
            <BarChart data={chartData} hideValues={!showAbsoluteNumbers} />
          </div>
        </button>

      </div>

      <button className="fab" aria-label={t('dashboard.fabLabel')} onClick={() => onTabChange('planner')}>+</button>
    </div>
  );
}
