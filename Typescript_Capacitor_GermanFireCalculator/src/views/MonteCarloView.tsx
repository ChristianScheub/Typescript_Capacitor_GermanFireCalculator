import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MonteCarloChart } from "../ui/charts/MonteCarloChart";
import { StatCard } from "../ui/cards/StatCard";
import { ContentSection } from "../ui/cards/InputCard";
import { Icon } from "../ui/icons";
import { RefNumericInput } from "../ui/inputs/RefNumericInput";
import { fmtM } from "../services/monteCarloCalculator";
import type { MonteCarloResult } from "../services/monteCarloCalculator";

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
  successPct: number;
  isBadSuccess: boolean;
  risikoLabel: string;
  risikoColor: string;
  simConfig: SimConfig;
  simRange: SimRange;
  monthlyWithdrawal: number;
  currentYear: number;
  kpiZielwert: string;
  kpiErfolgsrate: string;
  displayVolatility: number;
  onSimConfigChange: (c: SimConfig) => void;
  onSimRangeChange: (r: SimRange) => void;
  onMonthlyWithdrawalChange: (w: number) => void;
  onVolatilityChange: (v: number) => void;
  onFullscreenOpen: () => void;
  onRerun: () => void;
}

// ── Main View ────────────────────────────────────────────────────────────────

export function MonteCarloView({
  result,
  successPct,
  isBadSuccess,
  risikoLabel,
  risikoColor,
  simConfig,
  simRange,
  monthlyWithdrawal,
  currentYear,
  kpiZielwert,
  kpiErfolgsrate,
  displayVolatility,
  onSimConfigChange,
  onSimRangeChange,
  onMonthlyWithdrawalChange,
  onVolatilityChange,
  onFullscreenOpen,
  onRerun,
}: MonteCarloViewProps) {
  const { t } = useTranslation();
  const minInflationRef = useRef<HTMLInputElement>(null);
  const maxInflationRef = useRef<HTMLInputElement>(null);
  const volatilityRef = useRef<HTMLInputElement>(null);
  const monthlyWithdrawalRef = useRef<HTMLInputElement>(null);
  const startCapitalRef = useRef<HTMLInputElement>(null);
  const startYearRef = useRef<HTMLInputElement>(null);
  const endYearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (minInflationRef.current)
      minInflationRef.current.value = String(simConfig.minInflation);
    if (maxInflationRef.current)
      maxInflationRef.current.value = String(simConfig.maxInflation);
    if (volatilityRef.current)
      volatilityRef.current.value = String(simConfig.volatility);
    if (monthlyWithdrawalRef.current)
      monthlyWithdrawalRef.current.value = String(monthlyWithdrawal);
    if (startCapitalRef.current)
      startCapitalRef.current.value = String(simRange.startCapital);
    if (startYearRef.current)
      startYearRef.current.value = String(simRange.startYear);
    if (endYearRef.current) endYearRef.current.value = String(simRange.endYear);
  }, [simConfig, simRange, monthlyWithdrawal]);

  const handleRerun = () => {
    const newConfig: SimConfig = {
      minInflation: parseFloat(
        minInflationRef.current?.value || String(simConfig.minInflation),
      ),
      maxInflation: parseFloat(
        maxInflationRef.current?.value || String(simConfig.maxInflation),
      ),
      volatility: parseFloat(
        volatilityRef.current?.value || String(simConfig.volatility),
      ),
    };

    const newWithdrawal = parseFloat(
      monthlyWithdrawalRef.current?.value || String(monthlyWithdrawal),
    );

    const newRange: SimRange = {
      startCapital: parseFloat(
        startCapitalRef.current?.value || String(simRange.startCapital),
      ),
      startYear: parseInt(
        startYearRef.current?.value || String(simRange.startYear),
        10,
      ),
      endYear: parseInt(
        endYearRef.current?.value || String(simRange.endYear),
        10,
      ),
    };

    onSimConfigChange(newConfig);
    onMonthlyWithdrawalChange(newWithdrawal);
    onSimRangeChange(newRange);
    onRerun();
  };

  return (
    <>
      <div className="mc-screen">
        {/* ── Header ── */}
        <div className="mc-header">
          <h2 className="mc-title">
            {t('monteCarlo.title')}
            <br />
          </h2>
          <p className="mc-subtitle">{t('monteCarlo.subtitle')}</p>
        </div>

        {/* ── Success Rate ── */}
        <StatCard label="monteCarlo.successLabel" danger={isBadSuccess}>
          <p
            className={`mc-big-value${isBadSuccess ? " mc-big-value--danger" : ""}`}
          >
            {successPct}%
          </p>
          <p className="mc-sub">
            {t('monteCarlo.successInfo', { count: result.successCount, total: result.numSimulations })}
          </p>
          <p className="mc-sub mc-sub--secondary">
            {t('monteCarlo.simulationStart', { capital: fmtM(simRange.startCapital), year: simRange.startYear })}
          </p>
        </StatCard>

        {/* ── Pessimistic Case ── */}
        <StatCard label="monteCarlo.pessimisticCaseLabel" variant="pessimistic">
          <p className="mc-pessimistic-line">
            {t('monteCarlo.pessimisticCase')}{" "}
            <span className="mc-pessimistic-age">{result.pessimisticAge}</span>
          </p>
          <p className="mc-sub">
            {t('monteCarlo.pessimisticDesc')}
          </p>
        </StatCard>

        {/* ── Median Inheritance ── */}
        <StatCard label="monteCarlo.medianInheritanceLabel" variant="positive">
          <p className="mc-value">{fmtM(result.medianFinalWealth)}</p>
          <p className="mc-sub">
            {t('monteCarlo.medianInheritanceDesc')}
          </p>
        </StatCard>

        {/* ── Fan Chart Card ── */}
        <div className="mc-card mc-card--chart">
          <MonteCarloChart
            fanData={result.fanData}
            zielwert={kpiZielwert}
            erfolgsrate={kpiErfolgsrate}
            risikoLabel={risikoLabel}
            risikoColor={risikoColor}
            onFullscreenOpen={onFullscreenOpen}
          />
        </div>

        {/* ── Volatility Slider ── */}
        <ContentSection
          icon={<Icon name="chart" size="sm" />}
          title={t('monteCarlo.volatilityTitle')}
        >
          <div className="mc-slider-row">
            <span className="mc-slider-label">{t('monteCarlo.standardDeviation')}</span>
            <span className="mc-slider-value">
              {displayVolatility.toFixed(1)}%
            </span>
          </div>
          <input
            ref={volatilityRef}
            type="range"
            className="mc-slider"
            min={5}
            max={50}
            step={0.5}
            defaultValue={simConfig.volatility}
            onChange={(e) => onVolatilityChange(parseFloat(e.target.value))}
          />
          <div className="mc-slider-hints">
            <span>{t('monteCarlo.conservative')}</span>
            <span>{t('monteCarlo.extreme')}</span>
          </div>
          <p className="mc-sub mc-sub--secondary">
            {t('monteCarlo.volatilityInfo')}
          </p>
        </ContentSection>

        {/* ── Inflation Inputs ── */}
        <ContentSection
          icon={<Icon name="clock" size="sm" />}
          title={t('monteCarlo.inflationRangeTitle')}
        >
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={minInflationRef}
                label={t('monteCarlo.minInflation')}
                unit="%"
                min={0}
                max={simConfig.maxInflation - 0.1}
                step={0.1}
                defaultValue={simConfig.minInflation}
              />
            </div>
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={maxInflationRef}
                label={t('monteCarlo.maxInflation')}
                unit="%"
                min={simConfig.minInflation + 0.1}
                max={15}
                step={0.1}
                defaultValue={simConfig.maxInflation}
              />
            </div>
          </div>
        </ContentSection>

        {/* ── Simulation Parameter ── */}
        <ContentSection
          icon={<Icon name="add" size="sm" />}
          title={t('monteCarlo.simulationParamsTitle')}
        >
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={startCapitalRef}
                label={t('monteCarlo.startCapital')}
                unit="€"
                min={1000}
                step={1000}
                defaultValue={simRange.startCapital}
              />
            </div>
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={startYearRef}
                label={t('monteCarlo.startYear')}
                unit=""
                min={currentYear}
                max={simRange.endYear - 1}
                step={1}
                defaultValue={simRange.startYear}
              />
            </div>
          </div>
          <div className="mc-inflation-row mc-inflation-row--top">
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={endYearRef}
                label={t('monteCarlo.endYear')}
                unit=""
                min={simRange.startYear + 1}
                max={2150}
                step={1}
                defaultValue={simRange.endYear}
              />
            </div>
          </div>
        </ContentSection>

        {/* ── Monthly Withdrawal ── */}
        <ContentSection
          icon={<Icon name="wallet" size="sm" />}
          title={t('monteCarlo.monthlyExpensesTitle')}
        >
          <div className="mc-inflation-row">
            <div className="mc-inflation-field">
              <RefNumericInput
                ref={monthlyWithdrawalRef}
                label={t('monteCarlo.amountPerMonth')}
                unit="€"
                min={0}
                step={100}
                defaultValue={monthlyWithdrawal}
                hint={t('monteCarlo.expensesInfo')}
              />
            </div>
          </div>
        </ContentSection>

        {/* ── Run Button ── */}
        <button className="mc-run-btn" onClick={handleRerun}>
          {t('monteCarlo.runSimulation')}
        </button>
      </div>
    </>
  );
}
