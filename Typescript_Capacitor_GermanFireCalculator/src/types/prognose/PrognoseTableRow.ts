export interface PrognoseTableRow {
  year:      number;
  badge:     string;     // ANSPAREN | FIRE BEGINN | FIRE-RENTE | STAATLICHE RENTE BEGINN
  isFeatured: boolean;   // FIRE year gets highlighted card
  // Entnahme
  entnahmeTotalFormatted: string;
  entnahmeEtfFormatted:   string;
  entnahmeCashFormatted:  string;
  // Vermögen
  totalValueFormatted: string;
  etfValueFormatted:   string;
  cashValueFormatted:  string;
  // Rendite
  renditeTotalFormatted: string;
  etfRateDisplay:        string;
  cashRateDisplay:       string;
  // State helpers
  isToday:   boolean;
  isFire:    boolean;
  isPension: boolean;
}
