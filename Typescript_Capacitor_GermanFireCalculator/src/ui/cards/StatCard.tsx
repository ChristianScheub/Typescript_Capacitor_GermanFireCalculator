import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import type { StatCardVariant } from '../../types/ui/variants';

interface StatCardProps {
  label: string;
  variant?: StatCardVariant;
  danger?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function StatCard({ label, variant, danger = false, icon, children }: StatCardProps) {
  const { t } = useTranslation();

  const classNames = [
    'mc-card',
    danger && 'mc-card--danger-border',
    variant === 'pessimistic' && 'mc-card--pessimistic',
    variant === 'positive' && 'mc-card--positive',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <p className="mc-label">{t(label)}</p>
      {children}
    </div>
  );
}
