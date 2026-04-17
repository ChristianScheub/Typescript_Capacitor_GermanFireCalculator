import { useTranslation } from 'react-i18next';
import { Icon }           from '../icons';
import type { IconName }  from '../../types/ui/icons/iconPaths';
import type { NavIconVariant } from '../../types/ui/variants';

export interface NavItem {
  icon:        IconName;
  iconVariant: NavIconVariant;
  label:       string;
  isExternal?: boolean;
  onClick?:    () => void;
}

export function NavList({ items }: Readonly<{ items: NavItem[] }>) {
  const { t } = useTranslation();
  return (
    <div className="nav-list">
      {items.map((item) => (
        <button key={item.label} className="nav-list__item" onClick={item.onClick}>
          <span className={`nav-list__icon-box nav-list__icon-box--${item.iconVariant}`}>
            <Icon name={item.icon} size="sm" />
          </span>
          <span className="nav-list__label">{t(item.label)}</span>
          <Icon
            name={item.isExternal ? 'external_link' : 'chevron'}
            size="sm"
            className="nav-list__chevron"
          />
        </button>
      ))}
    </div>
  );
}
