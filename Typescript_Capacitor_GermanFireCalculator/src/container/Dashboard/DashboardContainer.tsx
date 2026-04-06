import { useFireContext }  from '../../context/FireContext';
import { fireService, fmtCurrency, fmtPercent } from '../../services/fire';
import { DashboardView }   from '../../views/DashboardView';
import type { Tab }         from '../../types/navigation/Tab';
import type { PrognoseConfig } from '../../types/prognose/PrognoseConfig';

interface Props {
  onTabChange:          (tab: Tab) => void;
  onNavigateToPrognose: (cfg: PrognoseConfig) => void;
}

export function DashboardContainer({ onTabChange, onNavigateToPrognose }: Props) {
  const {
    netWorth,
    firePercentage,
    fireDate,
    chartData,
    monthlySavings,
    weightedReturn,
  } = useFireContext();

  const growthBadge = netWorth > 0
    ? fmtPercent((monthlySavings / netWorth) * 100, 1)
    : '0,0';

  const monthlyAssetIncome = fireService.calcAssetIncome(netWorth, weightedReturn) / 12;

  return (
    <DashboardView
      firePercentageRounded={Math.round(firePercentage)}
      firePercentage={firePercentage}
      fireDateMonth={fireDate.month}
      fireDateYear={fireDate.year}
      netWorthFormatted={fmtCurrency(netWorth)}
      growthBadge={growthBadge}
      monthlySavingsFormatted={fmtCurrency(monthlySavings)}
      assetIncomeFormatted={fmtCurrency(monthlyAssetIncome)}
      chartData={chartData}
      onTabChange={onTabChange}
      onNavigateToPrognose={onNavigateToPrognose}
    />
  );
}
