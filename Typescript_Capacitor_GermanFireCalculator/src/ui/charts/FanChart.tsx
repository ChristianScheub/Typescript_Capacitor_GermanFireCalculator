import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fmtM } from '../../services/monteCarloCalculator';
import type { FanDataPoint } from '../../services/monteCarloCalculator';

interface FanChartProps {
  fanData: FanDataPoint[];
  landscape?: boolean;
}

export function FanChart({ fanData, landscape = false }: FanChartProps) {
  const { t } = useTranslation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (fanData.length < 2) return null;

  const W = landscape ? 580 : 320;
  const H = landscape ? 280 : 200;
  const PAD_L = landscape ? 10 : 6;
  const PAD_R = landscape ? 10 : 6;
  const PAD_T = landscape ? 16 : 10;
  const PAD_B = landscape ? 44 : 36;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const maxVal = Math.max(...fanData.map(d => d.p95), 1);
  const n = fanData.length;

  const xOf = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const yOf = (v: number) => PAD_T + chartH - Math.min(1, v / maxVal) * chartH;

  // Band polygons
  const top95 = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p95).toFixed(1)}`);
  const bot95 = [...fanData].reverse().map((d, i) => `${xOf(n - 1 - i).toFixed(1)},${yOf(d.p5).toFixed(1)}`);
  const poly95 = [...top95, ...bot95].join(' ');

  const top50 = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p75).toFixed(1)}`);
  const bot50 = [...fanData].reverse().map((d, i) => `${xOf(n - 1 - i).toFixed(1)},${yOf(d.p25).toFixed(1)}`);
  const poly50 = [...top50, ...bot50].join(' ');

  const medianPts = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p50).toFixed(1)}`).join(' ');

  // Axis labels
  const step = landscape ? 10 : 15;
  const labelAges = new Set<number>();
  labelAges.add(fanData[0].age);
  for (let a = fanData[0].age + step; a < 100; a += step) labelAges.add(a);
  labelAges.add(100);
  const axisItems = fanData.filter(d => labelAges.has(d.age));

  // Pointer interaction
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const relX = (svgPt.x - PAD_L) / chartW;
    const idx = Math.round(Math.max(0, Math.min(1, relX)) * (n - 1));
    setHoveredIdx(idx);
  };
  const handlePointerLeave = () => setHoveredIdx(null);

  const hovered = hoveredIdx !== null ? fanData[hoveredIdx] : null;
  const hx = hoveredIdx !== null ? xOf(hoveredIdx) : null;
  const isRight = hoveredIdx !== null && hoveredIdx > n * 0.55;

  // Tooltip dimensions (in viewBox units)
  const TW = landscape ? 148 : 128;
  const TH = landscape ? 86 : 78;
  const FS = landscape ? 1.1 : 1; // font scale multiplier

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mc-fan-chart"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      {/* Confidence bands */}
      <polygon points={poly95} className="mc-fan-band--95" />
      <polygon points={poly50} className="mc-fan-band--50" />
      {/* Median line */}
      <polyline points={medianPts} className="mc-fan-median" fill="none" />
      {/* Baseline */}
      <line
        x1={PAD_L}
        y1={PAD_T + chartH}
        x2={W - PAD_R}
        y2={PAD_T + chartH}
        className="mc-fan-axis"
      />

      {/* Axis labels */}
      {axisItems.map(d => {
        const idx = fanData.findIndex(f => f.age === d.age);
        const x = xOf(idx);
        const active = hoveredIdx !== null && fanData[hoveredIdx].age === d.age;
        return (
          <g key={d.age}>
            <line x1={x} y1={PAD_T + chartH} x2={x} y2={PAD_T + chartH + 4} className="mc-fan-tick" />
            <text
              x={x}
              y={H - 8}
              textAnchor="middle"
              className="mc-fan-label"
              fontWeight={active ? '800' : '600'}
              fill={active ? '#1C3826' : '#9CA3AF'}
            >
              {t('fanChart.ageLabel', { age: d.age })}
            </text>
          </g>
        );
      })}

      {/* Crosshair */}
      {hx !== null && (
        <line
          x1={hx}
          y1={PAD_T}
          x2={hx}
          y2={PAD_T + chartH}
          stroke="#1C3826"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.65"
        />
      )}

      {/* Tooltip */}
      {hovered !== null && hx !== null && (() => {
        const tx = isRight ? hx - TW - 10 : hx + 10;
        const ty = PAD_T + 2;
        const r = 6;
        return (
          <g>
            {/* Shadow */}
            <rect x={tx + 1} y={ty + 2} width={TW} height={TH} rx={r} fill="rgba(0,0,0,0.18)" />
            {/* Background */}
            <rect x={tx} y={ty} width={TW} height={TH} rx={r} fill="#1C3826" />

            {/* Header */}
            <text
              x={tx + 9}
              y={ty + 14}
              fill="white"
              fontSize={9 * FS}
              fontWeight="800"
              fontFamily="inherit"
            >
              {t('fanChart.tooltipHeader', { age: hovered.age, year: hovered.year })}
            </text>
            <text
              x={tx + TW - 9}
              y={ty + 14}
              fill="rgba(255,255,255,0.45)"
              fontSize={7 * FS}
              fontWeight="700"
              textAnchor="end"
              fontFamily="inherit"
              letterSpacing="0.5"
            >
              {t('fanChart.selection')}
            </text>

            {/* Divider */}
            <line
              x1={tx + 9}
              y1={ty + 19}
              x2={tx + TW - 9}
              y2={ty + 19}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.8"
            />

            {/* Best Case */}
            <text
              x={tx + 9}
              y={ty + 34}
              fill="rgba(255,255,255,0.65)"
              fontSize={8 * FS}
              fontFamily="inherit"
            >
              {t('fanChart.bestCase')}
            </text>
            <text
              x={tx + TW - 9}
              y={ty + 34}
              fill="white"
              fontSize={9.5 * FS}
              fontWeight="700"
              textAnchor="end"
              fontFamily="inherit"
            >
              {fmtM(hovered.p95)}
            </text>

            {/* Median */}
            <text
              x={tx + 9}
              y={ty + 52}
              fill="rgba(255,255,255,0.65)"
              fontSize={8 * FS}
              fontFamily="inherit"
            >
              {t('fanChart.median')}
            </text>
            <text
              x={tx + TW - 9}
              y={ty + 52}
              fill="white"
              fontSize={9.5 * FS}
              fontWeight="700"
              textAnchor="end"
              fontFamily="inherit"
            >
              {fmtM(hovered.p50)}
            </text>

            {/* Worst Case */}
            <text
              x={tx + 9}
              y={ty + 70}
              fill="rgba(255,255,255,0.65)"
              fontSize={8 * FS}
              fontFamily="inherit"
            >
              {t('fanChart.worstCase')}
            </text>
            <text
              x={tx + TW - 9}
              y={ty + 70}
              fill="white"
              fontSize={9.5 * FS}
              fontWeight="700"
              textAnchor="end"
              fontFamily="inherit"
            >
              {fmtM(hovered.p5)}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
