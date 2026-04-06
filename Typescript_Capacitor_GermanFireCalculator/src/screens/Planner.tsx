import { useFireContext }   from '../context/FireContext';
import { fmtPercent, FIRE_CONSTANTS } from '../services/fire';

function NumericInput({
  label, value, unit, onChange, hint,
}: {
  label: string; value: number; unit: string;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <div className="field__input-wrap">
        {unit === '€' && <span className="field__currency-prefix">€</span>}
        <input
          className="field__input"
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <span className="field__unit">{unit !== '€' ? unit : ''}</span>
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

function SelectInput({
  label, value, options, onChange,
}: {
  label: string; value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <div className="field__select-wrap">
        <select className="field__select" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="field__select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

const SPAR_DYNAMIK = [
  { value: '0', label: 'Keine Anpassung' },
  { value: '1', label: '1 % p.a.' },
  { value: '2', label: '2 % (Inflationsausgleich)' },
  { value: '3', label: '3 % p.a.' },
];

export function Planner() {
  const { state, updateField, firePercentage } = useFireContext();

  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>FINANZ-CHECK</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content screen__content--has-footer">
        <section className="page-title-section">
          <p className="label-overline">PLANER-MODUL</p>
          <h1 className="page-heading">Die Architektur Ihrer<br />finanziellen Freiheit.</h1>
        </section>

        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">Einnahmen &amp; Sparen</h2>
              <p className="section-card__subtitle">Ihre monatliche Cashflow-Basis</p>
            </div>
            <div className="section-icon section-icon--green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
          </div>
          <NumericInput label="BRUTTOEINKOMMEN (P.M.)" value={state.monthlyBrutto} unit="€" onChange={v => updateField('monthlyBrutto', v)} />
          <NumericInput label="NETTOEINKOMMEN (P.M.)"  value={state.monthlyNetto}  unit="€" onChange={v => updateField('monthlyNetto', v)} />
          <NumericInput label="SPARRATE (%)"            value={state.savingsRate}   unit="%" onChange={v => updateField('savingsRate', v)} />
          <SelectInput  label="SPAR-DYNAMIK (P.A.)" value="2" options={SPAR_DYNAMIK} onChange={() => undefined} />
        </div>

        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">Portfolio-Mix</h2>
              <p className="section-card__subtitle">Aktuelle Vermögensverteilung</p>
            </div>
            <div className="section-icon section-icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
              </svg>
            </div>
          </div>
          <NumericInput label="ETFs / AKTIEN" value={state.etfBalance} unit="€" onChange={v => updateField('etfBalance', v)} />
          <NumericInput label="ERWARTETE RENDITE ETF (P.A.)" value={state.etfRate} unit="%" onChange={v => updateField('etfRate', v)}
            hint="Steuer: 25% Abgeltungssteuer + Soli (Teilfreistellung 30% bei Aktien-ETFs)." />
          <NumericInput label="CASH / TAGESGELD" value={state.cashBalance} unit="€" onChange={v => updateField('cashBalance', v)} />
          <NumericInput label="ZINSSATZ TAGESGELD (P.A.)" value={state.cashRate} unit="%" onChange={v => updateField('cashRate', v)}
            hint="Steuer: Zinserträge unterliegen der Abgeltungssteuer. 1.000€ Freibetrag p.P." />
          <NumericInput label="KRYPTO" value={state.cryptoBalance} unit="€" onChange={v => updateField('cryptoBalance', v)} />
          <NumericInput label="ERWARTETE RENDITE KRYPTO (P.A.)" value={state.cryptoRate} unit="%" onChange={v => updateField('cryptoRate', v)}
            hint="Steuer: Steuerfrei nach 1 Jahr Haltefrist. Unter 600€ Gewinn steuerfrei." />
        </div>

        <div className="section-card">
          <div className="section-card__header">
            <div><h2 className="section-card__title">Fixkosten</h2></div>
            <div className="section-icon section-icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
          </div>
          <NumericInput label="BUDGET IM RUHESTAND"       value={state.pensionExpenses} unit="€" onChange={v => updateField('pensionExpenses', v)}
            hint="Berücksichtigen Sie private Krankenversicherung &amp; Inflation." />
        </div>

        {/* ── KV-Check ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">KV-Check</h2>
              <p className="section-card__subtitle">Krankenversicherungs-Status</p>
            </div>
            <div className="section-icon section-icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
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

        {/* ── Steuer-Check ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">Steuer-Check</h2>
              <p className="section-card__subtitle">Optimierung &amp; Freibeträge</p>
            </div>
            <div className="section-icon section-icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"/>
                <circle cx="6.5" cy="6.5" r="2.5"/>
                <circle cx="17.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
          </div>
          <div className="toggle-row">
            <div>
              <p className="toggle-row__title">Kirchensteuer</p>
              <p className="toggle-row__hint">Regelsatz {FIRE_CONSTANTS.KIRCHENSTEUER_RATE * 100}% (BY/BW) bzw. 9%</p>
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
                <strong>1.000 €</strong> pro Jahr für Ihre Kapitalerträge.
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: '8px' }} />
      </div>

      <div className="planner-footer">
        <div className="fire-status-bar">
          <p className="fire-status-bar__label">AKTUELLER STATUS</p>
          <p className="fire-status-bar__pct">{Math.round(firePercentage)}%</p>
          <p className="fire-status-bar__hint">Ihres finanziellen Fundaments ist gelegt.</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${fmtPercent(firePercentage, 0)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
