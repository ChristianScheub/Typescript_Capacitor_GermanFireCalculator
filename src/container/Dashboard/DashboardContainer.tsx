import { useTranslation }  from 'react-i18next';
import { useFireContext }  from '../../context/useFireContext';
import { fireService, fmtCurrency, fmtPercent } from '../../services/fire';
import { DashboardView }   from '../../views/DashboardView';
import type { Tab }         from '../../types/navigation/Tab';

interface Props {
  readonly onTabChange: (tab: Tab) => void;
}

export function DashboardContainer({ onTabChange }: Props) {
  const { t } = useTranslation();
  const {
    state,
    netWorth,
    firePercentage,
    fireDate,
    chartData,
    monthlySavings,
    weightedReturn,
    fireTarget,
  } = useFireContext();

  const monthlyAssetIncome = fireService.calcAssetIncome(netWorth, weightedReturn) / 12;
  const yearsToFire        = Math.max(0, fireDate.year - new Date().getFullYear());
  const annualReturnFormatted = fmtPercent(weightedReturn * 100, 1);

  // Next milestone: 50% → 75% → FIRE goal (100%)
  let milestoneRatio: number;
  if (firePercentage < 50) {
    milestoneRatio = 0.5;
  } else if (firePercentage < 75) {
    milestoneRatio = 0.75;
  } else {
    milestoneRatio = 1;
  }
  const milestoneTarget = fireTarget * milestoneRatio;
  const r = weightedReturn / 12; // monthly rate
  const monthsToMilestone = (() => {
    if (milestoneTarget <= netWorth) return 0;
    if (r > 0) {
      // Compound interest formula: n = log((T*r + s) / (P*r + s)) / log(1 + r)
      const n = Math.log((milestoneTarget * r + monthlySavings) / (netWorth * r + monthlySavings)) / Math.log(1 + r);
      return Math.max(1, Math.round(n));
    }
    // Fallback: no return, purely linear
    return monthlySavings > 0 ? Math.max(1, Math.round((milestoneTarget - netWorth) / monthlySavings)) : 0;
  })();
  let milestoneLabel: string;
  if (milestoneRatio === 0.5) {
    milestoneLabel = t('dashboard.milestoneHalfway');
  } else if (milestoneRatio === 0.75) {
    milestoneLabel = t('dashboard.milestone75');
  } else {
    milestoneLabel = t('dashboard.milestoneFireGoal');
  }

  let nextMilestoneText: string;
  if (firePercentage >= 100) {
    nextMilestoneText = t('dashboard.milestoneAchieved');
  } else if (monthsToMilestone < 100) {
    nextMilestoneText = t('dashboard.milestoneReachedInMonths', { label: milestoneLabel, count: monthsToMilestone });
  } else {
    nextMilestoneText = t('dashboard.milestoneReachedInYears', { label: milestoneLabel, count: (monthsToMilestone / 12).toFixed(1) });
  }

  return (
    <DashboardView
      firePercentage={firePercentage}
      yearsToFire={yearsToFire}
      netWorthFormatted={fmtCurrency(netWorth)}
      monthlySavingsFormatted={fmtCurrency(monthlySavings)}
      annualReturnFormatted={annualReturnFormatted}
      assetIncomeFormatted={fmtCurrency(monthlyAssetIncome)}
      nextMilestoneText={nextMilestoneText}
      chartData={chartData}
      showAbsoluteNumbers={state.showAbsoluteNumbers}
      onTabChange={onTabChange}
    />
  );
}
