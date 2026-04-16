// Central constants for all FIRE calculations.
// Config files are intentionally exempt from the magic-number lint rule.

export const FIRE_CONSTANTS = {
  ANNUAL_INFLATION:      0.02,   // 2 % p.a.
  ABGELTUNGSSTEUER_RATE: 0.25,   // 25 % Abgeltungssteuer
  SOLI_RATE:             0.055,  // 5,5 % Solidaritätszuschlag (auf Steuer)
  KIRCHENSTEUER_RATE:    0.08,   // 8 % (BY/BW-Regelfall)
  SPARER_PAUSCHBETRAG:   1000,   // € / Jahr (gesetzlicher Freibetrag)
  ETF_TEILFREISTELLUNG:  0.3,    // 30 % steuerfreier Anteil bei Aktien-ETFs
  SWR_RATE:              0.04,   // Safe Withdrawal Rate (4 %-Regel)
  ANNUAL_RETURN:         0.07,   // 7 % nominale ETF-Jahresrendite
  GKV_RATE:              0.21,  // ~21 % GKV-Schätzung auf Kapitalerträge
  GKV_MAX_MONTHLY:       1300,  // € / Monat — GKV-Beitragshöchstgrenze
  GAIN_RATIO:            0.5,    // 50 % Gewinnanteil (Simulationsannahme Entnahme)
  YEARS_TO_PENSION:          14,    // Abstand FIRE-Datum → gesetzliche Rente (Jahre)
  STATUTORY_PENSION_MONTHLY: 1450,  // Geschätzte gesetzl. Rente p.m. (Orientierungswert)
  CRASH_FACTOR:              0.8,   // Depot-Abschlag im Börsen-Sturm-Szenario
  TEILZEIT_FACTOR:           0.7,   // Sparraten-Reduktion im Teilzeit-Turbo-Szenario (30%)
  HARDCORE_FIRE_FACTOR:      0.5,   // Variablekosten-Reduktion im Hardcore-FIRE-Szenario
} as const;
