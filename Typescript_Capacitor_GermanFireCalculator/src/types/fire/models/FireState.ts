export interface FireState {
  // I. Sparrate (direkt in €)
  monthlySavingsAmount: number;  // € / Monat

  // II. Portfolio
  etfBalance:        number;  // €
  etfRate:           number;  // % p.a. (erwartete Rendite für Projektion)
  etfWithdrawalRate: number;  // % p.a. (sichere Entnahmerate)
  cashBalance:       number;  // €
  cashRate:          number;  // % p.a. (nur Zinsen zählen, kein Kapitalverzehr)

  // III. Ruhestand Budget
  fixedExpenses:    number;  // € / Monat (Fixkosten OHNE Krankenversicherung)
  variableExpenses: number;  // € / Monat (variable Kosten)

  // IV. KV & Steuer
  isPkvUser:        boolean;
  pkvContribution:  number;  // € / Monat
  assetTaxRate:     number;  // % — pauschale Steuer auf Kapitalerträge (z. B. 26.375)

  // V. Rente
  currentAge:    number;  // Jahre
  pensionAge:    number;  // staatliches Rentenalter in Jahren
  pensionMonthly: number; // € / Monat (staatliche Rente)
}
