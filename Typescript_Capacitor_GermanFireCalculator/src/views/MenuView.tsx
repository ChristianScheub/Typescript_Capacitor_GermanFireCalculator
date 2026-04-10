import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/icons';
const SETTINGS_ITEMS = [
  { icon: '👤', label: 'menu.profileInfo' },
  { icon: '🔔', label: 'Benachrichtigungen' },
  { icon: '🔒', label: 'menu.privacy' },
];

const HELP_ITEMS = [
  { icon: '📖', label: 'menu.fireMethod' },
  { icon: '❓', label: 'menu.faq' },
  { icon: '🎧', label: 'menu.support' },
];

function NavList({ items }: { items: { icon: string; label: string }[] }) {
  const { t } = useTranslation();
  return (
    <div className="nav-list">
      {items.map((item, i) => (
        <button key={i} className="nav-list__item">
          <span className="nav-list__icon">{item.icon}</span>
          <span className="nav-list__label">{t(item.label)}</span>
          <Icon name="chevron" size="sm" className="nav-list__chevron" />
        </button>
      ))}
    </div>
  );
}

export function Menu() {
  const { t } = useTranslation();
  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <Icon name="chart" size="md" />
          <span>{t('menu.title')}</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <Icon name="info" size="md" />
        </button>
      </header>

      <div className="screen__content">
        <section className="page-title-section">
          <h1 className="page-heading page-heading--menu">Menü</h1>
          <p className="page-desc">Verwalten Sie Ihre FIRE-Strategie und Kontoeinstellungen.</p>
        </section>

        <p className="section-label">EINSTELLUNGEN</p>
        <NavList items={SETTINGS_ITEMS} />

        <p className="section-label mt-5">WISSEN &amp; HILFE</p>
        <NavList items={HELP_ITEMS} />

        <footer className="menu-footer">
          <div className="menu-footer__links">
            <a href="#">Impressum</a>
            <a href="#">{t('menu.privacyPolicy')}</a>
            <a href="#">Nutzungsbedingungen</a>
            <a href="#">Haftungsausschluss</a>
          </div>
          <p className="menu-footer__copy">© 2024 FIRE LEDGER PLATZHALTER FIRMA</p>
        </footer>
      </div>
    </div>
  );
}
