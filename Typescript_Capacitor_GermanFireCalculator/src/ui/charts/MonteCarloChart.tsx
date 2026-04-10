import { useTranslation } from 'react-i18next';
import { FanChart } from './FanChart';
import { KpiBar } from '../monteCarloChart/KpiBar';
import { Icon } from '../icons';
import type { FanDataPoint } from '../../types/monteCarloCalculator/models/monteCarloTypes';

interface MonteCarloChartProps {
  fanData: FanDataPoint[];
  zielwert: string;
  erfolgsrate: string;
  risikoLabel: string;
  risikoColor: string;
  onFullscreenOpen: () => void;
  showLegend?: boolean;
  showKpis?: boolean;
  landscape?: boolean;
  showBands?: boolean;
  simplifiedTooltip?: boolean;
}

export function MonteCarloChart({
  fanData,
  zielwert,
  erfolgsrate,
  risikoLabel,
  risikoColor,
  onFullscreenOpen,
  showLegend = true,
  showKpis = true,
  landscape = false,
  showBands = true,
  simplifiedTooltip = false,
}: MonteCarloChartProps) {
  const { t } = useTranslation();

  return (
    <>
      {!landscape && (
        <>
          <div className="mc-fan-header-row">
            <span className="mc-fan-title">
              {t('monteCarlo.wealthChart')}
            </span>
            <div className="mc-fan-header-actions">
              {showLegend && (
                <div className="mc-fan-legend">
                  <span className="mc-legend-item mc-legend-item--95">
                    {t('monteCarlo.ci95')}
                  </span>
                  <span className="mc-legend-item mc-legend-item--50">
                    {t('monteCarlo.ci50')}
                  </span>
                </div>
              )}
              {/* Fullscreen button */}
              <button
                className="mc-fullscreen-btn"
                onClick={onFullscreenOpen}
                aria-label={t('monteCarlo.fullscreenLabel')}
              >
                <Icon name="fullscreen" size="sm" />
              </button>
            </div>
          </div>

          <p className="mc-chart-hint">{t('monteCarlo.chartHint')}</p>
        </>
      )}

      {landscape && (
        <div className="mc-fan-legend">
          <span className="mc-legend-item mc-legend-item--95">95% KI</span>
          <span className="mc-legend-item mc-legend-item--50">50% KI</span>
        </div>
      )}

      <FanChart fanData={fanData} landscape={landscape} showBands={showBands} simplifiedTooltip={simplifiedTooltip} />
      {showKpis && (
        <KpiBar
          zielwert={zielwert}
          erfolgsrate={erfolgsrate}
          risikoLabel={risikoLabel}
          risikoColor={risikoColor}
        />
      )}
    </>
  );
}
