import { useTranslation } from 'react-i18next';
import type { ScenarioListItemProps } from '../../types/ui/scenarioProps';

export function ScenarioListItem({
  title,
  subtitle,
  resultBadge,
  resultBadgeVariant,
  typeBadge,
  isActive,
  actionLabel,
  selected,
  onClick,
}: ScenarioListItemProps) {
  const { t } = useTranslation();
  return (
    <div className={`scenario-list-item${selected ? ' scenario-list-item--selected' : ''}`}>
      <div className="scenario-list-item__top">
        <div className="scenario-list-item__status">
          <span className={`scenario-list-item__dot scenario-list-item__dot--${isActive ? 'active' : 'inactive'}`} />
          <span className="scenario-list-item__status-text">{isActive ? t('tax.statusActive') : t('tax.statusInactive')}</span>
        </div>
        <span className="scenario-list-item__type-badge">{typeBadge}</span>
      </div>
      <p className="scenario-list-item__title">{title}</p>
      <p className="scenario-list-item__sub">{subtitle}</p>
      <div className="scenario-list-item__bottom">
        <span className={`scenario-list-item__result-badge scenario-list-item__result-badge--${resultBadgeVariant}`}>
          {resultBadge}
        </span>
        <button
          className={`scenario-list-item__action${selected ? ' scenario-list-item__action--active' : ''}`}
          onClick={onClick}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
