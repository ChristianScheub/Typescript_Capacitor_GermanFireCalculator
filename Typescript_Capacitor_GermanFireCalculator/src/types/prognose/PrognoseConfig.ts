import type { FireState } from '../fire/models/FireState';

export interface PrognoseConfig {
  /** Screen title, e.g. "Prognose" or "Teilzeit-Turbo (80%)" */
  title:          string;
  /** Small badge shown next to the title, e.g. "BASIS", "TEILZEIT", "CRASH" */
  badge?:         string;
  /** Partial FireState overrides – merged on top of the live context state */
  stateOverride?: Partial<FireState>;
}
