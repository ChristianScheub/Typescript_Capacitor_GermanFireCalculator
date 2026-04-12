export interface MonteCarloForPrognosisResult {
  fanData: Array<{
    age: number;
    year: number;
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  }>;
  zielwert: string;
  erfolgsrate: string;
  risikoLabel: string;
  risikoColor: string;
}
