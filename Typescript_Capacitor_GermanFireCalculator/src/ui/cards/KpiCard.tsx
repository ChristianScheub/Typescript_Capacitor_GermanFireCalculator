import type { IconVariant, BadgeVariant } from '../../types/ui/variants';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  iconVariant: IconVariant;
  badgeVariant?: BadgeVariant;
  icon: React.ReactNode;
}

export function KpiCard({
  label,
  value,
  unit,
  iconVariant,
  icon,
}: KpiCardProps) {
  return (
    <div className="card kpi-card">
      <div className="kpi-card__header">
        <div className={`kpi-icon kpi-icon--${iconVariant}`}>
          {icon}
        </div>
      </div>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">
        {value}
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </p>
    </div>
  );
}
