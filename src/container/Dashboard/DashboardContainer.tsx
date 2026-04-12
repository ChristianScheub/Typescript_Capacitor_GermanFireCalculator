import { useFireContext }  from '../../context/FireContext';
import { fireService, fmtCurrency, fmtPercent } from '../../services/fire';
import { DashboardView }   from '../../views/DashboardView';
import type { Tab }         from '../../types/navigation/Tab';

interface Props {
  onTabChange: (tab: Tab) => void;
}

export function DashboardContainer({ onTabChange }: Props) {
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

  // Next milestone: halfway (50%) or 75%
  const milestoneRatio  = firePercentage < 50 ? 0.5 : 0.75;
  const milestoneTarget = fireTarget * milestoneRatio;
  const monthlyGrowth   = monthlySavings + (netWorth * weightedReturn) / 12;
  const monthsToMilestone = monthlyGrowth > 0
    ? Math.max(1, Math.round((milestoneTarget - netWorth) / monthlyGrowth))
    : 0;
  const milestoneLabel  = milestoneRatio === 0.5 ? 'Halbzeit' : '75%';
  const milestoneTimeText = monthsToMilestone < 100
    ? `${monthsToMilestone} Monaten`
    : `${(monthsToMilestone / 12).toFixed(1)} Jahren`;
  const nextMilestoneText = firePercentage < 100
    ? `${milestoneLabel} erreicht in ${milestoneTimeText}`
    : `FIRE-Ziel erreicht`;

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
