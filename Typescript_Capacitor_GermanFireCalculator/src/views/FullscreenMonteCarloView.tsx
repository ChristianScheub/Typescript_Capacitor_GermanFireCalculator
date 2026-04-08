import { FanChart } from '../ui/charts/FanChart';
import { KpiBar } from '../ui/monteCarloChart/KpiBar';

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
  return (
    <div className="mc-fullscreen-overlay" onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mc-fullscreen-landscape">
        {/* Close */}
        <button className="mc-fullscreen-close" onClick={onClose} aria-label="Schließen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header row */}
        <div className="mc-fullscreen-header">
          <span className="mc-fullscreen-title">Monte-Carlo · Fächer-Diagramm</span>
          <div className="mc-fan-legend">
            <span className="mc-legend-item mc-legend-item--95">95% KI</span>
            <span className="mc-legend-item mc-legend-item--50">50% KI</span>
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
