import { useTranslation }            from 'react-i18next';
import { ScenarioAnalysisCard }      from './ScenarioAnalysisCard';
import type { ScenarioSliderProps }  from '../../types/ui/scenarioProps';
import './ScenarioSlider.css';

export function ScenarioSlider({
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
    <div className="scenario-slider">
      <div className="scenario-slider__track">
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isBasicSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.fireCalculation')}
          subtitle={t('tax.fireCalculationSub')}
          resultBadge={t('tax.standard')}
          typeBadge={t('tax.badgeSimulation')}
          typeBadgeVariant="lifestyle"
          resultBadgeVariant="positive"
          selected={isBasicSelected}
          onClick={onSelectBasis}
        />
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isTeilzeitSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.partTime')}
          subtitle={t('tax.partTimeSub')}
          resultBadge={`+${teilzeitDeltaYears} ${teilzeitDeltaYears === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${t('tax.untilFire')}`}
          typeBadge={t('tax.badgeLifestyle')}
          typeBadgeVariant="lifestyle"
          resultBadgeVariant="warn"
          selected={isTeilzeitSelected}
          onClick={onSelectTeilzeit}
        />
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isCrashSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.crash')}
          subtitle={t('tax.crashSub')}
          resultBadge={`${crashDeltaMonths > 0 ? `+${crashDeltaMonths}` : String(crashDeltaMonths)} ${t('tax.crashDeltaUnit')}`}
          typeBadge={t('tax.badgeRisk')}
          typeBadgeVariant="risk"
          resultBadgeVariant="danger"
          selected={isCrashSelected}
          onClick={onSelectCrash}
        />
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isHardcoreSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.hardcoreFire')}
          subtitle={t('tax.hardcoreFireSub')}
          resultBadge={`${hardcoreDeltaYears} ${Math.abs(hardcoreDeltaYears) === 1 ? t('tax.yearSingular') : t('tax.yearPlural')} ${hardcoreDeltaYears <= 0 ? t('tax.earlier') : t('tax.later')}`}
          typeBadge={t('tax.badgeSavings')}
          typeBadgeVariant="lifestyle"
          resultBadgeVariant="positive"
          selected={isHardcoreSelected}
          onClick={onSelectHardcore}
        />
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isMonteCarloSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.monteCarloTitle')}
          subtitle={t('tax.monteCarloSub')}
          resultBadge={t('tax.monteCarloSimulations')}
          typeBadge={t('tax.badgeSimulation')}
          typeBadgeVariant="simulation"
          resultBadgeVariant="positive"
          selected={isMonteCarloSelected}
          onClick={onSelectMonteCarlo}
        />
        <ScenarioAnalysisCard
          variant="slider"
          statusLabel={isMonteCarloProSelected ? 'AKTIV' : 'INAKTIV'}
          title={t('tax.monteCarloProTitle')}
          subtitle={t('tax.monteCarloProSub')}
          resultBadge={t('tax.monteCarloSimulations')}
          typeBadge={t('tax.badgeSimulation')}
          typeBadgeVariant="simulation"
          resultBadgeVariant="positive"
          selected={isMonteCarloProSelected}
          onClick={onSelectMonteCarloPro}
        />
      </div>
    </div>
  );
}
