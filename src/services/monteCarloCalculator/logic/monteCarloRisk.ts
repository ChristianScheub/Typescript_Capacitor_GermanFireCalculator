/**
 * Monte Carlo Risk Assessment
 * Maps success rate to risk classification
 */

/**
 * Get risk label and color based on success rate percentage
 * E.g., 95% → { label: 'Sehr gering', color: '#16A34A' }
 */
export function getRisiko(rate: number): { labelKey: string; color: string } {
  if (rate >= 95) return { labelKey: 'monteCarlo.riskVeryLow', color: '#16A34A' };
  if (rate >= 85) return { labelKey: 'monteCarlo.riskLow',     color: '#B91C1C' };
  if (rate >= 75) return { labelKey: 'monteCarlo.riskModerate', color: '#D97706' };
  return { labelKey: 'monteCarlo.riskHigh', color: '#EF4444' };
}
