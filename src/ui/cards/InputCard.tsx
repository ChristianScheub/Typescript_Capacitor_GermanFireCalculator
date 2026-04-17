import type { ReactNode } from 'react';
import type { IconVariant, ContentSectionVariant } from '../../types/ui/variants';

interface ContentSectionProps {
  icon?: ReactNode;
  iconVariant?: IconVariant;
  title: string;
  subtitle?: string;
  children: ReactNode;
  variant?: ContentSectionVariant;
}

export function ContentSection({
  icon,
  iconVariant,
  title,
  subtitle,
  children,
  variant = 'input'
}: Readonly<ContentSectionProps>) {
  // For 'input' variant (MonteCarloView style)
  if (variant === 'input') {
    return (
      <div className="mc-card">
        <div className="mc-input-header">
          {icon}
          <span className="mc-input-title">{title}</span>
        </div>
        {children}
      </div>
    );
  }

  // For 'section' variant (PlannerView style)
  return (
    <div className="section-card">
      <div className="section-card__header">
        <div>
          <h2 className="section-card__title">{title}</h2>
          {subtitle && <p className="section-card__subtitle">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`section-icon section-icon--${iconVariant || 'teal'}`}>
            {icon}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
