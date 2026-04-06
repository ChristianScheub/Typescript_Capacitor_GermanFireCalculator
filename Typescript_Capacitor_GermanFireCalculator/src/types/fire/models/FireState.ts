export interface FireState {
  // I. Einnahmen & Sparen
  monthlyBrutto: number;       // €
  monthlyNetto:  number;       // €
  savingsRate:   number;       // % (25 = 25 %)
  // II. Portfolio
  etfBalance:    number;       // €
  cashBalance:   number;       // €
  cryptoBalance: number;       // €
  // III. Ausgaben & Abgaben
  currentExpenses:  number;   // € / Monat
  pensionExpenses:  number;   // € / Monat im Ruhestand
  isPkvUser:        boolean;
  pkvContribution:  number;   // € / Monat (PKV-Beitrag)
  hasKirchensteuer: boolean;
}
