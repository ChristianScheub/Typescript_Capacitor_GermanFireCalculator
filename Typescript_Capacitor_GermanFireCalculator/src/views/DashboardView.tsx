import { useTranslation }     from 'react-i18next';
import { ProgressRing }       from '../ui/charts/ProgressRing';
import { BarChart }           from '../ui/charts/BarChart';
import { KpiCard }            from '../ui/cards/KpiCard';
import type { ChartDataPoint } from '../types/fire/models/ChartDataPoint';
import type { Tab }            from '../types/navigation/Tab';
import type { PrognoseConfig } from '../types/prognose/PrognoseConfig';

interface DashboardViewProps {
  firePercentage:          number;
  fireDateMonth:           string;
  fireDateYear:            number;
  netWorthFormatted:       string;
  growthBadge:             string;
  monthlySavingsFormatted: string;
  assetIncomeFormatted:    string;
  safeWithdrawalFormatted: string;
  chartData:               ChartDataPoint[];
  onTabChange:             (tab: Tab) => void;
  onNavigateToPrognose:    (cfg: PrognoseConfig) => void;
}

export function DashboardView({
  firePercentage,
  fireDateMonth,
  fireDateYear,
  netWorthFormatted,
  growthBadge,
  monthlySavingsFormatted,
  assetIncomeFormatted,
  safeWithdrawalFormatted,
  chartData,
  onTabChange,
  onNavigateToPrognose,
}: DashboardViewProps) {
  const { t } = useTranslation();

  return (
    <div className="screen">
      <div className="screen__content">
        <section className="hero-section">
          <p className="label-overline">{t('dashboard.financialIndependence')}</p>
          <p className="hero-subtitle">
            {t('dashboard.expectedFreedom')}&nbsp;<strong>{fireDateMonth} {fireDateYear}</strong>
          </p>
        </section>

        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => onTabChange('planner')}>
            {t('dashboard.adjustPlan')}
          </button>
          <button className="btn btn--ghost" onClick={() => onTabChange('scenarios')}>
            {t('dashboard.viewDetails')}
          </button>
        </div>

        <div className="card card--ring">
          <ProgressRing percentage={firePercentage} />
        </div>

        <div className="kpi-grid">
          <KpiCard
            label={t('dashboard.netWorth')}
            value={netWorthFormatted}
            unit="€"
            iconVariant="green"
            badgeText={`+${growthBadge}%`}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
          />
          <KpiCard
            label={t('planner.savingsRate')}
            value={monthlySavingsFormatted}
            unit={t('dashboard.perMonth')}
            iconVariant="teal"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t('dashboard.icon2')} /></svg>}
          />
          <KpiCard
            label={t('dashboard.assetIncome')}
            value={assetIncomeFormatted}
            unit={t('dashboard.perMonth')}
            iconVariant="red"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>}
          />
          <KpiCard
            label={t('dashboard.safeWithdrawal')}
            value={safeWithdrawalFormatted}
            unit={t('dashboard.perMonth')}
            iconVariant="orange"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          />
        </div>

        <button
          className="card chart-card chart-card--clickable"
          onClick={() => onNavigateToPrognose({ title: 'Prognose', badge: 'BASIS' })}
          aria-label={t('dashboard.openPrognosis')}
        >
          <div className="chart-card__header">
            <div>
              <h2 className="chart-card__title">{t('dashboard.title')}</h2>
              <p className="chart-card__subtitle">{t('dashboard.chartSubtitle')}</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chart-card__chevron">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="chart-wrap">
            <BarChart data={chartData} />
          </div>
        </button>

        <div className="card scenario-card" onClick={() => onTabChange('scenarios')}>
          <h3 className="scenario-card__title">{t('dashboard.scenariosTitle')}</h3>
          <p className="scenario-card__body">{t('dashboard.scenariosBody')}</p>
          <button className="scenario-card__btn">{t('dashboard.openExplorer')}</button>
        </div>
      </div>

      <button className="fab" aria-label={t('dashboard.fabLabel')} onClick={() => onTabChange('planner')}>+</button>
    </div>
  );
}
