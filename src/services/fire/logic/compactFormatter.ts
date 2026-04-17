export function fmtK(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) {
    return '€' + new Intl.NumberFormat(undefined, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(v);
  }
  if (abs >= 1_000) return '€' + Math.round(v / 1_000) + 'k';
  return '€' + Math.round(v);
}
