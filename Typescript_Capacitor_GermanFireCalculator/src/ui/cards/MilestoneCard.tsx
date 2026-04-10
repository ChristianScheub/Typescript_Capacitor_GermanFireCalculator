import type { MilestoneVariant } from '../../types/ui/variants';

interface MilestoneCardProps {
  icon: React.ReactNode;
  label: string;
  year: number;
  subtitle: string;
  variant?: MilestoneVariant;
}

export function MilestoneCard({
  icon,
  label,
  year,
  subtitle,
  variant = 'default',
}: MilestoneCardProps) {
  return (
    <div className={`milestone-card${variant === 'fire' ? ' milestone-card--fire' : ''}`}>
      <div className={`milestone-icon milestone-icon--${variant}`}>
        {icon}
      </div>
      <div className="milestone-info">
        <p className="milestone-label">{label}</p>
        <p className="milestone-year">{year}</p>
        <p className="milestone-sub">{subtitle}</p>
      </div>
    </div>
  );
}
