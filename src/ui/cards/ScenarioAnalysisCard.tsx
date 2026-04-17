import { useTranslation } from 'react-i18next';
import type { IconVariant, ScenarioTypeBadgeVariant, ScenarioResultBadgeVariant } from '../../types/ui/variants';

interface ScenarioAnalysisCardProps {
  icon?: React.ReactNode;
  iconVariant?: IconVariant;
  typeBadge: string;
  typeBadgeVariant: ScenarioTypeBadgeVariant;
  title: string;
  subtitle: string;
  resultBadge: string;
  resultBadgeVariant: ScenarioResultBadgeVariant;
  resultText?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'slider';
  isActive?: boolean;
}

export function ScenarioAnalysisCard({
  icon,
  iconVariant,
  typeBadge,
  typeBadgeVariant,
  title,
  subtitle,
  resultBadge,
  resultBadgeVariant,
  resultText,
  selected = false,
  onClick,
  variant = 'default',
  isActive = false,
}: Readonly<ScenarioAnalysisCardProps>) {
  const { t } = useTranslation();
  // Slider variant — compact horizontal card
  if (variant === 'slider') {
    return (
      <button
        className={`scenario-slider-card${selected ? ' scenario-slider-card--active' : ''}`}
        onClick={onClick}
      >
        <div className="scenario-slider-card__header">
          <div className="scenario-slider-card__status">
            <span className="scenario-slider-card__dot" />
            <span className="scenario-slider-card__status-text">{isActive ? t('tax.statusActive') : t('tax.statusInactive')}</span>
          </div>
          <span className={`scenario-slider-card__type-badge scenario-slider-card__type-badge--${typeBadgeVariant}`}>
            {typeBadge}
          </span>
        </div>
        <p className="scenario-slider-card__title">{title}</p>
        <p className="scenario-slider-card__sub">{subtitle}</p>
        <div className="scenario-slider-card__footer">
          <span className="scenario-slider-card__result">{resultBadge}</span>
          <span className="scenario-slider-card__arrow">→</span>
        </div>
      </button>
    );
  }

  // Default variant — traditional vertical card
  return (
    <button
      className={`card scenario-analysis-card${selected ? ' scenario-analysis-card--selected' : ''}`}
      onClick={onClick}
    >
      <div className="scenario-analysis-card__type-row">
        <div className={`scenario-analysis-card__icon scenario-analysis-card__icon--${iconVariant}`}>
          {icon}
        </div>
        <span className={`scenario-analysis-card__type-badge scenario-analysis-card__type-badge--${typeBadgeVariant}`}>
          {typeBadge}
        </span>
      </div>
      <div className="scenario-analysis-card__title-wrap">
        <p className="scenario-analysis-card__title">{title}</p>
        <p className="scenario-analysis-card__sub">{subtitle}</p>
      </div>
      <div className="scenario-analysis-card__result">
        <span className={`scenario-analysis-card__result-badge scenario-analysis-card__result-badge--${resultBadgeVariant}`}>
          {resultBadge}
        </span>
        {resultText && <span className="scenario-analysis-card__result-text">{resultText}</span>}
      </div>
    </button>
  );
}
