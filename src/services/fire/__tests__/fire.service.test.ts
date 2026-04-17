import { describe, it, expect } from 'vitest';
import { fireService, fmtCurrency, fmtPercent, fmtK, FIRE_CONSTANTS } from '../index';
import type { FireState } from '../../../types/fire/models/FireState';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makeState(overrides: Partial<FireState> = {}): FireState {
  return {
    ...fireService.getDefaultState(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// FIRE_CONSTANTS
// ---------------------------------------------------------------------------

describe('FIRE_CONSTANTS', () => {
  it('exposes expected constant keys', () => {
    expect(FIRE_CONSTANTS.GKV_RATE).toBe(0.21);
    expect(FIRE_CONSTANTS.SWR_RATE).toBe(0.04);
    expect(FIRE_CONSTANTS.ANNUAL_RETURN).toBe(0.07);
    expect(FIRE_CONSTANTS.GKV_MAX_MONTHLY).toBe(1300);
  });
});

// ---------------------------------------------------------------------------
// getDefaultState
// ---------------------------------------------------------------------------

describe('fireService.getDefaultState', () => {
  it('returns a copy with expected default values', () => {
    const s = fireService.getDefaultState();
    expect(s.etfBalance).toBe(125_000);
    expect(s.cashBalance).toBe(15_000);
    expect(s.monthlySavingsAmount).toBe(950);
    expect(s.isPkvUser).toBe(false);
    expect(s.assetTaxRate).toBe(26.375);
  });

  it('returns a fresh copy each call (no shared reference)', () => {
    const a = fireService.getDefaultState();
    const b = fireService.getDefaultState();
    a.etfBalance = 999;
    expect(b.etfBalance).toBe(125_000);
  });
});

// ---------------------------------------------------------------------------
// calcNetWorth
// ---------------------------------------------------------------------------

describe('fireService.calcNetWorth', () => {
  it('sums etfBalance and cashBalance', () => {
    expect(fireService.calcNetWorth(makeState({ etfBalance: 100_000, cashBalance: 20_000 }))).toBe(120_000);
  });

  it('returns etfBalance when cashBalance is 0', () => {
    expect(fireService.calcNetWorth(makeState({ etfBalance: 50_000, cashBalance: 0 }))).toBe(50_000);
  });

  it('handles both balances being 0', () => {
    expect(fireService.calcNetWorth(makeState({ etfBalance: 0, cashBalance: 0 }))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcGrossSWR
// ---------------------------------------------------------------------------

describe('fireService.calcGrossSWR', () => {
  it('calculates gross monthly SWR correctly', () => {
    // (120000 * 0.04 + 24000 * 0.02) / 12 = (4800 + 480) / 12 = 440
    const result = fireService.calcGrossSWR(
      makeState({ etfBalance: 120_000, etfWithdrawalRate: 4, cashBalance: 24_000, cashRate: 2 }),
    );
    expect(result).toBeCloseTo(440, 5);
  });

  it('returns 0 when both balances are 0', () => {
    expect(fireService.calcGrossSWR(makeState({ etfBalance: 0, cashBalance: 0 }))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcAbgabenQuote
// ---------------------------------------------------------------------------

describe('fireService.calcAbgabenQuote', () => {
  it('returns 0 when grossMonthly is 0', () => {
    expect(fireService.calcAbgabenQuote(makeState(), 0)).toBe(0);
  });

  it('returns 0 when grossMonthly is negative', () => {
    expect(fireService.calcAbgabenQuote(makeState(), -100)).toBe(0);
  });

  it('GKV: uses GKV_RATE + assetTaxRate', () => {
    const state = makeState({ isPkvUser: false, assetTaxRate: 26.375 });
    const gross = 1_000;
    // kvCost = 1000 * 0.21 = 210; taxCost = 1000 * 0.26375 = 263.75 → 47.375 %
    expect(fireService.calcAbgabenQuote(state, gross)).toBeCloseTo(47.375, 4);
  });

  it('PKV: uses fixed pkvContribution instead of GKV_RATE', () => {
    const state = makeState({ isPkvUser: true, pkvContribution: 500, assetTaxRate: 26.375 });
    const gross = 2_000;
    // kvCost = 500; taxCost = 2000 * 0.26375 = 527.5 → (1027.5 / 2000) * 100 = 51.375 %
    expect(fireService.calcAbgabenQuote(state, gross)).toBeCloseTo(51.375, 4);
  });
});

// ---------------------------------------------------------------------------
// calcNetSWR
// ---------------------------------------------------------------------------

describe('fireService.calcNetSWR', () => {
  it('returns gross × (1 - quote/100)', () => {
    const state = makeState({ isPkvUser: false, assetTaxRate: 26.375 });
    const gross = 1_000;
    // quote ≈ 47.375 → net ≈ 526.25
    expect(fireService.calcNetSWR(state, gross)).toBeCloseTo(526.25, 1);
  });

  it('returns 0 when grossSWR is 0', () => {
    expect(fireService.calcNetSWR(makeState(), 0)).toBe(0);
  });

  it('net is always less than or equal to gross', () => {
    const state = makeState();
    const gross = 2_000;
    expect(fireService.calcNetSWR(state, gross)).toBeLessThanOrEqual(gross);
  });
});

// ---------------------------------------------------------------------------
// calcFireTarget
// ---------------------------------------------------------------------------

describe('fireService.calcFireTarget', () => {
  it('GKV without weightedReturn: (baseExpenses*12) / effectiveSWR', () => {
    const state = makeState({
      isPkvUser: false,
      fixedExpenses: 1_500,
      variableExpenses: 800,
      etfWithdrawalRate: 4,
      assetTaxRate: 26.375,
    });
    // effectiveSWR = 0.04 * (1 - 0.26375) = 0.04 * 0.73625 ≈ 0.02945
    // target = 2300 * 12 / 0.02945 ≈ 937 182
    const target = fireService.calcFireTarget(state);
    expect(target).toBeGreaterThan(900_000);
    expect(target).toBeLessThan(1_000_000);
  });

  it('PKV: includes pkvContribution in numerator', () => {
    const state = makeState({
      isPkvUser: true,
      pkvContribution: 500,
      fixedExpenses: 1_500,
      variableExpenses: 800,
      etfWithdrawalRate: 4,
      assetTaxRate: 26.375,
    });
    const target = fireService.calcFireTarget(state);
    // (2300 + 500) * 12 / 0.02945 ≈ 1 140 915
    expect(target).toBeGreaterThan(1_000_000);
  });

  it('returns a positive number', () => {
    expect(fireService.calcFireTarget(makeState())).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// calcFirePercentage
// ---------------------------------------------------------------------------

describe('fireService.calcFirePercentage', () => {
  it('returns 0 when fireTarget is 0', () => {
    expect(fireService.calcFirePercentage(100_000, 0)).toBe(0);
  });

  it('returns 0 when netWorth is 0', () => {
    expect(fireService.calcFirePercentage(0, 100_000)).toBe(0);
  });

  it('calculates percentage correctly', () => {
    expect(fireService.calcFirePercentage(80_000, 100_000)).toBeCloseTo(80, 5);
  });

  it('caps at 100 when netWorth exceeds fireTarget', () => {
    expect(fireService.calcFirePercentage(150_000, 100_000)).toBe(100);
  });

  it('returns 100 when exactly at target', () => {
    expect(fireService.calcFirePercentage(100_000, 100_000)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// calcMonthlySavings
// ---------------------------------------------------------------------------

describe('fireService.calcMonthlySavings', () => {
  it('returns monthlySavingsAmount from state', () => {
    expect(fireService.calcMonthlySavings(makeState({ monthlySavingsAmount: 1_200 }))).toBe(1_200);
  });

  it('returns 0 when savings is 0', () => {
    expect(fireService.calcMonthlySavings(makeState({ monthlySavingsAmount: 0 }))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcWeightedReturn
// ---------------------------------------------------------------------------

describe('fireService.calcWeightedReturn', () => {
  it('returns ANNUAL_RETURN default when total balance is 0', () => {
    const result = fireService.calcWeightedReturn(makeState({ etfBalance: 0, cashBalance: 0 }));
    expect(result).toBe(FIRE_CONSTANTS.ANNUAL_RETURN);
  });

  it('returns ETF rate when cashBalance is 0', () => {
    // 100000 * 7% / 100000 = 0.07
    const result = fireService.calcWeightedReturn(makeState({ etfBalance: 100_000, etfRate: 7, cashBalance: 0 }));
    expect(result).toBeCloseTo(0.07, 5);
  });

  it('calculates weighted average of ETF and cash rates', () => {
    // (100000*0.07 + 100000*0.02) / 200000 = 0.045
    const result = fireService.calcWeightedReturn(
      makeState({ etfBalance: 100_000, etfRate: 7, cashBalance: 100_000, cashRate: 2 }),
    );
    expect(result).toBeCloseTo(0.045, 5);
  });
});

// ---------------------------------------------------------------------------
// calcAssetIncome
// ---------------------------------------------------------------------------

describe('fireService.calcAssetIncome', () => {
  it('returns portfolioValue × weightedReturn', () => {
    expect(fireService.calcAssetIncome(100_000, 0.07)).toBeCloseTo(7_000, 2);
  });

  it('returns 0 when portfolioValue is 0', () => {
    expect(fireService.calcAssetIncome(0, 0.07)).toBe(0);
  });

  it('returns 0 when weightedReturn is 0', () => {
    expect(fireService.calcAssetIncome(100_000, 0)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calcFIREDate
// ---------------------------------------------------------------------------

describe('fireService.calcFIREDate', () => {
  it('returns an object with year (number) and month (string)', () => {
    const result = fireService.calcFIREDate(10_000, 0, 7, 2, 1_000, 100_000);
    expect(typeof result.year).toBe('number');
    expect(typeof result.month).toBe('string');
    expect(result.month.length).toBeGreaterThan(0);
  });

  it('returns near-current year when already at target', () => {
    const currentYear = new Date().getFullYear();
    const result = fireService.calcFIREDate(1_000_000, 50_000, 7, 2, 1_000, 100_000);
    expect(result.year).toBe(currentYear);
  });

  it('returns a future year when savings are needed', () => {
    const currentYear = new Date().getFullYear();
    const result = fireService.calcFIREDate(0, 0, 7, 2, 1_000, 500_000);
    expect(result.year).toBeGreaterThan(currentYear);
  });

  it('applies savingsGrowthRate and still returns valid structure', () => {
    const result = fireService.calcFIREDate(50_000, 10_000, 7, 2, 1_000, 300_000, 3);
    expect(typeof result.year).toBe('number');
    expect(typeof result.month).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// calcProjectedWealth
// ---------------------------------------------------------------------------

describe('fireService.calcProjectedWealth', () => {
  const currentYear = new Date().getFullYear();
  const targetYears = [currentYear, currentYear + 5, currentYear + 10, currentYear + 20];
  const portfolio = {
    etfBalance: 100_000,
    cashBalance: 20_000,
    monthlySavings: 1_000,
    monthlyWithdraw: 2_000,
    assetTaxRate: 26.375,
  };
  const rates = { etfRate: 7, cashRate: 2, savingsGrowthRate: 2, inflationRate: 2 };

  it('returns one data point per targetYear', () => {
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 10, targetYears);
    expect(data).toHaveLength(targetYears.length);
  });

  it('each point has required ChartDataPoint fields', () => {
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 10, targetYears);
    data.forEach(pt => {
      expect(typeof pt.year).toBe('number');
      expect(typeof pt.value).toBe('number');
      expect(typeof pt.etfValue).toBe('number');
      expect(typeof pt.cashValue).toBe('number');
      expect(typeof pt.label).toBe('string');
      expect(typeof pt.isFIRE).toBe('boolean');
    });
  });

  it('marks fireYear point with isFIRE = true', () => {
    const fireYear = currentYear + 10;
    const data = fireService.calcProjectedWealth(portfolio, rates, fireYear, targetYears);
    const firePoint = data.find(p => p.year === fireYear);
    expect(firePoint?.isFIRE).toBe(true);
  });

  it('non-FIRE years have isFIRE = false', () => {
    const fireYear = currentYear + 10;
    const data = fireService.calcProjectedWealth(portfolio, rates, fireYear, targetYears);
    data.filter(p => p.year !== fireYear).forEach(p => expect(p.isFIRE).toBe(false));
  });

  it('value equals etfValue + cashValue', () => {
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 10, targetYears);
    data.forEach(pt => expect(pt.value).toBeCloseTo(pt.etfValue + pt.cashValue, 2));
  });

  it('today point has label "TODAY"', () => {
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 10, targetYears, undefined, {
      today: 'TODAY',
    });
    const todayPt = data.find(p => p.year === currentYear);
    expect(todayPt?.label).toBe('TODAY');
  });

  it('wealth grows during accumulation phase', () => {
    const accYears = [currentYear, currentYear + 5];
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 20, accYears);
    expect(data[1].value).toBeGreaterThan(data[0].value);
  });

  it('returns empty array for empty targetYears', () => {
    const data = fireService.calcProjectedWealth(portfolio, rates, currentYear + 10, []);
    expect(data).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Formatter: fmtCurrency
// ---------------------------------------------------------------------------

describe('fmtCurrency', () => {
  it('formats a number as string without decimals', () => {
    const result = fmtCurrency(1234);
    expect(typeof result).toBe('string');
    expect(result).not.toContain('.');
    expect(result).not.toContain(',0');
  });

  it('rounds down fractional values', () => {
    const result = fmtCurrency(1234.4);
    expect(result).not.toContain('.');
  });
});

// ---------------------------------------------------------------------------
// Formatter: fmtPercent
// ---------------------------------------------------------------------------

describe('fmtPercent', () => {
  it('returns string representation of value', () => {
    const result = fmtPercent(7.5);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('respects custom decimals parameter', () => {
    const result2 = fmtPercent(7.555, 2);
    expect(typeof result2).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Formatter: fmtK
// ---------------------------------------------------------------------------

describe('fmtK', () => {
  it('formats values under 1000 as "€N"', () => {
    expect(fmtK(500)).toBe('€500');
  });

  it('formats values 1000+ as "€Nk"', () => {
    expect(fmtK(1_500)).toBe('€2k');
    expect(fmtK(1_000)).toBe('€1k');
    expect(fmtK(999_000)).toBe('€999k');
  });

  it('formats millions with compact notation', () => {
    const result = fmtK(1_500_000);
    expect(result.startsWith('€')).toBe(true);
    expect(result.length).toBeGreaterThan(1);
  });

  it('handles 0', () => {
    expect(fmtK(0)).toBe('€0');
  });
});
