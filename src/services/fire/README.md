# Fire Service

Singleton facade for all FIRE (Financial Independence, Retire Early) calculations.

## Responsibilities
- Net worth & Safe Withdrawal Rate (SWR) calculation
- German tax engine: Abgeltungssteuer, Soli, Kirchensteuer, Sparerpauschbetrag
- GKV vs. PKV health insurance cost estimation
- FIRE target date projection using compound interest model
- Wealth projection chart data for the portfolio growth visualisation

## Folder structure
- `index.ts` – public facade (`fireService` singleton implementing `IFireService`)
- `IFireService.ts` – re-exports the interface from `types/`
- `logic/fireConfig.ts` – all domain constants (rates, limits, ratios)
- `logic/netWorthCalc.ts` – net worth & gross SWR
- `logic/taxCalc.ts` – Abgaben-Quote & net SWR
- `logic/fireCalc.ts` – FIRE target & percentage
- `logic/projectionCalc.ts` – monthly savings & FIRE date
- `logic/wealthProjection.ts` – chart data points over time
- `logic/formatters.ts` – currency and percentage formatting helpers
