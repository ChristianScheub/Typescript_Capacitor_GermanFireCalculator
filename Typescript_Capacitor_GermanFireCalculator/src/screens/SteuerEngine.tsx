import { useFireContext } from '../context/FireContext';
import { fmtPercent }    from '../services/fire/formatters';

export function SteuerEngine() {
  const { state, updateField, abgabenQuote } = useFireContext();

  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>STEUER-ENGINE</span>
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
          <p className="label-overline">SIMULATION &amp; PROGNOSE</p>
          <h1 className="page-heading">Optimiere deine<br />Abgaben-Last.</h1>
          <p className="page-desc">
            Die Steuer-Engine berechnet präzise deine Netto-Entnahmen unter
            Berücksichtigung deutscher Sozial- und Steuergesetzgebung.
          </p>
        </section>

        <div className="card kpi-large-card">
          <div className="kpi-large-card__header">
            <p className="label-overline">ABGABEN-QUOTE</p>
            <div className="kpi-icon kpi-icon--gray">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
          </div>
          <p className="kpi-large-card__value">
            {fmtPercent(abgabenQuote)}<span className="kpi-large-card__unit"> %</span>
          </p>
          <div className="meter">
            <div className="meter__fill" style={{ width: `${Math.min(100, abgabenQuote)}%` }} />
          </div>
          <p className="kpi-large-card__label">STEUERN + KRANKENKASSE (KV)</p>
        </div>

        <div className="section-card">
          <div className="section-card__header">
            <h2 className="section-card__title section-card__title--bordered">KV-CHECK</h2>
          </div>
          <div className="segmented">
            <button
              className={`segmented__btn${!state.isPkvUser ? ' segmented__btn--active' : ''}`}
              onClick={() => updateField('isPkvUser', false)}
            >GKV</button>
            <button
              className={`segmented__btn${state.isPkvUser ? ' segmented__btn--active' : ''}`}
              onClick={() => updateField('isPkvUser', true)}
            >PKV</button>
          </div>

          {state.isPkvUser && (
            <div className="field" style={{ marginTop: '16px' }}>
              <label className="field__label">MONATLICHER BEITRAG PKV</label>
              <div className="field__input-wrap">
                <input
                  className="field__input field__input--large-num"
                  type="number"
                  inputMode="numeric"
                  value={state.pkvContribution}
                  onChange={e => updateField('pkvContribution', Number(e.target.value))}
                />
                <span className="field__unit">€ / MONAT</span>
              </div>
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="section-card__header">
            <h2 className="section-card__title section-card__title--bordered">STEUER-CHECK</h2>
          </div>

          <div className="toggle-row">
            <div>
              <p className="toggle-row__title">Kirchensteuer</p>
              <p className="toggle-row__hint">Regelsatz 8% (BY/BW) bzw. 9%</p>
            </div>
            <button
              className={`toggle${state.hasKirchensteuer ? ' toggle--on' : ''}`}
              role="switch"
              aria-checked={state.hasKirchensteuer}
              onClick={() => updateField('hasKirchensteuer', !state.hasKirchensteuer)}
              aria-label="Kirchensteuer"
            >
              <span className="toggle__thumb" />
            </button>
          </div>

          <div className="info-card">
            <div className="kpi-icon kpi-icon--green kpi-icon--sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div className="info-card__text">
              <p className="info-card__title">Sparerpauschbetrag</p>
              <p className="info-card__body">
                Wir berücksichtigen automatisch den gesetzlichen Freibetrag von{' '}
                <strong>1.000 €</strong> pro Jahr für deine Kapitalerträge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
