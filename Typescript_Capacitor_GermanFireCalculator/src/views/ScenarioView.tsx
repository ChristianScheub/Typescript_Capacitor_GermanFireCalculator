import { type ReactNode }            from 'react';
import { useTranslation }            from 'react-i18next';
import { ScenarioSlider }           from '../ui/cards/ScenarioSlider';
import { ScenarioList }             from '../ui/cards/ScenarioList';
import type { ScenarioSliderProps } from '../types/ui/scenarioProps';

interface SteuerViewProps extends ScenarioSliderProps {
  isExpanded:       boolean;
  onToggleExpanded: (expanded: boolean) => void;
  inlinePrognose:   ReactNode;
}

export function SteuerView({
  teilzeitDeltaYears,
  crashDeltaMonths,
  hardcoreDeltaYears,
  isBasicSelected,
  isTeilzeitSelected,
  isCrashSelected,
  isHardcoreSelected,
  isMonteCarloSelected,
  onSelectBasis,
  onSelectTeilzeit,
  onSelectCrash,
  onSelectHardcore,
  onSelectMonteCarlo,
  isExpanded,
  onToggleExpanded,
  inlinePrognose,
}: SteuerViewProps) {
  const { t } = useTranslation();

  const scenarioProps: ScenarioSliderProps = {
    teilzeitDeltaYears,
    crashDeltaMonths,
    hardcoreDeltaYears,
    isBasicSelected,
    isTeilzeitSelected,
    isCrashSelected,
    isHardcoreSelected,
    isMonteCarloSelected,
    onSelectBasis,
    onSelectTeilzeit,
    onSelectCrash,
    onSelectHardcore,
    onSelectMonteCarlo,
  };

  return (
    <div className="screen">
      <div className="screen__content">
        <section className="page-title-section">
          <p className="label-overline">{t('tax.currentStatus')}</p>
        </section>



        {/* ── Section header with toggle ── */}
        <div className="scenario-section-header">
          <p className="label-overline">{t('tax.scenarios')}</p>
          <button
            className="scenario-section-header__toggle"
            onClick={() => onToggleExpanded(!isExpanded)}
          >
            {isExpanded ? t('tax.back') : t('tax.viewAll')}
          </button>
        </div>

        <h1 className="page-heading">{t('tax.panoramaTitle')}</h1>

        {/* ── Slider or List view ── */}
        {isExpanded
          ? <ScenarioList   {...scenarioProps} />
          : <ScenarioSlider {...scenarioProps} />
        }

        {/* ── Inline prognose (always below) ── */}
        {inlinePrognose}
      </div>
    </div>
  );
}
