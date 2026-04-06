export interface FireState {
  // I. Sparrate (direkt in €)
  monthlySavingsAmount: number;  // € / Monat

  // II. Portfolio
  etfBalance:    number;  // €
  etfRate:       number;  // % p.a.
  cashBalance:   number;  // €
  cashRate:      number;  // % p.a.
  cryptoBalance: number;  // €
  cryptoRate:    number;  // % p.a.

  // III. Ruhestand Budget
  fixedExpenses:    number;  // € / Monat (Fixkosten OHNE Krankenversicherung)
  variableExpenses: number;  // € / Monat (variable Kosten)

  // IV. KV & Steuer
  isPkvUser:        boolean;
  pkvContribution:  number;  // € / Monat
  hasKirchensteuer: boolean;

  // V. Rente
  currentAge:    number;  // Jahre
  pensionAge:    number;  // staatliches Rentenalter in Jahren
  pensionMonthly: number; // € / Monat (staatliche Rente)
}
