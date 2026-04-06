export function fmtCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value);
}

export function fmtPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',');
}
