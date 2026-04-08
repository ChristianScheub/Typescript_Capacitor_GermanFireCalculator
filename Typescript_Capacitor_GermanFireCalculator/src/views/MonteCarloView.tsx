import { useRef, useEffect } from 'react';
import { FanChart } from '../ui/charts/FanChart';
import { KpiBar } from '../ui/monteCarloChart/KpiBar';
import { fmtM } from '../services/monteCarloCalculator';
import type { MonteCarloResult } from '../services/monteCarloCalculator';

interface SimConfig {
  minInflation: number;
  maxInflation: number;
  volatility: number;
}

interface SimRange {
  startCapital: number;
  startYear: number;
  endYear: number;
}

interface MonteCarloViewProps {
  result: MonteCarloResult;
  fireTargetFormatted: string;
  fireYear: number;
  successPct: number;
  isBadSuccess: boolean;
  risikoLabel: string;
  risikoColor: string;
  simConfig: SimConfig;
  simRange: SimRange;
  currentYear: number;
  kpiZielwert: string;
  kpiErfolgsrate: string;
  onSimConfigChange: (c: SimConfig) => void;
  onSimRangeChange: (r: SimRange) => void;
  onFullscreenOpen: () => void;
  onRerun: () => void;
}

// ── Main View ────────────────────────────────────────────────────────────────

export function MonteCarloView({
  result,
  fireTargetFormatted,
  fireYear,
  successPct,
  isBadSuccess,
  risikoLabel,
  risikoColor,
  simConfig,
  simRange,
  currentYear,
  kpiZielwert,
  kpiErfolgsrate,
  onSimConfigChange,
  onSimRangeChange,
  onFullscreenOpen,
  onRerun,
}: MonteCarloViewProps) {
  const minInflationRef = useRef<HTMLInputElement>(null);
  const maxInflationRef = useRef<HTMLInputElement>(null);
  const volatilityRef = useRef<HTMLInputElement>(null);
  const startCapitalRef = useRef<HTMLInputElement>(null);
  const startYearRef = useRef<HTMLInputElement>(null);
  const endYearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (minInflationRef.current) minInflationRef.current.value = String(simConfig.minInflation);
    if (maxInflationRef.current) maxInflationRef.current.value = String(simConfig.maxInflation);
    if (volatilityRef.current) volatilityRef.current.value = String(simConfig.volatility);
    if (startCapitalRef.current) startCapitalRef.current.value = String(simRange.startCapital);
    if (startYearRef.current) startYearRef.current.value = String(simRange.startYear);
    if (endYearRef.current) endYearRef.current.value = String(simRange.endYear);
  }, [simConfig, simRange]);

  const handleRerun = () => {
    const newConfig: SimConfig = {
      minInflation: parseFloat(minInflationRef.current?.value || String(simConfig.minInflation)),
      maxInflation: parseFloat(maxInflationRef.current?.value || String(simConfig.maxInflation)),
      volatility: parseFloat(volatilityRef.current?.value || String(simConfig.volatility)),
    };

    const newRange: SimRange = {
      startCapital: parseFloat(startCapitalRef.current?.value || String(simRange.startCapital)),
      startYear: parseInt(startYearRef.current?.value || String(simRange.startYear), 10),
      endYear: parseInt(endYearRef.current?.value || String(simRange.endYear), 10),
    };

    onSimConfigChange(newConfig);
    onSimRangeChange(newRange);
    onRerun();
  };

  return (
    <>
      <div className="mc-screen">
        {/* ── Header ── */}
        <div className="mc-header">
          <h2 className="mc-title">
            Monte-Carlo
            <br />
            Simulation
          </h2>
          <p className="mc-subtitle">FINANZIELLE AUSDAUER-ANALYSE</p>
        </div>

        {/* ── Success Rate ── */}
        <div className={`mc-card${isBadSuccess ? ' mc-card--danger-border' : ''}`}>
          <p className="mc-label">ERFOLGSWAHRSCHEINLICHKEIT</p>
          <p className={`mc-big-value${isBadSuccess ? ' mc-big-value--danger' : ''}`}>{successPct}%</p>
          <p className="mc-sub">
            Ihr Kapital reicht bis zum 100. Lebensjahr in <strong>{result.successCount}</strong> von <strong>{result.numSimulations}</strong> simulierten Marktzyklen.
          </p>
          <p className="mc-sub mc-sub--secondary">
            Die Simulation startet mit <strong>{fmtM(simRange.startCapital)}</strong> Portfoliokapital im Jahr <strong>{simRange.startYear}</strong> – basierend auf Ihrer Konfiguration.
          </p>
        </div>

        {/* ── Pessimistic Case ── */}
        <div className="mc-card mc-card--pessimistic">
          <p className="mc-label">PESSIMISTIC CASE</p>
          <p className="mc-pessimistic-line">
            Geld aufgebraucht mit <span className="mc-pessimistic-age">{result.pessimisticAge}</span>
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
              Vermögensentwicklung
              <br />
              (Fächer-Diagramm)
            </span>
            <div className="mc-fan-header-actions">
              <div className="mc-fan-legend">
                <span className="mc-legend-item mc-legend-item--95">95% KI</span>
                <span className="mc-legend-item mc-legend-item--50">50% KI</span>
              </div>
              {/* Fullscreen button */}
              <button className="mc-fullscreen-btn" onClick={onFullscreenOpen} aria-label="Vollbild">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          </div>

          <p className="mc-chart-hint">Tippe auf den Graphen für Details</p>
          <FanChart fanData={result.fanData} />
          <KpiBar zielwert={kpiZielwert} erfolgsrate={kpiErfolgsrate} risikoLabel={risikoLabel} risikoColor={risikoColor} />
        </div>

        {/* ── Volatility Slider ── */}
        <div className="mc-card">
          <div className="mc-input-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="mc-input-title">Börsen-Volatilität</span>
          </div>
          <div className="mc-slider-row">
            <span className="mc-slider-label">STANDARDABWEICHUNG</span>
            <span className="mc-slider-value">{simConfig.volatility.toFixed(1)}%</span>
          </div>
          <input
            ref={volatilityRef}
            type="range"
            className="mc-slider"
            min={5}
            max={25}
            step={0.5}
            defaultValue={simConfig.volatility}
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
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="mc-input-title">Inflations-Bandbreite</span>
          </div>
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">MIN. INFLATION</label>
              <div className="mc-inflation-input-wrap">
                <input
                  ref={minInflationRef}
                  type="number"
                  className="mc-inflation-input"
                  min={0}
                  max={simConfig.maxInflation - 0.1}
                  step={0.1}
                  defaultValue={simConfig.minInflation}
                />
                <span className="mc-inflation-unit">%</span>
              </div>
            </div>
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">MAX. INFLATION</label>
              <div className="mc-inflation-input-wrap">
                <input
                  ref={maxInflationRef}
                  type="number"
                  className="mc-inflation-input"
                  min={simConfig.minInflation + 0.1}
                  max={15}
                  step={0.1}
                  defaultValue={simConfig.maxInflation}
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <span className="mc-input-title">Simulations-Parameter</span>
          </div>
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">STARTKAPITAL</label>
              <div className="mc-inflation-input-wrap">
                <input
                  ref={startCapitalRef}
                  type="number"
                  className="mc-inflation-input"
                  min={1000}
                  step={1000}
                  defaultValue={simRange.startCapital}
                />
                <span className="mc-inflation-unit">€</span>
              </div>
            </div>
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">STARTJAHR</label>
              <div className="mc-inflation-input-wrap">
                <input
                  ref={startYearRef}
                  type="number"
                  className="mc-inflation-input"
                  min={currentYear}
                  max={simRange.endYear - 1}
                  step={1}
                  defaultValue={simRange.startYear}
                />
              </div>
            </div>
          </div>
          <div className="mc-inflation-row mc-inflation-row--top">
            <div className="mc-inflation-field">
              <label className="mc-inflation-label">BIS JAHR</label>
              <div className="mc-inflation-input-wrap">
                <input
                  ref={endYearRef}
                  type="number"
                  className="mc-inflation-input"
                  min={simRange.startYear + 1}
                  max={2150}
                  step={1}
                  defaultValue={simRange.endYear}
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mc-disclaimer__icon">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p>
            Die Simulation nutzt historische Renditedaten des MSCI World Index (1970–2023) kombiniert mit einer stochastischen Modellierung der Teuerungsrate.
          </p>
        </div>
      </div>
    </>
  );
}
