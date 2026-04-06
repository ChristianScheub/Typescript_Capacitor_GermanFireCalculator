export interface FireState {
  // I. Einnahmen & Sparen
  monthlyBrutto: number;       // €
  monthlyNetto:  number;       // €
  savingsRate:   number;       // % (25 = 25 %)
  // II. Portfolio
  etfBalance:    number;       // €
  etfRate:       number;       // % p.a. (erwartete Rendite, e.g. 7)
  cashBalance:   number;       // €
  cashRate:      number;       // % p.a. (Zinssatz Tagesgeld, e.g. 2)
  cryptoBalance: number;       // €
  cryptoRate:    number;       // % p.a. (erwartete Rendite, e.g. 15)
  // III. Ausgaben & Abgaben
  pensionExpenses:  number;   // € / Monat im Ruhestand
  isPkvUser:        boolean;
  pkvContribution:  number;   // € / Monat (PKV-Beitrag)
  hasKirchensteuer: boolean;
}
