import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/icons';
import './WelcomeView.css';

interface WelcomeViewProps {
  checked: [boolean, boolean, boolean];
  onToggle: (index: 0 | 1 | 2) => void;
  onAccept: () => void;
}

interface SectionItem {
  icon: 'trending' | 'layers' | 'warning' | 'shield' | 'book';
  titleKey: string;
  badgeKey?: string;
  textKey: string;
  textKey2?: string;
}

interface ConsentItem {
  icon: 'book' | 'sigma' | 'layers';
  titleKey: string;
  descKey: string;
}

const SECTIONS: SectionItem[] = [
  { icon: 'trending', titleKey: 'welcome.section1Title', badgeKey: 'welcome.section1Badge', textKey: 'welcome.section1Text', textKey2: 'welcome.section1Text2' },
  { icon: 'layers',   titleKey: 'welcome.section2Title', badgeKey: 'welcome.section2Badge', textKey: 'welcome.section2Text', textKey2: 'welcome.section2Text2' },
  { icon: 'warning',  titleKey: 'welcome.section3Title', textKey: 'welcome.section3Text', textKey2: 'welcome.section3Text2' },
  { icon: 'shield',   titleKey: 'welcome.section4Title', textKey: 'welcome.section4Text', textKey2: 'welcome.section4Text2' },
  { icon: 'book',     titleKey: 'welcome.section5Title', textKey: 'welcome.section5Text', textKey2: 'welcome.section5Text2' },
];

const CONSENTS: ConsentItem[] = [
  { icon: 'book',   titleKey: 'welcome.consent1Title', descKey: 'welcome.consent1Desc' },
  { icon: 'sigma',  titleKey: 'welcome.consent2Title', descKey: 'welcome.consent2Desc' },
  { icon: 'layers', titleKey: 'welcome.consent3Title', descKey: 'welcome.consent3Desc' },
];

export function WelcomeView({ checked, onToggle, onAccept }: WelcomeViewProps) {
  const { t } = useTranslation();
  const allChecked = checked[0] && checked[1] && checked[2];

  return (
    <div className="welcome-overlay">
      <div className="welcome-scroll">
        <div className="welcome-content">

          <section className="welcome-hero">
            <p className="welcome-hero__overline">FIRE LEDGER</p>
            <h1 className="welcome-hero__title">{t('welcome.title')}</h1>
            <p className="welcome-hero__subtitle">{t('welcome.subtitle')}</p>
          </section>

          <div className="welcome-sections">
            {SECTIONS.map((s, i) => (
              <div key={i} className="welcome-card">
                <div className="welcome-card__icon-wrap">
                  <Icon name={s.icon} size="md" />
                </div>
                <div className="welcome-card__body">
                  <div className="welcome-card__header">
                    <span className="welcome-card__title">{t(s.titleKey)}</span>
                    {s.badgeKey && (
                      <span className="welcome-card__badge">{t(s.badgeKey)}</span>
                    )}
                  </div>
                  <p className="welcome-card__text">{t(s.textKey)}</p>
                  {s.textKey2 && (
                    <>
                      <p className="welcome-card__text welcome-card__text--spacer" />
                      <p className="welcome-card__text">{t(s.textKey2)}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="welcome-consents">
            {CONSENTS.map((c, i) => (
              <button
                key={i}
                className={`welcome-consent${checked[i as 0 | 1 | 2] ? ' welcome-consent--checked' : ''}`}
                onClick={() => onToggle(i as 0 | 1 | 2)}
              >
                <div className="welcome-consent__icon-wrap">
                  <Icon name={c.icon} size="md" />
                </div>
                <div className="welcome-consent__body">
                  <p className="welcome-consent__title">{t(c.titleKey)}</p>
                  <p className="welcome-consent__desc">{t(c.descKey)}</p>
                </div>
                <div className={`welcome-consent__check${checked[i as 0 | 1 | 2] ? ' welcome-consent__check--on' : ''}`}>
                  {checked[i as 0 | 1 | 2] && (
                    <svg className="welcome-consent__checkmark" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="welcome-cta-spacer" />
        </div>
      </div>

      <div className="welcome-cta">
        {!allChecked && (
          <p className="welcome-cta__hint">{t('welcome.scrollHint')}</p>
        )}
        <button
          className={`welcome-cta__btn${allChecked ? ' welcome-cta__btn--active' : ''}`}
          onClick={onAccept}
          disabled={!allChecked}
        >
          {t('welcome.ctaButton')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
