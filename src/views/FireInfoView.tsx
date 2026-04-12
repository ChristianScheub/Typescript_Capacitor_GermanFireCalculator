import React from 'react';
import { useTranslation } from 'react-i18next';
import './FireInfoView.css';

const FireInfoContent: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="fi">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <p className="fi-overline">IDENTITÄT & FRAMEWORK</p>
      <h1 className="fi-title">Was ist FIRE?</h1>
      <p className="fi-subtitle">
        Ein strukturierter Leitfaden zur finanziellen Unabhängigkeit.
        Verstanden nicht als Ziel, sondern als mathematische Disziplin.
      </p>

      {/* ── Souveränität ────────────────────────────────────────────── */}
      <div className="fi-card">
        <div className="fi-card__row">
          <div className="fi-icon fi-icon--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="fi-card__title">Souveränität</span>
        </div>
        <p className="fi-card__text">
          FIRE (Financial Independence, Retire Early) ist ein Instrument zur
          persönlichen Autonomie. Es handelt sich um die Schaffung von
          Wahlmöglichkeiten, nicht um eine tatsächliche Garantie einer
          dauerhaften Einkommensfreiheit.
        </p>
        <div className="fi-quote">
          <p className="fi-quote__text">
            „Finanzielle Freiheit ist keine Fähigkeit, für immer auf Einkommen
            zu verzichten. Sie ist die Fähigkeit, selbst zu wählen, wann und
            wie man arbeitet."
          </p>
          <span className="fi-quote__label">WARNUNG: NICHT VOR ANNAHMEN SCHÜTZEN</span>
        </div>
      </div>

      {/* ── Bauplan / 25er-Regel ─────────────────────────────────────── */}
      <div>
        <p className="fi-section-overline">BAUPLAN</p>
        <p className="fi-section-title">Die Stelle des Kapitals</p>
      </div>

      <div className="fi-rule25">
        {/* Dark header cap */}
        <div className="fi-rule25__cap">
          <div className="fi-rule25__cap-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="fi-rule25__cap-label">Die 25er-Regel</span>
          <span className="fi-rule25__cap-badge">Bones-Theorie Modell</span>
        </div>
        {/* White body */}
        <div className="fi-rule25__body">
          <p className="fi-rule25__text">
            Das theoretische Fundament besagt, dass das 25-fache der jährlichen
            Ausgaben zur Unabhängigkeit ausreicht.
          </p>

          {/* Key-value table */}
          <div className="fi-table">
            <div className="fi-table__row">
              <span className="fi-table__key">STATUS</span>
              <span className="fi-table__val fi-table__val--red">Reines Theorie-Modell</span>
            </div>
            <div className="fi-table__divider" />
            <div className="fi-table__row">
              <span className="fi-table__key">KORREKTURBEDARF</span>
              <span className="fi-table__val fi-table__val--bold">Hoch (Steuern/Inflation)</span>
            </div>
          </div>

          {/* Inline disclaimer */}
          <div className="fi-rule25__disclaimer">
            <p className="fi-rule25__disclaimer-text">
              <strong>{t('fireInfo.disclaimerLabel')}</strong> Historische Simulationen (Trinity Study)
              berücksichtigen weder deutsche Kapitalertragsteuern noch das aktuelle
              inflationäre Umfeld. Eine Erhöhung auf Faktor 30–35 ist zur
              Risikominimierung bei langen Zeithorizonten notwendig.
            </p>
          </div>
        </div>
      </div>

      {/* ── Dynamik ──────────────────────────────────────────────────── */}
      <div className="fi-card">
        <div className="fi-card__row">
          <div className="fi-icon fi-icon--accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="fi-card__title">Dynamik</span>
        </div>
        <p className="fi-card__text">
          FIRE ist keine statische Zielmarke, sondern eine{' '}
          <strong>{t('fireInfo.mathematicalSnapshot')}</strong>. Marktrenditen,
          Lebenshaltungskosten und gesetzliche Rahmenbedingungen
          verändern sich kontinuierlich.
        </p>
        <div className="fi-revision-badge">
          EIGENVERANTWORTLICHE, JÄHRLICHE REVISION DURCH DEN ANWENDER ZWINGEND ERFORDERLICH
        </div>
      </div>

      {/* ── Rechtliche Einordnung ────────────────────────────────────── */}
      <div className="fi-legal">
        <p className="fi-legal__label">RECHTLICHE EINORDNUNG</p>
        <p className="fi-legal__text">
          Dieses Tool führt ausschließlich mathematische Modellrechnungen auf
          Basis Ihrer Eingaben durch. Es handelt sich um kein Finanzprodukt,
          keine Anlageberatung und keine Steuerberatung.
        </p>
        <p className="fi-legal__text fi-legal__text--bold">
          Kapitalmarktanlagen unterliegen Risiken bis hin zum Totalverlust.
        </p>
        <p className="fi-legal__text">
          Historische Renditen sind kein verlässlicher Indikator für
          zukünftige Wertentwicklungen. Jede FIRE-Kalkulation basiert auf
          Annahmen, die sich jederzeit als falsch erweisen können.
        </p>
        <p className="fi-legal__text fi-legal__text--italic">
          Die gezeigten Szenarien sind mathematische Momentaufnahmen und
          stellen keine individuelle Anlagestrategie oder Empfehlung dar.
        </p>
      </div>

    </div>
  );
};

export default FireInfoContent;