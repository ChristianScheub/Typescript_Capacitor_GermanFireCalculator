import type { FireState } from '../fire/models/FireState';

export interface PrognoseConfig {
  /** Small badge shown next to the title, e.g. "BASIS", "TEILZEIT", "CRASH" */
  badge?:         string;
  /** Partial FireState overrides – merged on top of the live context state */
  stateOverride?: Partial<FireState>;
}
