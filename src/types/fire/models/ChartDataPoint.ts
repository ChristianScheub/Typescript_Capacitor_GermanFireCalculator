export interface ChartDataPoint {
  year:      number;
  value:     number;   // total = etfValue + cashValue
  etfValue:  number;
  cashValue: number;
  label:     string;
  sublabel?: string;
  isFIRE:    boolean;
}
