import type { ChartDataPoint } from '../../types/fire/models/ChartDataPoint';
import { fmtCurrency }         from '../../services/fire/formatters';

interface Props {
  data: ChartDataPoint[];
}

export function BarChart({ data }: Props) {
  if (!data.length) return null;

  const SVG_W     = 320;
  const SVG_H     = 190;
  const BAR_W     = 44;
  const BAR_GAP   = 10;
  const MAX_BAR_H = 115;
  const BASE_Y    = 148;

  const totalBarsW = data.length * BAR_W + (data.length - 1) * BAR_GAP;
  const startX     = (SVG_W - totalBarsW) / 2;
  const maxVal     = Math.max(...data.map(d => d.value), 1);
  const fireIdx    = data.findIndex(d => d.isFIRE);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', overflow: 'visible' }}>
      {data.map((d, i) => {
        const bH   = Math.max(4, (d.value / maxVal) * MAX_BAR_H);
        const x    = startX + i * (BAR_W + BAR_GAP);
        const y    = BASE_Y - bH;
        const dark = fireIdx >= 0 ? i >= fireIdx : false;
        const fill = dark ? 'var(--fire-primary)' : '#C5D5CC';

        return (
          <g key={d.year}>
            {d.isFIRE && (
              <>
                <circle cx={x + BAR_W / 2} cy={y - 10} r={3} fill="var(--fire-accent)" />
                <text x={x + BAR_W / 2} y={y - 17} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--fire-accent)" letterSpacing="0.5" fontFamily="inherit">
                  RENTENBEGINN
                </text>
              </>
            )}
            <rect x={x} y={y} width={BAR_W} height={bH} rx={5} fill={fill}>
              <title>{fmtCurrency(d.value)} €</title>
            </rect>
            <text x={x + BAR_W / 2} y={BASE_Y + 13} textAnchor="middle" fontSize="7.5" fill="var(--fire-text-muted)" fontFamily="inherit">
              {d.label}
            </text>
            {d.sublabel && (
              <text x={x + BAR_W / 2} y={BASE_Y + 23} textAnchor="middle" fontSize="7" fill="var(--fire-text-muted)" fontFamily="inherit">
                {d.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
