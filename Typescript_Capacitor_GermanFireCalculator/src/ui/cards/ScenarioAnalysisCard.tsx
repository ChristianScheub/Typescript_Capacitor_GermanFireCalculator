type IconVariant = 'teal' | 'red' | 'orange';
type BadgeVariant = 'lifestyle' | 'risk' | 'simulation';
type ResultBadgeVariant = 'warn' | 'danger' | 'positive';

interface ScenarioAnalysisCardProps {
  icon: React.ReactNode;
  iconVariant: IconVariant;
  typeBadge: string;
  typeBadgeVariant: BadgeVariant;
  title: string;
  subtitle: string;
  resultBadge: string;
  resultBadgeVariant: ResultBadgeVariant;
  resultText?: string;
  selected?: boolean;
  onClick?: () => void;
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
}: ScenarioAnalysisCardProps) {
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
