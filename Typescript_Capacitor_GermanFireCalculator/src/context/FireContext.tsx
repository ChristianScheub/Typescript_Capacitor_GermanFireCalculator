import React, { createContext, useContext, useState, useMemo } from 'react';
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

// ─── Provider ──────────────────────────────────────────────────────────────────

export function FireProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FireState>(() => fireService.getDefaultState());

  const updateField = <K extends keyof FireState>(key: K, value: FireState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const computed = useMemo(() => {
    const netWorth        = fireService.calcNetWorth(state);
    const grossSWR        = fireService.calcGrossSWR(netWorth);
    const netSWR          = fireService.calcNetSWR(state, grossSWR);
    const fireTarget      = fireService.calcFireTarget(state);
    const firePercentage  = fireService.calcFirePercentage(netWorth, fireTarget);
    const abgabenQuote    = fireService.calcAbgabenQuote(state, grossSWR);
    const monthlySavings  = fireService.calcMonthlySavings(state);
    const weightedReturn  = fireService.calcWeightedReturn(state);
    const fireDate        = fireService.calcFIREDate(netWorth, monthlySavings, fireTarget, weightedReturn);

    const currentYear  = new Date().getFullYear();
    const uniqueYears  = [...new Set([
      currentYear,
      currentYear + 6,
      fireDate.year,
      fireDate.year + 14,
      fireDate.year + 24,
    ])].sort((a, b) => a - b);

    const chartData = fireService.calcProjectedWealth(
      netWorth,
      monthlySavings,
      state.pensionExpenses,
      fireDate.year,
      uniqueYears,
      weightedReturn,
    );

    return { netWorth, grossSWR, netSWR, fireTarget, firePercentage, abgabenQuote, monthlySavings, weightedReturn, fireDate, chartData };
  }, [state]);

  return (
    <FireContext.Provider value={{ state, updateField, ...computed }}>
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
