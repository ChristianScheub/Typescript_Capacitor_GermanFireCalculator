import React from 'react';
import { useTranslation } from 'react-i18next';
import './CalculationInfoView.css';

const CalculationInfoContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="ci">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <p className="ci-overline">{t('calculationInfo.overline')}</p>
      <h1 className="ci-title">{t('calculationInfo.title')}</h1>
      <p className="ci-subtitle">{t('calculationInfo.subtitle')}</p>

      {/* ── 1. Das Fundament (Zielvermögen) ─────────────────────────── */}
      <div className="ci-card">
        <div className="ci-card__header">
          <span className="ci-step-pill">1.</span>
          <div className="ci-icon ci-icon--green">
            {/* crosshair / target */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="ci-card__title">{t('calculationInfo.section1Title')}</span>
        </div>

        <p className="ci-card__text">{t('calculationInfo.section1Text')}</p>

        <div className="ci-alert-row ci-alert-row--red">
          <span className="ci-alert-row__text">{t('calculationInfo.section1Warning1')}</span>
        </div>
        <div className="ci-alert-row ci-alert-row--red">
          <span className="ci-alert-row__text">{t('calculationInfo.section1Warning2')}</span>
        </div>
      </div>

      {/* ── 2. Die Ansparphase (Deterministisch) ────────────────────── */}
      <div className="ci-card">
        <div className="ci-card__header">
          <span className="ci-step-pill">2.</span>
          <div className="ci-icon ci-icon--blue">
            {/* trending up */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="ci-card__title">{t('calculationInfo.section2Title')}</span>
        </div>

        <p className="ci-card__text">{t('calculationInfo.section2Text')}</p>

        <div className="ci-badge ci-badge--blue">{t('calculationInfo.section2Badge')}</div>

        <div className="ci-alert-row ci-alert-row--amber">
          <span className="ci-alert-row__label">WARNUNG</span>
          <span className="ci-alert-row__text">{t('calculationInfo.section2Warning')}</span>
        </div>
      </div>

      {/* ── 3. Die Entnahmephase (der Kapitalverzehr) ───────────────── */}
      <div className="ci-card">
        <div className="ci-card__header">
          <span className="ci-step-pill">3.</span>
          <div className="ci-icon ci-icon--coral">
            {/* bar chart */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <line x1="2" y1="20" x2="22" y2="20" />
            </svg>
          </div>
          <span className="ci-card__title">{t('calculationInfo.section3Title')}</span>
        </div>

        <p className="ci-card__text">{t('calculationInfo.section3Text')}</p>

        <div className="ci-checklist">
          <div className="ci-check-item">
            <div className="ci-check-item__dot" />
            <span className="ci-check-item__text">{t('calculationInfo.section3Bullet1')}</span>
          </div>
          <div className="ci-check-item">
            <div className="ci-check-item__dot" />
            <span className="ci-check-item__text">{t('calculationInfo.section3Bullet2')}</span>
          </div>
        </div>

        <div className="ci-info-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{t('calculationInfo.section3TaxNote')}</span>
        </div>
      </div>

      {/* ── 4. Monte-Carlo (Der Stresstest) ─────────────────────────── */}
      <div className="ci-card">
        <div className="ci-card__header">
          <span className="ci-step-pill">4.</span>
          <div className="ci-icon ci-icon--green">
            {/* sigma */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 4H6l6 8-6 8h12" />
            </svg>
          </div>
          <span className="ci-card__title">{t('calculationInfo.section4Title')}</span>
        </div>

        <p className="ci-card__text">{t('calculationInfo.section4Text')}</p>

        <div className="ci-badge ci-badge--green">{t('calculationInfo.section4Badge')}</div>
      </div>

      {/* ── Rechtliche Einordnung ────────────────────────────────────── */}
      <div className="ci-legal">
        <p className="ci-legal__label">{t('calculationInfo.legalLabel')}</p>
        <p className="ci-legal__text">{t('calculationInfo.legalText1')}</p>
        <p className="ci-legal__text ci-legal__text--bold">{t('calculationInfo.legalText2')}</p>
        <p className="ci-legal__text">{t('calculationInfo.legalText3')}</p>
        <p className="ci-legal__text ci-legal__text--italic">{t('calculationInfo.legalText4')}</p>
      </div>

    </div>
  );
};

export default CalculationInfoContent;
