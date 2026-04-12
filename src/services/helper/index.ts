import { roundToTwoDecimals } from './logic/roundNumber';
import type { IHelperService } from './IHelperService';

/**
 * Helper Service implementation.
 */
export const HelperService: IHelperService = {
  roundToTwoDecimals,
};