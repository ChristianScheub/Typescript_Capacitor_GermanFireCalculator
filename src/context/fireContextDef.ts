import { createContext } from 'react';
import type { FireState } from '../types/fire/models/FireState';
import type { ChartDataPoint } from '../types/fire/models/ChartDataPoint';

export interface FireContextType {
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

export const FireContext = createContext<FireContextType | null>(null);
