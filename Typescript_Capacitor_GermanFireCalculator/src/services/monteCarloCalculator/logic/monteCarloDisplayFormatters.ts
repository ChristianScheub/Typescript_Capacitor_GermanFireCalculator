/**
 * Monte Carlo Display Formatters
 * Pure formatting utilities for simulation results
 */

/**
 * Format large values with appropriate unit (Mio. for millions, k for thousands)
 * E.g., 1500000 → "1.50 Mio. €", 1500 → "2k €"
 */
export function fmtM(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2).replace('.', ',') + ' Mio. €';
  if (v >= 1_000) return Math.round(v / 1_000) + 'k €';
  return Math.round(v) + ' €';
}

/**
 * Format currency with German locale
 * E.g., 1234567 → "€ 1.234.567"
 */
export function fmtEuro(v: number): string {
  return '€ ' + Math.round(v).toLocaleString('de-DE');
}
