import './BarChart.css';
import type { ChartDataPoint } from '../../types/fire/models/ChartDataPoint';
import type { BarChartMode }   from '../../types/navigation/BarChartMode';

interface Props {
  data: ChartDataPoint[];
  mode?: BarChartMode;
}

const SVG_W     = 320;
const SVG_H     = 210;   // extra height for value label row
const BAR_W     = 44;
const BAR_GAP   = 10;
const MAX_BAR_H = 110;
const BASE_Y    = 145;

// Compact DE number: >=1M → "1,3 Mio." | >=1k → "150 T" | else plain
function fmtCompact(v: number): string {
  const MIO_SUFFIX  = ' Mio.';
  const TAUSEND_SUF = ' T';
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + MIO_SUFFIX;
  if (v >= 1_000)     return Math.round(v / 1_000) + TAUSEND_SUF;
  return String(Math.round(v));
}

export function BarChart({ data, mode = 'cumulative' }: Props) {
  if (!data.length) return null;

  // In yearly mode: show the period-over-period delta between chart points
  const displayData = mode === 'yearly'
    ? data.map((d, i) => ({
        ...d,
        value: i === 0 ? d.value : Math.max(0, d.value - data[i - 1].value),
      }))
    : data;

  const totalBarsW = displayData.length * BAR_W + (displayData.length - 1) * BAR_GAP;
  const startX     = (SVG_W - totalBarsW) / 2;
  const maxVal     = Math.max(...displayData.map(d => d.value), 1);
  const fireIdx    = displayData.findIndex(d => d.isFIRE);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="barchart">
      {displayData.map((d, i) => {
        const bH   = Math.max(4, (d.value / maxVal) * MAX_BAR_H);
        const x    = startX + i * (BAR_W + BAR_GAP);
        const y    = BASE_Y - bH;
        const dark = fireIdx >= 0 ? i >= fireIdx : false;

        // vertical position of the bottom label group
        const yearY    = BASE_Y + 14;
        const subY     = BASE_Y + 24;
        const valueY   = d.sublabel ? BASE_Y + 35 : BASE_Y + 25;

        return (
          <g key={d.year}>
            {/* RENTENBEGINN marker above FIRE bar */}
            {d.isFIRE && (
              <>
                <circle cx={x + BAR_W / 2} cy={y - 10} r={3} className="bar-dot" />
                <text
                  x={x + BAR_W / 2} y={y - 17}
                  textAnchor="middle" fontSize="6.5" fontWeight="700"
                  letterSpacing="0.5" fontFamily="inherit"
                  className="bar-fire-label"
                >
                  RENTENBEGINN
                </text>
              </>
            )}

            {/* Bar */}
            <rect x={x} y={y} width={BAR_W} height={bH} rx={5}
              className={dark ? 'bar--post-fire' : 'bar--pre-fire'} />

            {/* Year label */}
            <text x={x + BAR_W / 2} y={yearY}
              textAnchor="middle" fontSize="7.5" fontFamily="inherit"
              className="bar-x-label">
              {d.label}
            </text>

            {/* Optional sub-label (FIRE / RENTE) */}
            {d.sublabel && (
              <text x={x + BAR_W / 2} y={subY}
                textAnchor="middle" fontSize="7" fontFamily="inherit"
                className="bar-x-label">
                {d.sublabel}
              </text>
            )}

            {/* Wealth value */}
            <text x={x + BAR_W / 2} y={valueY}
              textAnchor="middle" fontSize="7" fontFamily="inherit"
              className="bar-value-label">
              {fmtCompact(d.value)} €
            </text>
          </g>
        );
      })}
    </svg>
  );
}
