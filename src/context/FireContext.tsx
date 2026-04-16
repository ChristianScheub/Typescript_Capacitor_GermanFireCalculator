import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useTranslation }      from 'react-i18next';
import type { FireState }      from '../types/fire/models/FireState';
import type { ChartDataPoint } from '../types/fire/models/ChartDataPoint';
import { fireService }         from '../services/fire';

// ─── Context Shape ─────────────────────────────────────────────────────────────

interface FireContextType {
  state:          FireState;
  updateField:    <K extends keyof FireState>(key: K, value: FireState[K]) => void;
  netWorth:       number;
  grossSWR:       number;
  netSWR:         number;
  fireTarget:     number;
  firePercentage: number;
  abgabenQuote:   number;
  monthlySavings: number;
  weightedReturn: number;
  fireDate:       { year: number; month: string };
  chartData:      ChartDataPoint[];
}

const FireContext = createContext<FireContextType | null>(null);

// ─── LocalStorage persistence ──────────────────────────────────────────────────

const STORAGE_KEY = 'fire_state_v1';

function loadState(): FireState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FireState>;
      return { ...fireService.getDefaultState(), ...parsed };
    }
  } catch {
    // corrupted data → fall back to defaults
  }
  return fireService.getDefaultState();
}

function saveState(state: FireState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage quota exceeded or private mode → ignore
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function FireProvider({ children }: { readonly children: React.ReactNode }) {
  const { t } = useTranslation();
  const [state, setState] = useState<FireState>(() => loadState());

  const updateField = useCallback(<K extends keyof FireState>(key: K, value: FireState[K]) => {
    setState(prev => {
      const next = { ...prev, [key]: value };
      saveState(next);
      return next;
    });
  }, []);

  const computed = useMemo(() => {
    const netWorth        = fireService.calcNetWorth(state);
    const grossSWR        = fireService.calcGrossSWR(state);
    const netSWR          = fireService.calcNetSWR(state, grossSWR);
    const weightedReturn  = fireService.calcWeightedReturn(state);
    const fireTarget      = fireService.calcFireTarget(state, weightedReturn);
    const firePercentage  = fireService.calcFirePercentage(netWorth, fireTarget);
    const abgabenQuote    = fireService.calcAbgabenQuote(state, grossSWR);
    const monthlySavings  = fireService.calcMonthlySavings(state);
    const fireDate     = fireService.calcFIREDate(
      state.etfBalance, state.cashBalance,
      state.etfRate, state.cashRate,
      monthlySavings, fireTarget,
      state.savingsGrowthRate,
    );

    const currentYear  = new Date().getFullYear();
    const pensionYear  = currentYear + Math.max(0, state.pensionAge - state.currentAge);
    const uniqueYears  = [...new Set([
      currentYear,
      currentYear + 6,
      fireDate.year,
      pensionYear,
      fireDate.year + 24,
    ])].sort((a, b) => a - b);

    const monthlyWithdraw = state.fixedExpenses + state.pkvContribution + state.variableExpenses;
    const chartData = fireService.calcProjectedWealth(
      state.etfBalance, state.cashBalance,
      state.etfRate, state.cashRate,
      monthlySavings, monthlyWithdraw, state.assetTaxRate,
      fireDate.year, uniqueYears, pensionYear,
      state.savingsGrowthRate, state.inflationRate,
      {
        today:   t('prognosis.chartTodayLabel'),
        fire:    t('prognosis.chartFireLabel'),
        pension: t('prognosis.chartPensionLabel'),
      },
    );

    return { netWorth, grossSWR, netSWR, fireTarget, firePercentage, abgabenQuote, monthlySavings, weightedReturn, fireDate, chartData };
  }, [state, t]);

  const contextValue = useMemo(
    () => ({ state, updateField, ...computed }),
    [state, updateField, computed],
  );

  return (
    <FireContext.Provider value={contextValue}>
      {children}
    </FireContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useFireContext(): FireContextType {
  const ctx = useContext(FireContext);
  if (!ctx) throw new Error('useFireContext must be inside <FireProvider>');
  return ctx;
}
