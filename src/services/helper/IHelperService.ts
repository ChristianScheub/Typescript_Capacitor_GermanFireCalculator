/**
 * Interface for the Helper Service.
 */
export interface IHelperService {
  /**
   * Rounds a number to two decimal places.
   * @param value - The number to round.
   * @returns The rounded number.
   */
  roundToTwoDecimals(value: number): number;
}