// Central constants for all FIRE calculations.
// Config files are intentionally exempt from the magic-number lint rule.

export const FIRE_CONSTANTS = {
  ANNUAL_INFLATION:      0.02,   // 2 % p.a.
  ABGELTUNGSSTEUER_RATE: 0.25,   // 25 % Abgeltungssteuer
  SOLI_RATE:             0.055,  // 5,5 % Solidaritätszuschlag (auf Steuer)
  KIRCHENSTEUER_RATE:    0.08,   // 8 % (BY/BW-Regelfall)
  SPARER_PAUSCHBETRAG:   1000,   // € / Jahr (gesetzlicher Freibetrag)
  ETF_TEILFREISTELLUNG:  0.30,   // 30 % steuerfreier Anteil bei Aktien-ETFs
  SWR_RATE:              0.04,   // Safe Withdrawal Rate (4 %-Regel)
  ANNUAL_RETURN:         0.07,   // 7 % nominale ETF-Jahresrendite
  GKV_RATE:              0.185,  // ~18,5 % GKV-Schätzung auf Kapitalerträge
} as const;
