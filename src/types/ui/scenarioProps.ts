import type { ScenarioResultBadgeVariant } from './variants';

export interface ScenarioSliderProps {
  teilzeitDeltaYears:      number;
  crashDeltaMonths:        number;
  hardcoreDeltaYears:      number;
  isBasicSelected:         boolean;
  isTeilzeitSelected:      boolean;
  isCrashSelected:         boolean;
  isHardcoreSelected:      boolean;
  isMonteCarloSelected:    boolean;
  isMonteCarloProSelected: boolean;
  onSelectBasis:           () => void;
  onSelectTeilzeit:        () => void;
  onSelectCrash:           () => void;
  onSelectHardcore:        () => void;
  onSelectMonteCarlo:      () => void;
  onSelectMonteCarloPro:   () => void;
}

export interface ScenarioListItemProps {
  title:              string;
  subtitle:           string;
  resultBadge:        string;
  resultBadgeVariant: ScenarioResultBadgeVariant;
  typeBadge:          string;
  isActive:           boolean;
  actionLabel:        string;
  selected:           boolean;
  onClick:            () => void;
}
