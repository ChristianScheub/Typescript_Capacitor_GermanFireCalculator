const SETTINGS_ITEMS = [
  { icon: '👤', label: 'Profil-Informationen' },
  { icon: '🔔', label: 'Benachrichtigungen' },
  { icon: '🔒', label: 'Sicherheit & Datenschutz' },
  { icon: '💳', label: 'Abonnement verwalten' },
];

const HELP_ITEMS = [
  { icon: '📖', label: 'FIRE Methodik' },
  { icon: '❓', label: 'Häufig gestellte Fragen' },
  { icon: '🎧', label: 'Support kontaktieren' },
];

function NavList({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <div className="nav-list">
      {items.map((item, i) => (
        <button key={i} className="nav-list__item">
          <span className="nav-list__icon">{item.icon}</span>
          <span className="nav-list__label">{item.label}</span>
          <svg className="nav-list__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export function Menu() {
  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>FIRE LEDGER</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content">
        <section className="page-title-section">
          <h1 className="page-heading page-heading--menu">Menü</h1>
          <p className="page-desc">Verwalten Sie Ihre FIRE-Strategie und Kontoeinstellungen.</p>
        </section>

        <div className="card profile-card">
          <div className="profile-card__avatar">MM</div>
          <div className="profile-card__info">
            <p className="profile-card__name">Maximilian Muster</p>
            <p className="profile-card__meta">Standard Plan&nbsp;•&nbsp;Aktiv seit 2023</p>
          </div>
          <button className="icon-btn" aria-label="Bearbeiten">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        <p className="section-label">EINSTELLUNGEN</p>
        <NavList items={SETTINGS_ITEMS} />

        <p className="section-label" style={{ marginTop: '24px' }}>WISSEN &amp; HILFE</p>
        <NavList items={HELP_ITEMS} />

        <footer className="menu-footer">
          <div className="menu-footer__links">
            <a href="#">Impressum</a>
            <a href="#">Datenschutzerklärung</a>
            <a href="#">Nutzungsbedingungen</a>
            <a href="#">Haftungsausschluss</a>
          </div>
          <p className="menu-footer__copy">© 2024 FIRE LEDGER FINANCIAL SYSTEMS GMBH</p>
          <p className="menu-footer__tagline">Präzision in jeder Kalkulation.</p>
        </footer>
      </div>
    </div>
  );
}
