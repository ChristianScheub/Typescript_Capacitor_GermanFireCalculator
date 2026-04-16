import { useTranslation } from 'react-i18next';
import { FanChart } from '../ui/charts/FanChart';
import { KpiBar } from '../ui/monteCarloChart/KpiBar';
import { Icon } from '../ui/icons';

interface FanDataPoint {
  year: number;
  age: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

interface FullscreenMonteCarloViewProps {
  fanData: FanDataPoint[];
  zielwert: string;
  erfolgsrate: string;
  risikoLabel: string;
  risikoColor: string;
  onClose: () => void;
}

export function FullscreenMonteCarloView({
  fanData,
  zielwert,
  erfolgsrate,
  risikoLabel,
  risikoColor,
  onClose,
}: FullscreenMonteCarloViewProps) {
  const { t } = useTranslation();

  return (
    <div className="mc-fullscreen-overlay" onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mc-fullscreen-landscape">
        {/* Close */}
        <button className="mc-fullscreen-close" onClick={onClose} aria-label={t('monteCarlo.closeLabel')}>
          <Icon name="close" size="md" />
        </button>

        {/* Header row */}
        <div className="mc-fullscreen-header">
          <span className="mc-fullscreen-title">{t('monteCarlo.fullscreenTitle')}</span>
          <div className="mc-fan-legend">
            <span className="mc-legend-item mc-legend-item--95">{t('monteCarlo.ci95')}</span>
            <span className="mc-legend-item mc-legend-item--50">{t('monteCarlo.ci50')}</span>
          </div>
        </div>

        {/* Large interactive chart */}
        <div className="mc-fullscreen-chart">
          <FanChart fanData={fanData} landscape />
        </div>

        {/* KPI bar */}
        <KpiBar zielwert={zielwert} erfolgsrate={erfolgsrate} risikoLabel={risikoLabel} risikoColor={risikoColor} />
      </div>
    </div>
  );
}
