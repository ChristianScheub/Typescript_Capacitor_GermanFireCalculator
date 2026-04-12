import { useTranslation } from 'react-i18next';

interface KpiBarProps {
  zielwert: string;
  erfolgsrate: string;
  risikoLabel: string;
  risikoColor: string;
}

export function KpiBar({ zielwert, erfolgsrate, risikoLabel, risikoColor }: KpiBarProps) {
  const { t } = useTranslation();
  return (
    <div className="mc-kpi-bar">
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">{t('monteCarlo.expectedTargetValue')}</p>
        <p className="mc-kpi-value">{zielwert}</p>
      </div>
      <div className="mc-kpi-divider" />
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">{t('monteCarlo.successRate')}</p>
        <p className="mc-kpi-value">{erfolgsrate}</p>
      </div>
      <div className="mc-kpi-divider" />
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">{t('monteCarlo.withdrawalRisk')}</p>
        <p className="mc-kpi-value" style={{ '--mc-risk-color': risikoColor } as React.CSSProperties}>
          {risikoLabel}
        </p>
      </div>
    </div>
  );
}
