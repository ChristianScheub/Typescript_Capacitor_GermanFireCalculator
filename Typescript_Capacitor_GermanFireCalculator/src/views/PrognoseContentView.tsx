import { useTranslation } from 'react-i18next';
import { fmtCurrency } from '../services/fire';
import type { PrognoseTableRow } from '../types/prognose/PrognoseTableRow';

interface PrognoseContentViewProps {
  fireTarget: number;
  fireYear: number;
  firePercentage: number;
  yearsToFIRE: number;
  isOnTrack: boolean;
  currentYear: number;
  netWorth: number;
  netSWR: number;
  pensionYear: number;
  pensionMonthly: number;
  tableRows: PrognoseTableRow[];
  weightedReturn: number;
  realReturnPct: number;
  fmtK: (v: number) => string;
}

export function PrognoseContentView({
  fireTarget,
  fireYear,
  firePercentage,
  yearsToFIRE,
  isOnTrack,
  currentYear,
  netWorth,
  netSWR,
  pensionYear,
  pensionMonthly,
  tableRows,
  weightedReturn,
  realReturnPct,
  fmtK,
}: PrognoseContentViewProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* ── Hero Card ── */}
      <div className="prognose-hero">
        <p className="prognose-hero__overline">{t('prognosis.wealth')}</p>
        <h1 className="prognose-hero__title">
          {t('prognosis.targetWealth')}
          <br />
          {fmtK(fireTarget)} {t('prognosis.until')} {fireYear}
        </h1>
        <div className="prognose-hero__stats">
          <div className="prognose-hero__stat">
            <p className="prognose-hero__stat-label">{t('prognosis.progress')}</p>
            <p className="prognose-hero__stat-value">{firePercentage.toFixed(1).replace('.', ',')}%</p>
          </div>
          <div className="prognose-hero__divider" />
          <div className="prognose-hero__stat">
            <p className="prognose-hero__stat-label">{t('prognosis.timeLeft')}</p>
            <p className="prognose-hero__stat-value">{yearsToFIRE} {t('prognosis.years')}</p>
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">{t('prognosis.today')}</p>
            <p className="milestone-year">{currentYear}</p>
            <p className="milestone-sub">{t('prognosis.startpoint')} · {fmtCurrency(netWorth)} €</p>
          </div>
        </div>

        <div className="milestone-card milestone-card--fire">
          <div className="milestone-icon milestone-icon--fire">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">{t('prognosis.fireReached')}</p>
            <p className="milestone-year">{fireYear}</p>
            <p className="milestone-sub">{t('prognosis.withdrawalPossible')} · {fmtCurrency(netSWR)} € / Monat</p>
          </div>
        </div>

        <div className="milestone-card">
          <div className="milestone-icon milestone-icon--default">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="milestone-info">
            <p className="milestone-label">{t('prognosis.pension')}</p>
            <p className="milestone-year">{pensionYear}</p>
            <p className="milestone-sub">{t('prognosis.additionalIncome')} · +{fmtCurrency(pensionMonthly)} € / Monat</p>
          </div>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="prognose-table-section">
        <h2 className="prognose-table-title">{t('prognosis.wealthDevelopment')}</h2>
        <p className="prognose-table-subtitle">
          {t('prognosis.projectionBased')} {realReturnPct}% {t('prognosis.realReturnPA')}
        </p>

        <div className="prognose-cards">
          {tableRows.map(row => (
            <div key={row.year} className={`prognose-card${row.isFeatured ? ' prognose-card--featured' : ''}`}>
              <div className="prognose-card__header">
                <span className="prognose-card__year">
                  {row.year}
                  {row.isToday && <span className="prognose-card__tag prognose-card__tag--heute">{t('prognosis.today')}</span>}
                </span>
                <span className="prognose-card__badge">{row.badge}</span>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">{t('prognosis.withdrawal')}</p>
                <p className="prognose-card__value">{row.entnahmeTotalFormatted}</p>
                <p className="prognose-card__sub">
                  {t('prognosis.etf')} {row.entnahmeEtfFormatted} · {t('prognosis.cash')} {row.entnahmeCashFormatted}
                </p>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">{t('prognosis.assets')}</p>
                <p className="prognose-card__value">{row.totalValueFormatted}</p>
                <p className="prognose-card__sub">
                  {t('prognosis.etf')} {row.etfValueFormatted} · {t('prognosis.cash')} {row.cashValueFormatted}
                </p>
              </div>

              <div className="prognose-card__section">
                <p className="prognose-card__label">{t('prognosis.return')}</p>
                <p className="prognose-card__value">{row.renditeTotalFormatted}</p>
                <p className="prognose-card__sub">
                  {t('prognosis.etf')} {row.etfRateDisplay} · {t('prognosis.cash')} {row.cashRateDisplay}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="prognose-table__footnote">
          {t('prognosis.returnFormula')} {(weightedReturn * 100).toFixed(1).replace('.', ',')}% p.a. {t('prognosis.weightedReturn')}
        </p>
      </div>

      {/* ── Disclaimer ── */}
      <div className="prognose-disclaimer">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="prognose-disclaimer__text">
          {t('prognosis.disclaimerText')} <strong>{t('prognosis.scenarios')}</strong>.
        </p>
      </div>
    </>
  );
}
