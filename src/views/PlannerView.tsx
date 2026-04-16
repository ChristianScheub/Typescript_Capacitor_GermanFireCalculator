import { useTranslation } from 'react-i18next';
import { NumericInput }   from '../ui/inputs/NumericInput';
import { ContentSection } from '../ui/cards/InputCard';
import { Icon }           from '../ui/icons';
import type { FireState }  from '../types/fire/models/FireState';


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
      <div className="screen__content screen__content--has-footer">
        <section className="page-title-section">
          <p className="label-overline">{t('planner.plannerModule')}</p>
          <h1 className="page-heading">{t('planner.architectureTitle')}</h1>
        </section>

        {/* ── Sparrate ── */}
        <ContentSection
          title={t('planner.savingsSection')}
          subtitle={t('planner.savingsSectionSub')}
          iconVariant="green"
          icon={<Icon name="wallet" size="md" />}
          variant="section"
        >
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
        </ContentSection>

        {/* ── Rente & Alter ── */}
        <ContentSection
          title={t('planner.pensionSection')}
          subtitle={t('planner.pensionSectionSub')}
          iconVariant="teal"
          icon={<Icon name="calendar" size="md" />}
          variant="section"
        >
          <NumericInput label={t('planner.currentAge')}   value={state.currentAge}    unit={t('planner.years')} onChange={v => updateField('currentAge', v)} />
          <NumericInput label={t('planner.pensionAge')}   value={state.pensionAge}    unit={t('planner.years')} onChange={v => updateField('pensionAge', v)} />
          <NumericInput label={t('planner.pensionMonthly')} value={state.pensionMonthly} unit="€" onChange={v => updateField('pensionMonthly', v)}
            hint={t('planner.pensionMonthlyHint')} />
        </ContentSection>

        {/* ── Portfolio-Mix ── */}
        <ContentSection
          title={t('planner.portfolioMix')}
          subtitle={t('planner.portfolioMixSub')}
          iconVariant="teal"
          icon={<Icon name="grid" size="md" />}
          variant="section"
        >
          <NumericInput label={t('planner.etfStocks')} value={state.etfBalance} unit="€" onChange={v => updateField('etfBalance', v)} />
          <NumericInput label={t('planner.expectedReturnEtf')} value={state.etfRate} unit="%" onChange={v => updateField('etfRate', v)}
            hint={t('planner.taxEtf')} />
          <NumericInput label={t('planner.etfWithdrawalRate')} value={state.etfWithdrawalRate} unit="%" onChange={v => updateField('etfWithdrawalRate', v)}
            hint={t('planner.etfWithdrawalRateHint')} />
          <NumericInput label={t('planner.cash')} value={state.cashBalance} unit="€" onChange={v => updateField('cashBalance', v)} />
          <NumericInput label={t('planner.interestRateCash')} value={state.cashRate} unit="%" onChange={v => updateField('cashRate', v)}
            hint={t('planner.taxCash')} />
        </ContentSection>

        {/* ── Ruhestand Budget ── */}
        <ContentSection
          title={t('planner.retirementBudgetTitle')}
          subtitle={t('planner.retirementBudgetSub')}
          iconVariant="orange"
          icon={<Icon name="wallet_2" size="md" />}
          variant="section"
        >
          <NumericInput
            label={t('planner.fixedExpenses')}
            value={state.fixedExpenses}
            unit="€"
            onChange={v => updateField('fixedExpenses', v)}
            hint={t('planner.fixedExpensesNote')}
          />
          <em className="field__hint field__hint--total">
            {t('planner.fixedTotalHint')}: {totalFixedWithKVFormatted} {t('planner.perMonth')}
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
        </ContentSection>

        {/* ── KV-Check ── */}
        <ContentSection
          title={t('planner.kvCheck')}
          subtitle={t('planner.kvCheckSub')}
          iconVariant="teal"
          icon={<Icon name="info" size="md" />}
          variant="section"
        >
          <div className="segmented">
            <button
              className={`segmented__btn${!state.isPkvUser ? ' segmented__btn--active' : ''}`}
              onClick={() => updateField('isPkvUser', false)}
            >{t('planner.gkv')}</button>
            <button
              className={`segmented__btn${state.isPkvUser ? ' segmented__btn--active' : ''}`}
              onClick={() => updateField('isPkvUser', true)}
            >{t('planner.pkv')}</button>
          </div>
          {!state.isPkvUser && (
            <div className="info-card mt-4">
              <div className="info-card__text">
                <p className="info-card__title">{t('planner.gkvContributionTitle')}</p>
                <p className="info-card__body">
                  {isCapped
                    ? t('planner.gkvCapped', { amount: gkvMonthlyFormatted })
                    : t('planner.gkvUncapped', { amount: gkvMonthlyFormatted })
                  }
                </p>
              </div>
            </div>
          )}
          {state.isPkvUser && (
            <NumericInput
              label={t('planner.pkvMonthlyContribution')}
              value={state.pkvContribution}
              unit="€"
              onChange={v => updateField('pkvContribution', v)}
            />
          )}
        </ContentSection>

        {/* ── Steuer-Check ── */}
        <ContentSection
          title={t('planner.taxCheck')}
          subtitle={t('planner.taxCheckSub')}
          iconVariant="orange"
          icon={<Icon name="info" size="md" />}
          variant="section"
        >
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
        </ContentSection>

        <div className="h-2" />
      </div>

      <div className="planner-footer">
        <div className="fire-status-bar">
          <p className="fire-status-bar__label">{t('planner.currentStatus')}</p>
          <p className="fire-status-bar__pct">{firePercentageRounded}%</p>
          <p className="fire-status-bar__hint">{t('planner.foundationLaid')}</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ "--width": `${fireProgressWidth}` } as React.CSSProperties} />
          </div>
        </div>
      </div>
    </div>
  );
}
