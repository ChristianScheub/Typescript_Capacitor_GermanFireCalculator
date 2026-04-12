import React from 'react';
import './withdrawalRules.css';


const WithdrawalRules: React.FC = () => {
  return (
    <div className="wr">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <p className="wr-overline">GRUNDLAGEN DER FIRE-MATHEMATIK</p>
      <h1 className="wr-title">Die Architektur der Entnahme.</h1>
      <p className="wr-subtitle">
        Präzision in der Theorie trifft auf die Unberechenbarkeit der Realität.
        Verstehen Sie die statischen Modelle als Skizzen, nicht als Garantien.
      </p>

      <div className="wr-compass" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="36" y1="8" x2="36" y2="64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="36" x2="64" y2="36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="36" cy="36" r="3.5" fill="currentColor" />
          <line x1="36" y1="8" x2="44" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="8" x2="28" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="8" r="2.5" fill="currentColor" />
        </svg>
      </div>

      {/* ── Sequence of Returns Risk ──────────────────────────────────── */}
      <div className="wr-card">
        <div className="wr-card__label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          SEQUENCE OF RETURNS RISK
        </div>
        <p className="wr-card__quote">
          „Das Modell ist blind für den Zeitpunkt von Markkrisen."
        </p>
        <p className="wr-card__text">
          Eine Krise zu Beginn Ihrer Entnahmephase wiegt schwerer als am Ende.
          Statische Simulationen glätten die Volatilität, doch die Realität kennt
          keine Mittelwerte in den ersten Jahren.
        </p>
        <div className="wr-timeline">
          <div className="wr-timeline__track">
            <div className="wr-timeline__fill" />
          </div>
          <p className="wr-timeline__label">KRITISCHE PHASE (Y1-Y5)</p>
        </div>
      </div>

      {/* ── Trinity-Relativierung ─────────────────────────────────────── */}
      <div className="wr-section">
        <div className="wr-section__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="wr-section__body">
          <h3 className="wr-section__title">Trinity-Relativierung</h3>
          <p className="wr-section__text">
            Die Trinity-Studie wurde für einen Ruhestand von 30 Jahren konzipiert.
            Wer heute eine Unabhängigkeit von 50 Jahren oder mehr plant, muss die
            Entnahmerate deutlich defensiver kalkulieren. In der modernen
            Finanzmathematik gilt die klassische <strong>4%-Marke</strong> für
            langfristige Szenarien oft als deutlich zu aggressiv und erhöht das
            Risiko einer vorzeitigen Kapitalerschöpfung massiv.
          </p>
        </div>
      </div>

      {/* ── Reallabor Deutschland ─────────────────────────────────────── */}
      <div className="wr-section">
        <div className="wr-section__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="22" x2="21" y2="22" />
            <rect x="2" y="6" width="20" height="16" rx="1" />
            <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            <line x1="12" y1="10" x2="12" y2="18" />
            <line x1="8" y1="14" x2="16" y2="14" />
          </svg>
        </div>
        <div className="wr-section__body">
          <h3 className="wr-section__title">Reallabor Deutschland</h3>
          <div className="wr-items">
            <div className="wr-item">
              <p className="wr-item__category">GESUNDHEIT</p>
              <p className="wr-item__name">GKV & PV</p>
              <p className="wr-item__desc">
                Beitragslasten im Ruhestand werden oft unterschätzt. Sie wirken
                wie eine zusätzliche Entnahmerate.
              </p>
            </div>
            <div className="wr-item">
              <p className="wr-item__category">RISIKO</p>
              <p className="wr-item__name">KapSt</p>
              <p className="wr-item__desc">
                Die Abgeltungssteuer und Teilfreistellung verzerren
                Makro-Simulationen massiv.
              </p>
            </div>
            <div className="wr-item">
              <p className="wr-item__category">ERGÄNZUNG</p>
              <p className="wr-item__name">Real-SWR</p>
              <p className="wr-item__desc">
                In Deutschland liegt die netto-verfügbare Rate signifikant
                unter US-Benchmarks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keine Erfolgszusage ───────────────────────────────────────── */}
      <div className="wr-warning">
        <div className="wr-warning__header">
          <div className="wr-warning__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span className="wr-warning__title">Keine Erfolgszusage</span>
        </div>
        <p className="wr-warning__text">
          Historische Daten sind keine Garantie für die Zukunft. Jedes Modell
          stößt an seine Grenzen, wenn schwarze Schwäne oder strukturelle
          Marktveränderungen eintreten. Ihre Entnahme bleibt ein dynamisches
          Experiment.
        </p>
      </div>

    </div>
  );
};

export default WithdrawalRules;
