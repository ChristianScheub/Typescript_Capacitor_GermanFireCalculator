import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/icons';
import { type IconName } from '../types/ui/icons/iconPaths';
import type { NavIconVariant } from '../types/ui/variants';
import './MenuView.css';

interface NavItem {
  icon: IconName;
  iconVariant: NavIconVariant;
  label: string;
  isExternal?: boolean;
}

const DATA_ITEMS: NavItem[] = [
  { icon: 'trash',  iconVariant: 'red',   label: 'info.deleteAllData' },
  { icon: 'upload', iconVariant: 'gray',  label: 'info.exportAllData' },
];

const KNOWLEDGE_ITEMS: NavItem[] = [
  { icon: 'book',   iconVariant: 'green', label: 'info.fireInformation' },
  { icon: 'sigma',  iconVariant: 'green', label: 'info.calculationInfo' },
  { icon: 'layers', iconVariant: 'green', label: 'info.usedLibraries' },
];

const LEGAL_ITEMS: NavItem[] = [
  { icon: 'shield',    iconVariant: 'green',   label: 'info.privacyPolicy' },
  { icon: 'link_icon', iconVariant: 'green',   label: 'info.imprint' },
  { icon: 'code',      iconVariant: 'primary', label: 'info.githubRepo', isExternal: true },
];

function NavList({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <div className="nav-list">
      {items.map((item, i) => (
        <button key={i} className="nav-list__item">
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

export function Menu() {
  const { t } = useTranslation();
  return (
    <div className="screen">
      <div className="screen__content">
        <section className="page-title-section">
          <h1 className="page-heading page-heading--menu">{t('info.pageTitle')}</h1>
          <p className="info-version">{t('info.versionBadge')}</p>
        </section>

        <div className="info-warning">
          <div className="info-warning__header">
            <Icon name="warning" size="sm" />
            {t('info.warningTitle')}
          </div>
          <p className="info-warning__text">
            {t('info.warningText')}{' '}
            <strong className="info-warning__bold">{t('info.warningTextBold')}</strong>{' '}
            {t('info.warningText2')}
          </p>
        </div>

        <p className="section-label">{t('info.sectionData')}</p>
        <NavList items={DATA_ITEMS} />

        <p className="section-label section-label--mt">{t('info.sectionKnowledge')}</p>
        <NavList items={KNOWLEDGE_ITEMS} />

        <p className="section-label section-label--mt">{t('info.sectionLegal')}</p>
        <NavList items={LEGAL_ITEMS} />

        <footer className="info-footer">
          <p className="info-footer__tagline">{t('info.footerTagline')}</p>
          <p className="info-footer__copy">{t('info.footerCopy')}</p>
        </footer>
      </div>
    </div>
  );
}
