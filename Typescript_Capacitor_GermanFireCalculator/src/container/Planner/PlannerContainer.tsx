import { useFireContext }  from '../../context/FireContext';
import { fmtCurrency, FIRE_CONSTANTS } from '../../services/fire';
import { PlannerView }   from '../../views/PlannerView';

export function PlannerContainer() {
  const { state, updateField, firePercentage } = useFireContext();

  const kirchensteuerRateDisplay = String(FIRE_CONSTANTS.KIRCHENSTEUER_RATE * 100);
  const fireProgressWidth        = `${Math.min(100, firePercentage).toFixed(0)}%`;

  // Total Fixkosten inkl. KV (shown as italic hint)
  const totalFixedWithKV         = state.fixedExpenses + state.pkvContribution;
  const totalFixedWithKVFormatted = fmtCurrency(totalFixedWithKV);

  return (
    <PlannerView
      state={state}
      updateField={updateField}
      firePercentageRounded={Math.round(firePercentage)}
      fireProgressWidth={fireProgressWidth}
      kirchensteuerRateDisplay={kirchensteuerRateDisplay}
      totalFixedWithKVFormatted={totalFixedWithKVFormatted}
    />
  );
}
