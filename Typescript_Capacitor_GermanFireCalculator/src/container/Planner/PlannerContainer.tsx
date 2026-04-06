import { useFireContext }  from '../../context/FireContext';
import { fmtCurrency, FIRE_CONSTANTS } from '../../services/fire';
import { PlannerView }   from '../../views/PlannerView';

export function PlannerContainer() {
  const { state, updateField, firePercentage, fireTarget, weightedReturn } = useFireContext();

  const fireProgressWidth = `${Math.min(100, firePercentage).toFixed(0)}%`;

  // GKV: estimated monthly contribution = fireTarget * weightedReturn * 21% / 12, capped at 1 300 €
  const gkvMonthly = !state.isPkvUser
    ? Math.min(
        FIRE_CONSTANTS.GKV_MAX_MONTHLY,
        (fireTarget * weightedReturn * FIRE_CONSTANTS.GKV_RATE) / 12,
      )
    : 0;
  const gkvMonthlyFormatted = fmtCurrency(gkvMonthly);
  const isCapped             = !state.isPkvUser
    && (fireTarget * weightedReturn * FIRE_CONSTANTS.GKV_RATE) / 12 > FIRE_CONSTANTS.GKV_MAX_MONTHLY;

  // Total Fixkosten inkl. KV (shown as italic hint)
  const kvAmount              = state.isPkvUser ? state.pkvContribution : gkvMonthly;
  const totalFixedWithKV      = state.fixedExpenses + kvAmount;
  const totalFixedWithKVFormatted = fmtCurrency(totalFixedWithKV);

  return (
    <PlannerView
      state={state}
      updateField={updateField}
      firePercentageRounded={Math.round(firePercentage)}
      fireProgressWidth={fireProgressWidth}
      totalFixedWithKVFormatted={totalFixedWithKVFormatted}
      gkvMonthlyFormatted={gkvMonthlyFormatted}
      isCapped={isCapped}
    />
  );
}
