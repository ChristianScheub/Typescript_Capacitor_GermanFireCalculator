import { useTranslation } from 'react-i18next';
import { MilestoneCard } from '../ui/cards/MilestoneCard';
import { PrognoseCard } from '../ui/cards/PrognoseCard';
import { MonteCarloChart } from '../ui/charts/MonteCarloChart';
import { fmtCurrency } from '../services/fire';
import type { PrognoseTableRow } from '../types/prognose/PrognoseTableRow';
import type { FanDataPoint } from '../types/monteCarloCalculator/models/monteCarloTypes';

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
  fanData: FanDataPoint[];
  onMcFullscreenOpen: () => void;
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
  fanData,
  onMcFullscreenOpen,
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
          <div className="prognose-hero__bar-fill" style={{ "--width": `${Math.min(100, firePercentage)}%` } as React.CSSProperties} />
        </div>
      </div>

      {/* ── Milestone Cards ── */}
      <div className="milestone-list">
        <MilestoneCard
          label={t('prognosis.today')}
          year={currentYear}
          subtitle={`${t('prognosis.startpoint')} · ${fmtCurrency(netWorth)} €`}
          variant="default"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
        />
        <MilestoneCard
          label={t('prognosis.fireReached')}
          year={fireYear}
          subtitle={`${t('prognosis.withdrawalPossible')} · ${fmtCurrency(netSWR)} € / Monat`}
          variant="fire"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        />
        <MilestoneCard
          label={t('prognosis.pension')}
          year={pensionYear}
          subtitle={`${t('prognosis.additionalIncome')} · +${fmtCurrency(pensionMonthly)} € / Monat`}
          variant="default"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
        />
      </div>

      {/* ── Wealth Development Chart ── */}
      <MonteCarloChart
        fanData={fanData}
        zielwert={fmtK(fireTarget)}
        erfolgsrate={firePercentage.toFixed(1).replace('.', ',')}
        risikoLabel="Prognose"
        risikoColor="#3DAA72"
        onFullscreenOpen={onMcFullscreenOpen}
        showBands={false}
      />

      {/* ── Cards ── */}
      <div className="prognose-table-section">
        <h2 className="prognose-table-title">{t('prognosis.wealthDevelopment')}</h2>
        <p className="prognose-table-subtitle">
          {t('prognosis.projectionBased')} {realReturnPct}% {t('prognosis.realReturnPA')}
        </p>

        <div className="prognose-cards">
          {tableRows.map(row => (
            <PrognoseCard key={row.year} row={row} />
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
