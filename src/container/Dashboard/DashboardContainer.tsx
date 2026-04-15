import { useTranslation }  from 'react-i18next';
import { useFireContext }  from '../../context/FireContext';
import { fireService, fmtCurrency, fmtPercent } from '../../services/fire';
import { DashboardView }   from '../../views/DashboardView';
import type { Tab }         from '../../types/navigation/Tab';

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function DashboardContainer({ onTabChange }: Props) {
  const { t } = useTranslation();
  const {
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
  const milestoneRatio  = firePercentage < 50 ? 0.5 : firePercentage < 75 ? 0.75 : 1.0;
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
  const milestoneLabel =
    milestoneRatio === 0.5  ? t('dashboard.milestoneHalfway') :
    milestoneRatio === 0.75 ? t('dashboard.milestone75') :
                              t('dashboard.milestoneFireGoal');
  const nextMilestoneText = firePercentage >= 100
    ? t('dashboard.milestoneAchieved')
    : monthsToMilestone < 100
      ? t('dashboard.milestoneReachedInMonths', { label: milestoneLabel, count: monthsToMilestone })
      : t('dashboard.milestoneReachedInYears', { label: milestoneLabel, count: (monthsToMilestone / 12).toFixed(1) });

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
      onTabChange={onTabChange}
    />
  );
}
