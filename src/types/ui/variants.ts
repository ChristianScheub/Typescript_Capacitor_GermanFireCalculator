/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UI Component Variants – Centralized Type Definitions
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file serves as the single source of truth for all variant types used
 * across UI components. By centralizing these types, we ensure consistency
 * and make it easy to update variants globally.
 */

/* ── Icon & Color Variants ──────────────────────────────────────────────────── */

/**
 * Icon background color variants used in KpiCard, InputCard, and section headers.
 * Maps directly to CSS classes like `.kpi-icon--green`, `.section-icon--teal`.
 */
export type IconVariant = 'green' | 'teal' | 'red' | 'orange' | 'gray';

/**
 * Nav list icon background variants used in MenuView.
 * Maps to CSS classes like `.nav-list__icon-box--red`.
 */
export type NavIconVariant = 'red' | 'gray' | 'green' | 'primary';

/**
 * Badge style variants for positive, warning, and danger states.
 * Used in KpiCard badges and other badge components.
 */
export type BadgeVariant = 'positive' | 'warn' | 'danger' | 'neutral';

/* ── Card Variants ──────────────────────────────────────────────────────────── */

/**
 * Milestone card display variants.
 * - 'default': Standard milestone marker
 * - 'fire': Highlighted FIRE milestone
 */
export type MilestoneVariant = 'default' | 'fire';

/**
 * Stat card style variants used in MonteCarloView.
 * - 'success': Success state (used as default)
 * - 'pessimistic': Pessimistic scenario variant
 * - 'positive': Positive scenario variant
 */
export type StatCardVariant = 'success' | 'pessimistic' | 'positive';

/**
 * Content section (InputCard) layout variants.
 * - 'input': Input form section variant (MonteCarloView style)
 * - 'section': General content section variant (PlannerView style)
 */
export type ContentSectionVariant = 'input' | 'section';

/* ── Scenario Analysis Card Variants ────────────────────────────────────────── */

/**
 * Scenario type badge variants categorizing the scenario.
 * - 'lifestyle': Lifestyle/savings scenario (Teilzeit, Hardcore)
 * - 'risk': Risk scenario (Market crash)
 * - 'simulation': Simulation scenario (Monte Carlo)
 */
export type ScenarioTypeBadgeVariant = 'lifestyle' | 'risk' | 'simulation';

/**
 * Scenario result badge variants indicating outcome severity.
 * - 'warn': Warning state (delayed timeline)
 * - 'danger': Danger state (significant impact)
 * - 'positive': Positive state (improved timeline)
 */
export type ScenarioResultBadgeVariant = 'warn' | 'danger' | 'positive';

/* ── Type Aliases for Convenience ───────────────────────────────────────────── */

/**
 * Union of all common status/sentiment variants used across components.
 */
export type StatusVariant = BadgeVariant | StatCardVariant;
