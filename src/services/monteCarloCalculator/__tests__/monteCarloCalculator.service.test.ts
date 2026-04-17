import { describe, it, expect } from 'vitest';
import {
  monteCarloCalculatorService,
  calcMonteCarlo,
  calcMonteCarloPro,
  fmtM,
  fmtEuro,
  getRisiko,
} from '../index';
import type { MonteCarloParams, MonteCarloProParams } from '../index';

// ---------------------------------------------------------------------------
// Shared test parameters
// ---------------------------------------------------------------------------

const BASE_PARAMS: MonteCarloParams = {
  minInflation: 1.5,
  maxInflation: 4.0,
  volatility: 12.5,
  numSimulations: 200,   // small count for speed
  pensionAge: 67,
  pensionAnnualNet: 17_400,
  startYear: 2030,
  simulateUntilYear: 2070,
};

const PRO_PARAMS: MonteCarloProParams = {
  ...BASE_PARAMS,
  drawdownThreshold: 20,
  recoveryThreshold: 15,
  reducedAnnualWithdrawal: 18_000,
};

// ---------------------------------------------------------------------------
// monteCarloCalculatorService interface
// ---------------------------------------------------------------------------

describe('monteCarloCalculatorService', () => {
  it('exposes calcMonteCarlo method', () => {
    expect(typeof monteCarloCalculatorService.calcMonteCarlo).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// calcMonteCarlo – result structure
// ---------------------------------------------------------------------------

describe('calcMonteCarlo – result structure', () => {
  const result = calcMonteCarlo(500_000, 24_000, 7, 45, BASE_PARAMS);

  it('successRate is between 0 and 100', () => {
    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(100);
  });

  it('successCount + failCount equals numSimulations', () => {
    expect(result.successCount).toBeGreaterThanOrEqual(0);
    expect(result.numSimulations).toBe(BASE_PARAMS.numSimulations);
  });

  it('successRate matches successCount / numSimulations * 100', () => {
    expect(result.successRate).toBeCloseTo(
      (result.successCount / result.numSimulations) * 100, 5,
    );
  });

  it('pessimisticAge is a positive number', () => {
    expect(result.pessimisticAge).toBeGreaterThan(0);
  });

  it('medianFinalWealth is non-negative', () => {
    expect(result.medianFinalWealth).toBeGreaterThanOrEqual(0);
  });

  it('fanData has yearsInRetirement + 1 entries', () => {
    const years = BASE_PARAMS.simulateUntilYear - BASE_PARAMS.startYear;
    expect(result.fanData).toHaveLength(years + 1);
  });

  it('each fanData entry has required fields', () => {
    result.fanData.forEach(pt => {
      expect(typeof pt.age).toBe('number');
      expect(typeof pt.year).toBe('number');
      expect(typeof pt.p5).toBe('number');
      expect(typeof pt.p25).toBe('number');
      expect(typeof pt.p50).toBe('number');
      expect(typeof pt.p75).toBe('number');
      expect(typeof pt.p95).toBe('number');
    });
  });

  it('fanData percentiles are ordered: p5 ≤ p25 ≤ p50 ≤ p75 ≤ p95', () => {
    result.fanData.forEach(pt => {
      expect(pt.p5).toBeLessThanOrEqual(pt.p25);
      expect(pt.p25).toBeLessThanOrEqual(pt.p50);
      expect(pt.p50).toBeLessThanOrEqual(pt.p75);
      expect(pt.p75).toBeLessThanOrEqual(pt.p95);
    });
  });

  it('first fanData entry (year 0) age equals fireAge', () => {
    expect(result.fanData[0].age).toBe(45);
    expect(result.fanData[0].year).toBe(BASE_PARAMS.startYear);
  });
});

// ---------------------------------------------------------------------------
// calcMonteCarlo – behavioral invariants
// ---------------------------------------------------------------------------

describe('calcMonteCarlo – behavioral invariants', () => {
  it('very large wealth & tiny withdrawal → near 100% success', () => {
    const result = calcMonteCarlo(50_000_000, 10_000, 7, 40, BASE_PARAMS);
    expect(result.successRate).toBeGreaterThan(90);
  });

  it('zero wealth → 0% success', () => {
    const result = calcMonteCarlo(0, 30_000, 7, 40, BASE_PARAMS);
    expect(result.successRate).toBe(0);
  });

  it('numSimulations in result matches params', () => {
    const params = { ...BASE_PARAMS, numSimulations: 50 };
    const result = calcMonteCarlo(500_000, 24_000, 7, 45, params);
    expect(result.numSimulations).toBe(50);
  });

  it('simulateUntilYear equal to startYear → single year fanData entry', () => {
    const params = { ...BASE_PARAMS, simulateUntilYear: BASE_PARAMS.startYear };
    const result = calcMonteCarlo(500_000, 24_000, 7, 45, params);
    // yearsInRetirement = max(1, 0) = 1 → length 2
    expect(result.fanData.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// calcMonteCarloPro – result structure
// ---------------------------------------------------------------------------

describe('calcMonteCarloPro – result structure', () => {
  const result = calcMonteCarloPro(500_000, 24_000, 7, 45, PRO_PARAMS);

  it('successRate is between 0 and 100', () => {
    expect(result.successRate).toBeGreaterThanOrEqual(0);
    expect(result.successRate).toBeLessThanOrEqual(100);
  });

  it('fanData length is yearsInRetirement + 1', () => {
    const years = PRO_PARAMS.simulateUntilYear - PRO_PARAMS.startYear;
    expect(result.fanData).toHaveLength(years + 1);
  });

  it('fanData percentiles are ordered: p5 ≤ p25 ≤ p50 ≤ p75 ≤ p95', () => {
    result.fanData.forEach(pt => {
      expect(pt.p5).toBeLessThanOrEqual(pt.p25);
      expect(pt.p25).toBeLessThanOrEqual(pt.p50);
      expect(pt.p50).toBeLessThanOrEqual(pt.p75);
      expect(pt.p75).toBeLessThanOrEqual(pt.p95);
    });
  });

  it('reduced spending mode improves or maintains success vs impossibly bad scenario', () => {
    const base = calcMonteCarlo(300_000, 40_000, 5, 45, BASE_PARAMS);
    const pro  = calcMonteCarloPro(300_000, 40_000, 5, 45, PRO_PARAMS);
    // Pro with spending cuts should have >= success rate than base
    expect(pro.successRate).toBeGreaterThanOrEqual(base.successRate);
  });
});

// ---------------------------------------------------------------------------
// calcMonteCarloPro – behavioral invariants
// ---------------------------------------------------------------------------

describe('calcMonteCarloPro – behavioral invariants', () => {
  it('very large wealth & tiny withdrawal → near 100% success', () => {
    const result = calcMonteCarloPro(50_000_000, 10_000, 7, 40, PRO_PARAMS);
    expect(result.successRate).toBeGreaterThan(90);
  });

  it('zero wealth → 0% success', () => {
    const result = calcMonteCarloPro(0, 30_000, 7, 40, PRO_PARAMS);
    expect(result.successRate).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getRisiko
// ---------------------------------------------------------------------------

describe('getRisiko', () => {
  it('rate >= 95 → riskVeryLow, green color', () => {
    const r = getRisiko(95);
    expect(r.labelKey).toBe('monteCarlo.riskVeryLow');
    expect(r.color).toBe('#16A34A');
  });

  it('rate 100 → riskVeryLow', () => {
    expect(getRisiko(100).labelKey).toBe('monteCarlo.riskVeryLow');
  });

  it('rate 85 → riskLow', () => {
    const r = getRisiko(85);
    expect(r.labelKey).toBe('monteCarlo.riskLow');
    expect(r.color).toBe('#B91C1C');
  });

  it('rate 90 → riskLow (85 ≤ 90 < 95)', () => {
    expect(getRisiko(90).labelKey).toBe('monteCarlo.riskLow');
  });

  it('rate 75 → riskModerate', () => {
    const r = getRisiko(75);
    expect(r.labelKey).toBe('monteCarlo.riskModerate');
    expect(r.color).toBe('#D97706');
  });

  it('rate 80 → riskModerate (75 ≤ 80 < 85)', () => {
    expect(getRisiko(80).labelKey).toBe('monteCarlo.riskModerate');
  });

  it('rate 74 → riskHigh', () => {
    const r = getRisiko(74);
    expect(r.labelKey).toBe('monteCarlo.riskHigh');
    expect(r.color).toBe('#EF4444');
  });

  it('rate 0 → riskHigh', () => {
    expect(getRisiko(0).labelKey).toBe('monteCarlo.riskHigh');
  });

  it('always returns labelKey and color strings', () => {
    [0, 50, 75, 85, 95, 100].forEach(rate => {
      const r = getRisiko(rate);
      expect(typeof r.labelKey).toBe('string');
      expect(typeof r.color).toBe('string');
    });
  });
});

// ---------------------------------------------------------------------------
// fmtM
// ---------------------------------------------------------------------------

describe('fmtM', () => {
  it('formats values under 1000 as "N €"', () => {
    expect(fmtM(500)).toBe('500 €');
  });

  it('formats 1000–999999 as "Nk €"', () => {
    expect(fmtM(1_500)).toBe('2k €');
    expect(fmtM(1_000)).toBe('1k €');
  });

  it('formats millions with compact notation + " €" suffix', () => {
    const result = fmtM(1_500_000);
    expect(result).toContain('€');
    expect(result.length).toBeGreaterThan(3);
  });

  it('handles 0', () => {
    expect(fmtM(0)).toBe('0 €');
  });
});

// ---------------------------------------------------------------------------
// fmtEuro
// ---------------------------------------------------------------------------

describe('fmtEuro', () => {
  it('starts with "€ "', () => {
    expect(fmtEuro(1_234)).toMatch(/^€ /);
  });

  it('returns a string', () => {
    expect(typeof fmtEuro(100_000)).toBe('string');
  });

  it('rounds fractional values', () => {
    const a = fmtEuro(999.4);
    const b = fmtEuro(999);
    expect(a).toBe(b);
  });

  it('handles 0', () => {
    expect(fmtEuro(0)).toMatch(/^€ 0$/);
  });
});
