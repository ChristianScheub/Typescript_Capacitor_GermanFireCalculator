import { useState, useMemo }                                from 'react';
import { useFireContext }                                  from '../../context/FireContext';
import { fireService, FIRE_CONSTANTS } from '../../services/fire';
import { SteuerView }                                     from '../../views/ScenarioView';
import { PrognoseContentContainer }                       from '../Prognose/PrognoseContentContainer';
import { MonteCarloContainer }                            from '../MonteCarlo/MonteCarloContainer';
import type { PrognoseConfig }                            from '../../types/prognose/PrognoseConfig';

export function SteuerContainer() {
  const { state, fireDate, monthlySavings, fireTarget } = useFireContext();

  const [selectedBadge, setSelectedBadge] = useState<string | null>('BASIS');
  const [isMonteCarloSelected, setIsMonteCarloSelected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Scenario configs ──────────────────────────────────────────────────────────

  const basisConfig: PrognoseConfig = useMemo(() => ({
    badge:         'BASIS',
    stateOverride: {},
  }), []);

  const teilzeitConfig: PrognoseConfig = useMemo(() => ({
    badge:         'TEILZEIT',
    stateOverride: { monthlySavingsAmount: state.monthlySavingsAmount * FIRE_CONSTANTS.TEILZEIT_FACTOR },
  }), [state.monthlySavingsAmount]);

  const crashConfig: PrognoseConfig = useMemo(() => ({
    badge:         'CRASH',
    stateOverride: {
      etfBalance:  state.etfBalance  * FIRE_CONSTANTS.CRASH_FACTOR,
      cashBalance: state.cashBalance * FIRE_CONSTANTS.CRASH_FACTOR,
    },
  }), [state.etfBalance, state.cashBalance]);

  const hardcoreConfig: PrognoseConfig = useMemo(() => ({
    badge:         'HARDCORE',
    stateOverride: { variableExpenses: state.variableExpenses * FIRE_CONSTANTS.HARDCORE_FIRE_FACTOR },
  }), [state.variableExpenses]);

  // ── Delta calculations ────────────────────────────────────────────────────────

  const teilzeitFIREDate = useMemo(() => {
    const savings = state.monthlySavingsAmount * FIRE_CONSTANTS.TEILZEIT_FACTOR;
    return fireService.calcFIREDate(state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, savings, fireTarget, state.savingsGrowthRate);
  }, [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, state.monthlySavingsAmount, state.savingsGrowthRate, fireTarget]);

  const teilzeitDeltaYears = teilzeitFIREDate.year - fireDate.year;

  const crashFIREDate = useMemo(() => {
    return fireService.calcFIREDate(
      state.etfBalance * FIRE_CONSTANTS.CRASH_FACTOR,
      state.cashBalance * FIRE_CONSTANTS.CRASH_FACTOR,
      state.etfRate, state.cashRate, monthlySavings, fireTarget, state.savingsGrowthRate,
    );
  }, [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, state.savingsGrowthRate, fireTarget]);

  const crashDeltaMonths = Math.round(
    (crashFIREDate.year - fireDate.year) * 12
    + (new Date(crashFIREDate.year, 0).getMonth() - new Date(fireDate.year, 0).getMonth()),
  );

  const hardcoreFIREDate = useMemo(() => {
    const hardcoreExpenses = state.fixedExpenses + state.pkvContribution
      + state.variableExpenses * FIRE_CONSTANTS.HARDCORE_FIRE_FACTOR;
    const hardcoreTarget = (hardcoreExpenses * 12) / (state.etfWithdrawalRate / 100);
    return fireService.calcFIREDate(state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, monthlySavings, hardcoreTarget, state.savingsGrowthRate);
  }, [state.etfBalance, state.cashBalance, state.etfRate, state.cashRate, state.fixedExpenses, state.pkvContribution, state.variableExpenses, state.etfWithdrawalRate, monthlySavings, state.savingsGrowthRate]);

  const hardcoreDeltaYears = hardcoreFIREDate.year - fireDate.year;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleSelectBasis      = () => { setSelectedBadge(prev => prev === 'BASIS'    ? null : 'BASIS');    setIsMonteCarloSelected(false); };
  const handleSelectTeilzeit   = () => { setSelectedBadge(prev => prev === 'TEILZEIT' ? null : 'TEILZEIT'); setIsMonteCarloSelected(false); };
  const handleSelectCrash      = () => { setSelectedBadge(prev => prev === 'CRASH'    ? null : 'CRASH');    setIsMonteCarloSelected(false); };
  const handleSelectHardcore   = () => { setSelectedBadge(prev => prev === 'HARDCORE' ? null : 'HARDCORE'); setIsMonteCarloSelected(false); };
  const handleSelectMonteCarlo = () => { setIsMonteCarloSelected(prev => !prev); setSelectedBadge(null); };

  const selectedConfig = selectedBadge === 'BASIS'    ? basisConfig
    : selectedBadge === 'TEILZEIT' ? teilzeitConfig
    : selectedBadge === 'CRASH'    ? crashConfig
    : selectedBadge === 'HARDCORE' ? hardcoreConfig
    : null;

  const inlinePrognose = selectedConfig ? (
    <div className="scenario-inline-prognose">
      <PrognoseContentContainer config={selectedConfig} />
    </div>
  ) : isMonteCarloSelected ? (
    <div className="scenario-inline-prognose">
      <MonteCarloContainer />
    </div>
  ) : null;

  return (
    <SteuerView
      teilzeitDeltaYears={teilzeitDeltaYears}
      crashDeltaMonths={crashDeltaMonths}
      hardcoreDeltaYears={hardcoreDeltaYears}
      isBasicSelected={selectedBadge === 'BASIS'}
      isTeilzeitSelected={selectedBadge === 'TEILZEIT'}
      isCrashSelected={selectedBadge === 'CRASH'}
      isHardcoreSelected={selectedBadge === 'HARDCORE'}
      isMonteCarloSelected={isMonteCarloSelected}
      onSelectBasis={handleSelectBasis}
      onSelectTeilzeit={handleSelectTeilzeit}
      onSelectCrash={handleSelectCrash}
      onSelectHardcore={handleSelectHardcore}
      onSelectMonteCarlo={handleSelectMonteCarlo}
      isExpanded={isExpanded}
      onToggleExpanded={setIsExpanded}
      inlinePrognose={inlinePrognose}
    />
  );
}
