export interface PrognoseTableRow {
  year: number;
  // Wealth sub-lines
  totalValueFormatted: string;
  etfValueFormatted:   string;
  cashValueFormatted:  string;
  // Income / withdrawal columns
  incomeFormatted:     string;
  withdrawalFormatted: string;
  // Display helpers
  rowClassName: string;
  isToday:  boolean;
  isFire:   boolean;
  isPension: boolean;
}
