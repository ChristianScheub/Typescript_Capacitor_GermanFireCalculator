import { useState, useMemo }                                from 'react';
import { useTranslation }                                  from 'react-i18next';
import { useFireContext }                                  from '../../context/FireContext';
import { fireService, fmtCurrency, fmtPercent, FIRE_CONSTANTS } from '../../services/fire';
import { SteuerView }                                     from '../../views/SteuerView';
import { PrognoseContentContainer }                       from '../Prognose/PrognoseContentContainer';
import type { PrognoseConfig }                            from '../../types/prognose/PrognoseConfig';

export function SteuerContainer() {
  const { t } = useTranslation();
  const { state, firePercentage, netWorth, fireDate, monthlySavings, fireTarget, weightedReturn } = useFireContext();

  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // ── Scenario configs ──────────────────────────────────────────────────────────

  const teilzeitConfig: PrognoseConfig = useMemo(() => ({
    title:         t('tax.partTime'),
    badge:         'TEILZEIT',
    stateOverride: { monthlySavingsAmount: state.monthlySavingsAmount * FIRE_CONSTANTS.TEILZEIT_FACTOR },
  }), [t, state.monthlySavingsAmount]);

  const crashConfig: PrognoseConfig = useMemo(() => ({
    title:         t('tax.crash'),
    badge:         'CRASH',
    stateOverride: {
      etfBalance:    state.etfBalance    * FIRE_CONSTANTS.CRASH_FACTOR,
      cryptoBalance: state.cryptoBalance * FIRE_CONSTANTS.CRASH_FACTOR,
    },
  }), [t, state.etfBalance, state.cryptoBalance]);

  const hardcoreConfig: PrognoseConfig = useMemo(() => ({
    title:         t('tax.hardcoreFire'),
    badge:         'HARDCORE',
    stateOverride: { variableExpenses: state.variableExpenses * FIRE_CONSTANTS.HARDCORE_FIRE_FACTOR },
  }), [t, state.variableExpenses]);

  // ── Delta calculations ────────────────────────────────────────────────────────

  const teilzeitFIREDate = useMemo(() => {
    const savings = state.monthlySavingsAmount * FIRE_CONSTANTS.TEILZEIT_FACTOR;
    return fireService.calcFIREDate(netWorth, savings, fireTarget, weightedReturn);
  }, [state.monthlySavingsAmount, netWorth, fireTarget, weightedReturn]);

  const teilzeitDeltaYears = teilzeitFIREDate.year - fireDate.year;

  const crashFIREDate = useMemo(() => {
    const crashedPortfolio = netWorth * FIRE_CONSTANTS.CRASH_FACTOR;
    return fireService.calcFIREDate(crashedPortfolio, monthlySavings, fireTarget, weightedReturn);
  }, [netWorth, monthlySavings, fireTarget, weightedReturn]);

  const crashDeltaMonths = Math.round(
    (crashFIREDate.year - fireDate.year) * 12
    + (new Date(crashFIREDate.year, 0).getMonth() - new Date(fireDate.year, 0).getMonth()),
  );

  const hardcoreFIREDate = useMemo(() => {
    const hardcoreExpenses = state.fixedExpenses + state.pkvContribution
      + state.variableExpenses * FIRE_CONSTANTS.HARDCORE_FIRE_FACTOR;
    const hardcoreTarget = (hardcoreExpenses * 12) / FIRE_CONSTANTS.SWR_RATE;
    return fireService.calcFIREDate(netWorth, monthlySavings, hardcoreTarget, weightedReturn);
  }, [state.fixedExpenses, state.pkvContribution, state.variableExpenses, netWorth, monthlySavings, weightedReturn]);

  const hardcoreDeltaYears = hardcoreFIREDate.year - fireDate.year;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleSelectTeilzeit  = () => setSelectedBadge(prev => prev === 'TEILZEIT'  ? null : 'TEILZEIT');
  const handleSelectCrash     = () => setSelectedBadge(prev => prev === 'CRASH'     ? null : 'CRASH');
  const handleSelectHardcore  = () => setSelectedBadge(prev => prev === 'HARDCORE'  ? null : 'HARDCORE');

  const selectedConfig = selectedBadge === 'TEILZEIT' ? teilzeitConfig
    : selectedBadge === 'CRASH'    ? crashConfig
    : selectedBadge === 'HARDCORE' ? hardcoreConfig
    : null;

  const inlinePrognose = selectedConfig ? (
    <div className="scenario-inline-prognose">
      <PrognoseContentContainer config={selectedConfig} />
    </div>
  ) : null;

  return (
    <SteuerView
      firePercentageRounded={Math.round(firePercentage)}
      firePercentage={firePercentage}
      fireDateMonth={fireDate.month}
      fireDateYear={fireDate.year}
      netWorthFormatted={fmtCurrency(netWorth)}
      fireTargetFormatted={fmtCurrency(fireTarget)}
      monthlySavingsFormatted={fmtCurrency(monthlySavings)}
      annualReturnFormatted={fmtPercent(FIRE_CONSTANTS.ANNUAL_RETURN * 100, 0)}
      teilzeitDeltaYears={teilzeitDeltaYears}
      crashDeltaMonths={crashDeltaMonths}
      hardcoreDeltaYears={hardcoreDeltaYears}
      isTeilzeitSelected={selectedBadge === 'TEILZEIT'}
      isCrashSelected={selectedBadge === 'CRASH'}
      isHardcoreSelected={selectedBadge === 'HARDCORE'}
      onSelectTeilzeit={handleSelectTeilzeit}
      onSelectCrash={handleSelectCrash}
      onSelectHardcore={handleSelectHardcore}
      inlinePrognose={inlinePrognose}
    />
  );
}
