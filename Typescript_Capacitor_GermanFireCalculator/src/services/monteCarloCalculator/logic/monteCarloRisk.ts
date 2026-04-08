/**
 * Monte Carlo Risk Assessment
 * Maps success rate to risk classification
 */

/**
 * Get risk label and color based on success rate percentage
 * E.g., 95% → { label: 'Sehr gering', color: '#16A34A' }
 */
export function getRisiko(rate: number): { label: string; color: string } {
  if (rate >= 95) return { label: 'Sehr gering', color: '#16A34A' };
  if (rate >= 85) return { label: 'Gering', color: '#B91C1C' };
  if (rate >= 75) return { label: 'Moderat', color: '#D97706' };
  return { label: 'Hoch', color: '#EF4444' };
}
