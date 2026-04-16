/**
 * Monte Carlo Display Formatters
 * Pure formatting utilities for simulation results
 */

/**
 * Format large values with appropriate unit (Mio. for millions, k for thousands)
 * E.g., 1500000 → "1.50 Mio. €", 1500 → "2k €"
 */
export function fmtM(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) {
    return new Intl.NumberFormat(undefined, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(v) + ' €';
  }
  if (abs >= 1_000) return Math.round(v / 1_000) + 'k €';
  return Math.round(v) + ' €';
}

/**
 * Format currency using device locale.
 * E.g., 1234567 → "€ 1.234.567" (DE) / "€ 1,234,567" (EN)
 */
export function fmtEuro(v: number): string {
  return '€ ' + new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(Math.round(v));
}
