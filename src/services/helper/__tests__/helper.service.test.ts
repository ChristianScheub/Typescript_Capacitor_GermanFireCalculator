import { describe, it, expect } from 'vitest';
import { HelperService } from '../index';

describe('HelperService.roundToTwoDecimals', () => {
  it('rounds up at third decimal ≥ 5', () => {
    expect(HelperService.roundToTwoDecimals(1.235)).toBeCloseTo(1.24, 10);
  });

  it('rounds down at third decimal < 5', () => {
    expect(HelperService.roundToTwoDecimals(1.234)).toBeCloseTo(1.23, 10);
  });

  it('returns integer values unchanged', () => {
    expect(HelperService.roundToTwoDecimals(5)).toBe(5);
  });

  it('handles 0', () => {
    expect(HelperService.roundToTwoDecimals(0)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(HelperService.roundToTwoDecimals(-1.235)).toBeCloseTo(-1.24, 10);
  });

  it('handles values already at two decimals', () => {
    expect(HelperService.roundToTwoDecimals(3.14)).toBeCloseTo(3.14, 10);
  });

  it('handles large numbers', () => {
    expect(HelperService.roundToTwoDecimals(123456.789)).toBeCloseTo(123456.79, 5);
  });

  it('returns a number type', () => {
    expect(typeof HelperService.roundToTwoDecimals(1.1)).toBe('number');
  });
});
