import type { ScenarioResultBadgeVariant } from './variants';

export interface ScenarioSliderProps {
  teilzeitDeltaYears:   number;
  crashDeltaMonths:     number;
  hardcoreDeltaYears:   number;
  isBasicSelected:      boolean;
  isTeilzeitSelected:   boolean;
  isCrashSelected:      boolean;
  isHardcoreSelected:   boolean;
  isMonteCarloSelected: boolean;
  onSelectBasis:        () => void;
  onSelectTeilzeit:     () => void;
  onSelectCrash:        () => void;
  onSelectHardcore:     () => void;
  onSelectMonteCarlo:   () => void;
}

export interface ScenarioListItemProps {
  title:              string;
  subtitle:           string;
  resultBadge:        string;
  resultBadgeVariant: ScenarioResultBadgeVariant;
  typeBadge:          string;
  statusLabel:        'AKTIV' | 'INAKTIV';
  actionLabel:        string;
  selected:           boolean;
  onClick:            () => void;
}
