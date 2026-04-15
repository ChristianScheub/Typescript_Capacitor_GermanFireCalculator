import { useTranslation }            from 'react-i18next';
import { ScenarioListItem }          from './ScenarioListItem';
import type { ScenarioSliderProps }  from '../../types/ui/scenarioProps';

export function ScenarioList({
  teilzeitDeltaYears,
  crashDeltaMonths,
  hardcoreDeltaYears,
  isBasicSelected,
  isTeilzeitSelected,
  isCrashSelected,
  isHardcoreSelected,
  isMonteCarloSelected,
  isMonteCarloProSelected,
  onSelectBasis,
  onSelectTeilzeit,
  onSelectCrash,
  onSelectHardcore,
  onSelectMonteCarlo,
  onSelectMonteCarloPro,
}: ScenarioSliderProps) {
  const { t } = useTranslation();

  return (
    <div className="scenario-list">
      <ScenarioListItem
        title={t('tax.fireCalculation')}
        subtitle={t('tax.fireCalculationSub')}
        resultBadge={t('tax.standard')}
        resultBadgeVariant="positive"
        typeBadge={t('tax.badgeSimulation')}
        isActive={isBasicSelected}
        actionLabel={isBasicSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isBasicSelected}
        onClick={onSelectBasis}
      />
      <ScenarioListItem
        title={t('tax.partTime')}
        subtitle={t('tax.partTimeSub')}
        resultBadge={`+${teilzeitDeltaYears} ${teilzeitDeltaYears === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${t('tax.untilFire')}`}
        resultBadgeVariant="warn"
        typeBadge={t('tax.badgeLifestyle')}
        isActive={isTeilzeitSelected}
        actionLabel={isTeilzeitSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isTeilzeitSelected}
        onClick={onSelectTeilzeit}
      />
      <ScenarioListItem
        title={t('tax.crash')}
        subtitle={t('tax.crashSub')}
        resultBadge={`${crashDeltaMonths > 0 ? `+${crashDeltaMonths}` : String(crashDeltaMonths)} ${t('tax.crashDeltaUnit')}`}
        resultBadgeVariant="danger"
        typeBadge={t('tax.badgeRisk')}
        isActive={isCrashSelected}
        actionLabel={isCrashSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isCrashSelected}
        onClick={onSelectCrash}
      />
      <ScenarioListItem
        title={t('tax.hardcoreFire')}
        subtitle={t('tax.hardcoreFireSub')}
        resultBadge={`${hardcoreDeltaYears} ${Math.abs(hardcoreDeltaYears) === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${hardcoreDeltaYears <= 0 ? t('tax.earlier') : t('tax.later')}`}
        resultBadgeVariant="positive"
        typeBadge={t('tax.badgeSavings')}
        isActive={isHardcoreSelected}
        actionLabel={isHardcoreSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isHardcoreSelected}
        onClick={onSelectHardcore}
      />
      <ScenarioListItem
        title={t('tax.monteCarloTitle')}
        subtitle={t('tax.monteCarloSub')}
        resultBadge={t('tax.monteCarloSimulations')}
        resultBadgeVariant="positive"
        typeBadge={t('tax.badgeSimulation')}
        isActive={isMonteCarloSelected}
        actionLabel={isMonteCarloSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isMonteCarloSelected}
        onClick={onSelectMonteCarlo}
      />
      <ScenarioListItem
        title={t('tax.monteCarloProTitle')}
        subtitle={t('tax.monteCarloProSub')}
        resultBadge={t('tax.monteCarloSimulations')}
        resultBadgeVariant="positive"
        typeBadge={t('tax.badgeSimulation')}
        isActive={isMonteCarloProSelected}
        actionLabel={isMonteCarloProSelected ? t('tax.editBtn') : t('tax.activateBtn')}
        selected={isMonteCarloProSelected}
        onClick={onSelectMonteCarloPro}
      />
    </div>
  );
}
