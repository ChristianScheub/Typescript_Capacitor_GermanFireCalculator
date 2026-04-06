interface Props {
  percentage: number;
}

export function ProgressRing({ percentage }: Props) {
  const r  = 82;
  const cx = 100;
  const cy = 100;
  const sw = 13;

  const startX = cx - r;
  const startY = cy;

  const bgPath = `M ${startX},${startY} A ${r},${r} 0 0,0 ${cx + r},${startY}`;

  const pct   = Math.min(99.9, Math.max(0.1, percentage));
  const angle = Math.PI - (pct / 100) * Math.PI;
  const px    = cx + r * Math.cos(angle);
  const py    = cy - r * Math.sin(angle);
  const progressPath = `M ${startX},${startY} A ${r},${r} 0 0,0 ${px.toFixed(2)},${py.toFixed(2)}`;

  return (
    <svg viewBox="0 10 200 100" style={{ width: '100%', maxWidth: 240 }}>
      <path d={bgPath}       fill="none" stroke="var(--fire-border)"   strokeWidth={sw} strokeLinecap="round" />
      {percentage > 0 && (
        <path d={progressPath} fill="none" stroke="var(--fire-primary)" strokeWidth={sw} strokeLinecap="round" />
      )}
      <text x={cx} y={cy - 4}  textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--fire-text)"      fontFamily="inherit">
        {Math.round(percentage)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8"  fill="var(--fire-text-muted)" letterSpacing="1.2" fontFamily="inherit">
        FORTSCHRITT
      </text>
    </svg>
  );
}
