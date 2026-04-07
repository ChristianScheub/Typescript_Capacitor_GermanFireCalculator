import { useTranslation }     from 'react-i18next';
import { ProgressRing }       from '../ui/charts/ProgressRing';
import { BarChart }           from '../ui/charts/BarChart';
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
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>{t('dashboard.title')}</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d={t('dashboard.icon1')} />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content">
        <section className="hero-section">
          <p className="label-overline">FINANZIELLE UNABHÄNGIGKEIT</p>
          <p className="hero-subtitle">
            Voraussichtliche Freiheit:&nbsp;<strong>{fireDateMonth} {fireDateYear}</strong>
          </p>
        </section>

        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => onTabChange('planner')}>
            Plan<br />anpassen
          </button>
          <button className="btn btn--ghost" onClick={() => onTabChange('scenarios')}>
            Details<br />ansehen
          </button>
        </div>

        <div className="card card--ring">
          <ProgressRing percentage={firePercentage} />
        </div>

        <div className="kpi-grid">
          <div className="card kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-icon kpi-icon--green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <span className="badge badge--positive">+{growthBadge}%</span>
            </div>
            <p className="kpi-card__label">NETTOVERMÖGEN</p>
            <p className="kpi-card__value">{netWorthFormatted}&thinsp;€</p>
          </div>

          <div className="card kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-icon kpi-icon--teal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t('dashboard.icon2')} />
                </svg>
              </div>
            </div>
            <p className="kpi-card__label">{t('planner.savingsRate')}</p>
            <p className="kpi-card__value">{monthlySavingsFormatted}&thinsp;€<span className="kpi-card__unit">/Monat</span></p>
          </div>

          <div className="card kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-icon kpi-icon--red">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
            <p className="kpi-card__label">EINK. AUS ASSETS</p>
            <p className="kpi-card__value">{assetIncomeFormatted}&thinsp;€<span className="kpi-card__unit">/Monat</span></p>
          </div>

          <div className="card kpi-card">
            <div className="kpi-card__header">
              <div className="kpi-icon kpi-icon--orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
            </div>
            <p className="kpi-card__label">SICHERE ENTNAHME</p>
            <p className="kpi-card__value">{safeWithdrawalFormatted}&thinsp;€<span className="kpi-card__unit">/Monat</span></p>
          </div>
        </div>

        <button
          className="card chart-card chart-card--clickable"
          onClick={() => onNavigateToPrognose({ title: 'Prognose', badge: 'BASIS' })}
          aria-label={t('dashboard.openPrognosis')}
        >
          <div className="chart-card__header">
            <div>
              <h2 className="chart-card__title">{t('dashboard.title')}</h2>
              <p className="chart-card__subtitle">Wachstum inkl. Zinseszins und gesetzlicher Rente</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chart-card__chevron">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="chart-wrap">
            <BarChart data={chartData} />
          </div>
        </button>

        <div className="card tip-card">
          <div className="tip-card__header">
            <span className="tip-icon">✦</span>
            <span className="badge badge--neutral">KI-EINBLICK</span>
          </div>
          <h3 className="tip-card__title">Sparrate um 50€ erhöhen?</h3>
          <p className="tip-card__body">
            Dies würde Ihren FIRE-Termin um 7 Monate nach vorne verschieben (Oktober&nbsp;{fireDateYear - 1}).
          </p>
        </div>

        <div className="card scenario-card" onClick={() => onTabChange('scenarios')}>
          <h3 className="scenario-card__title">Szenarien testen</h3>
          <p className="scenario-card__body">Simulieren Sie Marktschwankungen oder Erbschaften.</p>
          <button className="scenario-card__btn">EXPLORER ÖFFNEN</button>
        </div>
      </div>

      <button className="fab" aria-label="Neu" onClick={() => onTabChange('planner')}>+</button>
    </div>
  );
}
