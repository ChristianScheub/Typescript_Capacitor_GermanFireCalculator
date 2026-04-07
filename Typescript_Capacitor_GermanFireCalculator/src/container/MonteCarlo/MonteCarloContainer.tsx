import { useState, useMemo, useCallback }         from 'react';
import { useFireContext }                          from '../../context/FireContext';
import { fireService }                             from '../../services/fire';
import { calcMonteCarlo }                          from '../../services/monteCarloCalculator';
import type { FanDataPoint, MonteCarloResult }     from '../../services/monteCarloCalculator';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtM(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2).replace('.', ',') + 'M €';
  if (v >= 1_000)     return Math.round(v / 1_000) + 'k €';
  return Math.round(v) + ' €';
}

function fmtEuro(v: number): string {
  return '€ ' + Math.round(v).toLocaleString('de-DE');
}

function getRisiko(rate: number): { label: string; color: string } {
  if (rate >= 95) return { label: 'Sehr gering', color: '#16A34A' };
  if (rate >= 85) return { label: 'Gering',      color: '#B91C1C' };
  if (rate >= 75) return { label: 'Moderat',     color: '#D97706' };
  return             { label: 'Hoch',            color: '#EF4444' };
}

// ── Interactive Fan Chart ─────────────────────────────────────────────────────

interface FanChartProps {
  fanData:    FanDataPoint[];
  landscape?: boolean;
}

function InteractiveFanChart({ fanData, landscape = false }: FanChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (fanData.length < 2) return null;

  const W      = landscape ? 580 : 320;
  const H      = landscape ? 280 : 200;
  const PAD_L  = landscape ? 10  : 6;
  const PAD_R  = landscape ? 10  : 6;
  const PAD_T  = landscape ? 16  : 10;
  const PAD_B  = landscape ? 44  : 36;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const maxVal = Math.max(...fanData.map(d => d.p95), 1);
  const n      = fanData.length;

  const xOf = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const yOf = (v: number) => PAD_T + chartH - Math.min(1, v / maxVal) * chartH;

  // Band polygons
  const top95  = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p95).toFixed(1)}`);
  const bot95  = [...fanData].reverse().map((d, i) => `${xOf(n-1-i).toFixed(1)},${yOf(d.p5).toFixed(1)}`);
  const poly95 = [...top95, ...bot95].join(' ');

  const top50  = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p75).toFixed(1)}`);
  const bot50  = [...fanData].reverse().map((d, i) => `${xOf(n-1-i).toFixed(1)},${yOf(d.p25).toFixed(1)}`);
  const poly50 = [...top50, ...bot50].join(' ');

  const medianPts = fanData.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.p50).toFixed(1)}`).join(' ');

  // Axis labels
  const step      = landscape ? 10 : 15;
  const labelAges = new Set<number>();
  labelAges.add(fanData[0].age);
  for (let a = fanData[0].age + step; a < 100; a += step) labelAges.add(a);
  labelAges.add(100);
  const axisItems = fanData.filter(d => labelAges.has(d.age));

  // Pointer interaction
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const idx  = Math.round(relX * (n - 1));
    setHoveredIdx(Math.max(0, Math.min(n - 1, idx)));
  };
  const handlePointerLeave = () => setHoveredIdx(null);

  const hovered  = hoveredIdx !== null ? fanData[hoveredIdx] : null;
  const hx       = hoveredIdx !== null ? xOf(hoveredIdx) : null;
  const isRight  = hoveredIdx !== null && hoveredIdx > n * 0.55;

  // Tooltip dimensions (in viewBox units)
  const TW = landscape ? 148 : 128;
  const TH = landscape ? 86  : 78;
  const FS = landscape ? 1.1 : 1;  // font scale multiplier

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mc-fan-chart"
      style={{ touchAction: 'none', overflow: 'visible' }}
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
        x1={PAD_L} y1={PAD_T + chartH}
        x2={W - PAD_R} y2={PAD_T + chartH}
        className="mc-fan-axis"
      />

      {/* Axis labels */}
      {axisItems.map((d) => {
        const idx    = fanData.findIndex(f => f.age === d.age);
        const x      = xOf(idx);
        const active = hoveredIdx !== null && fanData[hoveredIdx].age === d.age;
        return (
          <g key={d.age}>
            <line x1={x} y1={PAD_T + chartH} x2={x} y2={PAD_T + chartH + 4} className="mc-fan-tick" />
            <text
              x={x} y={H - 8}
              textAnchor="middle"
              className="mc-fan-label"
              fontWeight={active ? '800' : '600'}
              fill={active ? '#1C3826' : '#9CA3AF'}
            >
              Age {d.age}
            </text>
          </g>
        );
      })}

      {/* Crosshair */}
      {hx !== null && (
        <line
          x1={hx} y1={PAD_T}
          x2={hx} y2={PAD_T + chartH}
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
        const r  = 6;
        return (
          <g>
            {/* Shadow */}
            <rect x={tx + 1} y={ty + 2} width={TW} height={TH} rx={r} fill="rgba(0,0,0,0.18)" />
            {/* Background */}
            <rect x={tx} y={ty} width={TW} height={TH} rx={r} fill="#1C3826" />

            {/* Header */}
            <text x={tx + 9} y={ty + 14} fill="white" fontSize={9 * FS} fontWeight="800" fontFamily="inherit">
              Alter {hovered.age} ({hovered.year})
            </text>
            <text x={tx + TW - 9} y={ty + 14} fill="rgba(255,255,255,0.45)" fontSize={7 * FS} fontWeight="700" textAnchor="end" fontFamily="inherit" letterSpacing="0.5">
              SELECTION
            </text>

            {/* Divider */}
            <line x1={tx + 9} y1={ty + 19} x2={tx + TW - 9} y2={ty + 19} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

            {/* Best Case */}
            <text x={tx + 9} y={ty + 34} fill="rgba(255,255,255,0.65)" fontSize={8 * FS} fontFamily="inherit">Best Case</text>
            <text x={tx + TW - 9} y={ty + 34} fill="white" fontSize={9.5 * FS} fontWeight="700" textAnchor="end" fontFamily="inherit">
              {fmtM(hovered.p95)}
            </text>

            {/* Median */}
            <text x={tx + 9} y={ty + 52} fill="rgba(255,255,255,0.65)" fontSize={8 * FS} fontFamily="inherit">Median</text>
            <text x={tx + TW - 9} y={ty + 52} fill="white" fontSize={9.5 * FS} fontWeight="700" textAnchor="end" fontFamily="inherit">
              {fmtM(hovered.p50)}
            </text>

            {/* Worst Case */}
            <text x={tx + 9} y={ty + 70} fill="rgba(255,255,255,0.65)" fontSize={8 * FS} fontFamily="inherit">Worst Case</text>
            <text x={tx + TW - 9} y={ty + 70} fill="white" fontSize={9.5 * FS} fontWeight="700" textAnchor="end" fontFamily="inherit">
              {fmtM(hovered.p5)}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ── KPI Bar ───────────────────────────────────────────────────────────────────

function KpiBar({ result }: { result: MonteCarloResult }) {
  const finalPoint  = result.fanData.at(-1);
  const zielwert    = finalPoint ? finalPoint.p50 : result.medianFinalWealth;
  const rateStr     = result.successRate.toFixed(1).replace('.', ',') + '%';
  const risiko      = getRisiko(result.successRate);

  return (
    <div className="mc-kpi-bar">
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">ERWARTETER ZIELWERT</p>
        <p className="mc-kpi-value">{fmtEuro(zielwert)}</p>
      </div>
      <div className="mc-kpi-divider" />
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">ERFOLGSRATE</p>
        <p className="mc-kpi-value">{rateStr}</p>
      </div>
      <div className="mc-kpi-divider" />
      <div className="mc-kpi-col">
        <p className="mc-kpi-label">ENTNAHME-RISIKO</p>
        <p className="mc-kpi-value" style={{ color: risiko.color }}>{risiko.label}</p>
      </div>
    </div>
  );
}

// ── Fullscreen Landscape Overlay ──────────────────────────────────────────────

function FullscreenOverlay({
  result,
  onClose,
}: {
  result:  MonteCarloResult;
  onClose: () => void;
}) {
  return (
    <div className="mc-fullscreen-overlay" onPointerDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mc-fullscreen-landscape">
        {/* Close */}
        <button className="mc-fullscreen-close" onClick={onClose} aria-label="Schließen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header row */}
        <div className="mc-fullscreen-header">
          <span className="mc-fullscreen-title">Monte-Carlo · Fächer-Diagramm</span>
          <div className="mc-fan-legend">
            <span className="mc-legend-item mc-legend-item--95">95% KI</span>
            <span className="mc-legend-item mc-legend-item--50">50% KI</span>
          </div>
        </div>

        {/* Large interactive chart */}
        <div className="mc-fullscreen-chart">
          <InteractiveFanChart fanData={result.fanData} landscape />
        </div>

        {/* KPI bar */}
        <KpiBar result={result} />
      </div>
    </div>
  );
}

// ── Main Container ────────────────────────────────────────────────────────────

export function MonteCarloContainer() {
  const { state, fireDate, fireTarget } = useFireContext();

  const [minInflation,  setMinInflation]  = useState(1.5);
  const [maxInflation,  setMaxInflation]  = useState(4.0);
  const [volatility,    setVolatility]    = useState(12.5);
  const [runKey,        setRunKey]        = useState(0);
  const [isFullscreen,  setIsFullscreen]  = useState(false);

  const currentYear      = new Date().getFullYear();
  const yearsToFIRE      = Math.max(0, fireDate.year - currentYear);
  const fireAge          = state.currentAge + yearsToFIRE;
  const grossSWR         = useMemo(() => fireService.calcGrossSWR(state), [state]);
  const annualWithdrawal = grossSWR * 12;
  const pensionAnnualNet = state.pensionMonthly * 12;

  const [startCapital, setStartCapital] = useState(fireTarget);
  const [startYear,    setStartYear]    = useState(fireDate.year);
  const [endYear,      setEndYear]      = useState(fireDate.year + Math.max(1, 100 - fireAge));

  const simFireAge = state.currentAge + Math.max(0, startYear - currentYear);

  const result: MonteCarloResult = useMemo(() => calcMonteCarlo(
    startCapital,
    annualWithdrawal,
    state.etfRate,
    simFireAge,
    {
      minInflation,
      maxInflation,
      volatility,
      numSimulations:   1000,
      pensionAge:       state.pensionAge,
      pensionAnnualNet,
      startYear,
      simulateUntilYear: endYear,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [startCapital, annualWithdrawal, state.etfRate, simFireAge, minInflation, maxInflation, volatility, runKey, state.pensionAge, pensionAnnualNet, startYear, endYear]);

  const handleRerun = useCallback(() => setRunKey(k => k + 1), []);

  const successPct   = Math.round(result.successRate);
  const isBadSuccess = successPct < 60;

  return (
    <>
      <div className="mc-screen">
        {/* ── Header ── */}
        <div className="mc-header">
          <h2 className="mc-title">Monte-Carlo<br />Simulation</h2>
          <p className="mc-subtitle">FINANZIELLE AUSDAUER-ANALYSE</p>
        </div>

        {/* ── Success Rate ── */}
        <div className={`mc-card${isBadSuccess ? ' mc-card--danger-border' : ''}`}>
          <p className="mc-label">ERFOLGSWAHRSCHEINLICHKEIT</p>
          <p className={`mc-big-value${isBadSuccess ? ' mc-big-value--danger' : ''}`}>{successPct}%</p>
          <p className="mc-sub">
            Ihr Kapital reicht bis zum 100. Lebensjahr in{' '}
            <strong>{result.successCount}</strong> von{' '}
            <strong>{result.numSimulations}</strong> simulierten Marktzyklen.
          </p>
          <p className="mc-sub" style={{ marginTop: '0.5rem', opacity: 0.75 }}>
            Die Simulation startet mit{' '}
            <strong>{fmtEuro(fireTarget)}</strong> Portfoliokapital im Jahr{' '}
            <strong>{fireDate.year}</strong> – basierend auf Ihrer FIRE-Datum-Berechnung.
          </p>
        </div>

        {/* ── Pessimistic Case ── */}
        <div className="mc-card mc-card--pessimistic">
          <p className="mc-label">PESSIMISTIC CASE</p>
          <p className="mc-pessimistic-line">
            Geld aufgebraucht mit{' '}
            <span className="mc-pessimistic-age">{result.pessimisticAge}</span>
          </p>
          <p className="mc-sub">Das ungünstigste Szenario bei hoher Inflation und geringem Marktwachstum.</p>
        </div>

        {/* ── Median Inheritance ── */}
        <div className="mc-card mc-card--positive">
          <p className="mc-label">MEDIAN-ERBE</p>
          <p className="mc-value">{fmtM(result.medianFinalWealth)}</p>
          <p className="mc-sub">Erwarteter Vermögensüberschuss am Ende des Simulationszeitraums.</p>
        </div>

        {/* ── Fan Chart Card ── */}
        <div className="mc-card mc-card--chart">
          <div className="mc-fan-header-row">
            <span className="mc-fan-title">
              Vermögensentwicklung<br />(Fächer-Diagramm)
            </span>
            <div className="mc-fan-header-actions">
              <div className="mc-fan-legend">
                <span className="mc-legend-item mc-legend-item--95">95% KI</span>
                <span className="mc-legend-item mc-legend-item--50">50% KI</span>
              </div>
              {/* Fullscreen button */}
              <button
                className="mc-fullscreen-btn"
                onClick={() => setIsFullscreen(true)}
                aria-label="Vollbild"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
            </div>
          </div>

          <p className="mc-chart-hint">Tippe auf den Graphen für Details</p>
          <InteractiveFanChart fanData={result.fanData} />
          <KpiBar result={result} />
        </div>

        {/* ── Volatility Slider ── */}
        <div className="mc-card">
          <div className="mc-input-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span className="mc-input-title">Börsen-Volatilität</span>
          </div>
          <div className="mc-slider-row">
            <span className="mc-slider-label">STANDARDABWEICHUNG</span>
            <span className="mc-slider-value">{volatility.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            className="mc-slider"
            min={5} max={25} step={0.5}
            value={volatility}
            onChange={e => setVolatility(parseFloat(e.target.value))}
          />
          <div className="mc-slider-hints">
            <span>Konservativ (5%)</span>
            <span>Aggressiv (25%)</span>
          </div>
        </div>

        {/* ── Inflation Inputs ── */}
        <div className="mc-card">
          <div className="mc-input-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span className="mc-input-title">Inflations-Bandbreite</span>
          </div>
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">MIN. INFLATION</label>
              <div className="mc-inflation-input-wrap">
                <input
                  type="number"
                  className="mc-inflation-input"
                  min={0} max={maxInflation - 0.1} step={0.1}
                  value={minInflation}
                  onChange={e => setMinInflation(Math.min(parseFloat(e.target.value) || 0, maxInflation - 0.1))}
                />
                <span className="mc-inflation-unit">%</span>
              </div>
            </div>
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">MAX. INFLATION</label>
              <div className="mc-inflation-input-wrap">
                <input
                  type="number"
                  className="mc-inflation-input"
                  min={minInflation + 0.1} max={15} step={0.1}
                  value={maxInflation}
                  onChange={e => setMaxInflation(Math.max(parseFloat(e.target.value) || 0, minInflation + 0.1))}
                />
                <span className="mc-inflation-unit">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Simulation Parameter ── */}
        <div className="mc-card">
          <div className="mc-input-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
            <span className="mc-input-title">Simulations-Parameter</span>
          </div>
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">STARTKAPITAL</label>
              <div className="mc-inflation-input-wrap">
                <input
                  type="number"
                  className="mc-inflation-input"
                  min={1000} step={1000}
                  value={startCapital}
                  onChange={e => setStartCapital(Math.max(1000, parseFloat(e.target.value) || 0))}
                />
                <span className="mc-inflation-unit">€</span>
              </div>
            </div>
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">STARTJAHR</label>
              <div className="mc-inflation-input-wrap">
                <input
                  type="number"
                  className="mc-inflation-input"
                  min={currentYear} max={endYear - 1} step={1}
                  value={startYear}
                  onChange={e => setStartYear(Math.min(Math.max(parseInt(e.target.value) || currentYear, currentYear), endYear - 1))}
                />
              </div>
            </div>
          </div>
          <div className="mc-inflation-row" style={{ marginTop: '0.75rem' }}>
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">BIS JAHR</label>
              <div className="mc-inflation-input-wrap">
                <input
                  type="number"
                  className="mc-inflation-input"
                  min={startYear + 1} max={2150} step={1}
                  value={endYear}
                  onChange={e => setEndYear(Math.max(parseInt(e.target.value) || startYear + 1, startYear + 1))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Run Button ── */}
        <button className="mc-run-btn" onClick={handleRerun}>
          Simulation neu starten
        </button>

        {/* ── Disclaimer ── */}
        <div className="mc-disclaimer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p>
            Die Simulation nutzt historische Renditedaten des MSCI World Index (1970–2023)
            kombiniert mit einer stochastischen Modellierung der Teuerungsrate.
          </p>
        </div>
      </div>

      {/* ── Fullscreen Overlay ── */}
      {isFullscreen && (
        <FullscreenOverlay result={result} onClose={() => setIsFullscreen(false)} />
      )}
    </>
  );
}
