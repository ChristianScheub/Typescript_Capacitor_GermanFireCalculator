import { fmtCurrency } from '../../services/fire';
import { fmtM } from '../../services/monteCarloCalculator';

/**
 * Custom hook that provides all formatting functions in one place.
 * Centralizes formatter usage across the application.
 */
export function useFormatter() {
  return {
    /**
     * Format currency values (€ symbol, 2 decimals)
     * Example: 1234.56 → "€1,234.56"
     */
    currency: fmtCurrency,

    /**
     * Format Monte Carlo results (M suffix)
     * Example: 1000000 → "€1M"
     */
    monteCarloFormat: fmtM,
  };
}
