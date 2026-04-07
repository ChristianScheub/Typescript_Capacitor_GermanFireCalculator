import { useTranslation } from 'react-i18next';
import type { FireState }  from '../types/fire/models/FireState';

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


interface PlannerViewProps {
  state:                    FireState;
  updateField:              <K extends keyof FireState>(key: K, value: FireState[K]) => void;
  firePercentageRounded:    number;
  fireProgressWidth:        string;
  totalFixedWithKVFormatted: string;
  gkvMonthlyFormatted:      string;
  isCapped:                 boolean;
}

export function PlannerView({
  state,
  updateField,
  firePercentageRounded,
  fireProgressWidth,
  totalFixedWithKVFormatted,
  gkvMonthlyFormatted,
  isCapped,
}: PlannerViewProps) {
  const { t } = useTranslation();

  return (
    <div className="screen">
      <header className="app-header">
        <div className="app-header__brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22"/>
            <rect x="3" y="14" width="4" height="8"/><rect x="10" y="10" width="4" height="12"/><rect x="17" y="6" width="4" height="16"/>
            <line x1="4" y1="9" x2="20" y2="3"/>
          </svg>
          <span>{t('planner.title')}</span>
        </div>
        <button className="icon-btn" aria-label="Hilfe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d={t('planner.icon1')} />
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="screen__content screen__content--has-footer">
        <section className="page-title-section">
          <p className="label-overline">PLANER-MODUL</p>
          <h1 className="page-heading">Die Architektur Ihrer<br />finanziellen Freiheit.</h1>
        </section>

        {/* ── Sparrate ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">{t('planner.savingsSection')}</h2>
              <p className="section-card__subtitle">{t('planner.savingsSectionSub')}</p>
            </div>
            <div className="section-icon section-icon--green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
          </div>
          <NumericInput
            label={t('planner.monthlySavings')}
            value={state.monthlySavingsAmount}
            unit="€"
            onChange={v => updateField('monthlySavingsAmount', v)}
            hint={t('planner.monthlySavingsHint')}
          />
          <NumericInput
            label={t('planner.savingsGrowthRate')}
            value={state.savingsGrowthRate}
            unit="%"
            onChange={v => updateField('savingsGrowthRate', v)}
            hint={t('planner.savingsGrowthRateHint')}
          />
        </div>

        {/* ── Rente & Alter ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">{t('planner.pensionSection')}</h2>
              <p className="section-card__subtitle">{t('planner.pensionSectionSub')}</p>
            </div>
            <div className="section-icon section-icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
          </div>
          <NumericInput label={t('planner.currentAge')}   value={state.currentAge}    unit={t('planner.years')} onChange={v => updateField('currentAge', v)} />
          <NumericInput label={t('planner.pensionAge')}   value={state.pensionAge}    unit={t('planner.years')} onChange={v => updateField('pensionAge', v)} />
          <NumericInput label={t('planner.pensionMonthly')} value={state.pensionMonthly} unit="€" onChange={v => updateField('pensionMonthly', v)}
            hint={t('planner.pensionMonthlyHint')} />
        </div>

        {/* ── Portfolio-Mix ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">Portfolio-Mix</h2>
              <p className="section-card__subtitle">Aktuelle Vermögensverteilung</p>
            </div>
            <div className="section-icon section-icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t('planner.icon2')}/><path d={t('planner.icon3')}/>
              </svg>
            </div>
          </div>
          <NumericInput label={t('planner.etfStocks')} value={state.etfBalance} unit="€" onChange={v => updateField('etfBalance', v)} />
          <NumericInput label={t('planner.expectedReturnEtf')} value={state.etfRate} unit="%" onChange={v => updateField('etfRate', v)}
            hint={t('planner.taxEtf')} />
          <NumericInput label={t('planner.etfWithdrawalRate')} value={state.etfWithdrawalRate} unit="%" onChange={v => updateField('etfWithdrawalRate', v)}
            hint={t('planner.etfWithdrawalRateHint')} />
          <NumericInput label={t('planner.cash')} value={state.cashBalance} unit="€" onChange={v => updateField('cashBalance', v)} />
          <NumericInput label={t('planner.interestRateCash')} value={state.cashRate} unit="%" onChange={v => updateField('cashRate', v)}
            hint={t('planner.taxCash')} />
        </div>

        {/* ── Ruhestand Budget ── */}
        <div className="section-card">
          <div className="section-card__header">
            <div>
              <h2 className="section-card__title">{t('planner.retirementBudgetTitle')}</h2>
              <p className="section-card__subtitle">{t('planner.retirementBudgetSub')}</p>
            </div>
            <div className="section-icon section-icon--orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
          </div>
          <NumericInput
            label={t('planner.fixedExpenses')}
            value={state.fixedExpenses}
            unit="€"
            onChange={v => updateField('fixedExpenses', v)}
            hint={t('planner.fixedExpensesNote')}
          />
          <em className="field__hint field__hint--total">
            {t('planner.fixedTotalHint')}: {totalFixedWithKVFormatted} € / Monat
          </em>
          <NumericInput
            label={t('planner.variableExpenses')}
            value={state.variableExpenses}
            unit="€"
            onChange={v => updateField('variableExpenses', v)}
            hint={t('planner.variableExpensesNote')}
          />
          <NumericInput
            label={t('planner.inflationRate')}
            value={state.inflationRate}
            unit="%"
            onChange={v => updateField('inflationRate', v)}
            hint={t('planner.inflationRateHint')}
          />
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
                <path d={t('planner.icon4')} />
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
          {!state.isPkvUser && (
            <div className="info-card" style={{ marginTop: '16px' }}>
              <div className="info-card__text">
                <p className="info-card__title">GKV-Beitrag im Ruhestand</p>
                <p className="info-card__body">
                  {isCapped
                    ? `Es wird der GKV-Höchstbetrag von ${gkvMonthlyFormatted} € / Monat berücksichtigt (Beitragsdeckel).`
                    : `Es werden ca. 21% Ihres Asset-Einkommens im FIRE-Jahr berücksichtigt (~${gkvMonthlyFormatted} € / Monat, max. 1.300 €).`
                  }
                </p>
              </div>
            </div>
          )}
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
          <NumericInput
            label={t('planner.assetTaxRate')}
            value={state.assetTaxRate}
            unit="%"
            onChange={v => updateField('assetTaxRate', v)}
          />
          <div className="info-card">
            <div className="kpi-icon kpi-icon--green kpi-icon--sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="info-card__text">
              <p className="info-card__title">{t('planner.assetTaxRateTitle')}</p>
              <p className="info-card__body">{t('planner.assetTaxRateHint')}</p>
            </div>
          </div>
        </div>

        <div style={{ height: '8px' }} />
      </div>

      <div className="planner-footer">
        <div className="fire-status-bar">
          <p className="fire-status-bar__label">AKTUELLER STATUS</p>
          <p className="fire-status-bar__pct">{firePercentageRounded}%</p>
          <p className="fire-status-bar__hint">Ihres finanziellen Fundaments ist gelegt.</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${fireProgressWidth}` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
