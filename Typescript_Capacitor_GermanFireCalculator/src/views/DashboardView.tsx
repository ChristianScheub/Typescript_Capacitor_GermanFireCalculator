import { useTranslation }      from 'react-i18next';
import './DashboardView.css';
import { BarChart }            from '../ui/charts/BarChart';
import { KpiCard }             from '../ui/cards/KpiCard';
import { MilestoneCard }       from '../ui/cards/MilestoneCard';
import { Icon }                from '../ui/icons';
import type { ChartDataPoint } from '../types/fire/models/ChartDataPoint';
import type { Tab }            from '../types/navigation/Tab';
import type { PrognoseConfig } from '../types/prognose/PrognoseConfig';

interface DashboardViewProps {
  firePercentage:          number;
  yearsToFire:             number;
  netWorthFormatted:       string;
  growthBadge:             string;
  monthlySavingsFormatted: string;
  annualReturnFormatted:   string;
  assetIncomeFormatted:    string;
  nextMilestoneText:       string;
  chartData:               ChartDataPoint[];
  onTabChange:             (tab: Tab) => void;
  onNavigateToPrognose:    (cfg: PrognoseConfig) => void;
}

export function DashboardView({
  firePercentage,
  yearsToFire,
  netWorthFormatted,
  growthBadge,
  monthlySavingsFormatted,
  annualReturnFormatted,
  assetIncomeFormatted,
  nextMilestoneText,
  chartData,
  onTabChange,
  onNavigateToPrognose,
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
              <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/>
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
            value={netWorthFormatted}
            unit="€"
            iconVariant="green"
            badgeVariant="positive"
            icon={<Icon name="wallet" size="sm" />}
          />
          <KpiCard
            label={t('dashboard.savingsRateLabel')}
            value={monthlySavingsFormatted}
            unit={t('dashboard.perMonth')}
            iconVariant="teal"
            badgeVariant="neutral"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t('dashboard.icon2')} /></svg>}
          />
          <KpiCard
            label={t('dashboard.assumedReturn')}
            value={annualReturnFormatted}
            unit={t('dashboard.paUnit')}
            iconVariant="orange"
            badgeVariant="neutral"
            icon={<Icon name="trending" size="sm" />}
          />
          <KpiCard
            label={t('dashboard.assetIncome')}
            value={assetIncomeFormatted}
            unit={t('dashboard.perMonth')}
            iconVariant="red"
            badgeVariant="neutral"
            icon={<Icon name="wallet_2" size="sm" />}
          />
        </div>

        {/* ── Zeitstrahl-Projektion ── */}
        <div className="chart-section-header">
          <h2 className="chart-section-header__title">{t('dashboard.timelineTitle')}</h2>
          <button className="chart-section-header__more" aria-label="mehr" onClick={() => onNavigateToPrognose({ title: 'Prognose', badge: 'BASIS' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>

        <button
          className="card chart-card chart-card--clickable"
          onClick={() => onNavigateToPrognose({ title: 'Prognose', badge: 'BASIS' })}
          aria-label={t('dashboard.openPrognosis')}
        >
          <MilestoneCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t('dashboard.milestoneIcon')}/><line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            }
            label={t('dashboard.nextMilestone')}
            subtitle={nextMilestoneText}
            variant="fire"
          />
          <div className="chart-wrap">
            <BarChart data={chartData} />
          </div>
        </button>

      </div>

      <button className="fab" aria-label={t('dashboard.fabLabel')} onClick={() => onTabChange('planner')}>+</button>
    </div>
  );
}
