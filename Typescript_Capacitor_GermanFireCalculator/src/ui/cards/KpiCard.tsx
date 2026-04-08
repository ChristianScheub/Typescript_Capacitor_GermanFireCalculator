type IconVariant = 'green' | 'teal' | 'red' | 'orange';
type BadgeVariant = 'positive' | 'warn' | 'danger';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  iconVariant: IconVariant;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  icon: React.ReactNode;
}

export function KpiCard({
  label,
  value,
  unit,
  iconVariant,
  badgeText,
  badgeVariant = 'positive',
  icon,
}: KpiCardProps) {
  return (
    <div className="card kpi-card">
      <div className="kpi-card__header">
        <div className={`kpi-icon kpi-icon--${iconVariant}`}>
          {icon}
        </div>
        {badgeText && <span className={`badge badge--${badgeVariant}`}>{badgeText}</span>}
      </div>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">
        {value}
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </p>
    </div>
  );
}
