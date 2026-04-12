import type { IWelcomeService } from './IWelcomeService';
import { isWelcomeAccepted, acceptWelcome } from './logic/welcomeLogic';

export const welcomeService: IWelcomeService = {
  isAccepted: isWelcomeAccepted,
  accept:     acceptWelcome,
};
