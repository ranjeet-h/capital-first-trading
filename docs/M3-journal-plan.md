# Journal build plan (M0 -> M1 -> M3, done properly)

Status: BUILT (committed in fad7e28, weekly review added after). Still open: auto-fill from Labs 1 and 2, Console importer. Owner chose "do it properly" (2026-11-11): build the foundation and money core first, then the journal. Field names: chosen by me from research (see Schema decisions).

## Order
1. **M0 foundation:** TS packages, build, tests, loader, storage, service worker, manifest, backup.
2. **M1 money core:** `core/costs` + Lab 2, `core/sizing` + Lab 1, facts registry read by code. Verified Zerodha charges (read 2026-11-11 from zerodha.com/charges: NSE exchange charge 0.00307% (0.00297% + 0.0001% IPFT), BSE 0.00375%, DP Rs 15.34 incl. GST, stamp 0.015%/0.003%, SEBI Rs 10/crore ; LABS.md now carries the corrected figure).
3. **M3 journal**, with auto-fill from Labs 1 and 2 included.

## Schema decisions (research: journals keep ~one record per position, R-multiple needs the initial stop, setup + emotion + deviation tags, start small)
Keep the LABS.md `journal_v1` list. Add `entry_type` (trade|note), optional `mae_inr`/`mfe_inr` (manual, optional), `tags`. One record per position, partial exits as child rows.


## Finding that shapes the plan
The repo has the book (mdBook + demo JS in `mdbook/theme/`) but **none of M0 or M1 exists as code**: no `packages/`, no TypeScript build, no service worker or manifest, no storage layer, no Labs 1 and 2. PLAN.md says the journal auto-fills from Labs 1 and 2, and LABS.md says manual entry must always work. So M3 builds a small slice of M0 first and treats auto-fill as a later add-on.

## Scope (in)
1. **Foundation slice (M0-lite):** `packages/core` (pure TypeScript, Vitest), `packages/ui` (custom elements), esbuild bundle into `mdbook/theme/dist/`, a loader that finds `<lab-journal>` on a page. Storage layer on IndexedDB with schema versions.
2. **`core/journal`:** `journal_v1` types, validation, money in paise, planned-field lock plus "amended after entry" flag, partial exits, `note` entry type (open item 8, excluded from stats).
3. **`core/stats`:** trade count, win rate, avg win/loss, payoff, expectancy (Rs and R), profit factor, equity and drawdown curves, max drawdown, streaks, plan adherence, cost drag, loss-limit breach log, R histogram, under-30-trades warning. Hand-computed 10-trade fixtures.
4. **`core/merge`:** merge by `trade_id`, newer `updated_at` wins, per-trade history, tombstones, conflict list.
5. **UI:** plan form (under 60 s), execution form, trade list with mode filter (modes never blended by default), dashboard, weekly review form, settings (capital, limits, checklist), backup reminders.
6. **Backup:** JSON and CSV export/import with preview, Web Share, optional AES-GCM passphrase encryption.
7. **Offline:** service worker and manifest (minimum to make the journal usable offline and installable).

## Scope (out, for later)
Auto-fill from Labs 1 and 2 (the form has manual fields and an `autofill` hook now), Zerodha Console importer, synced-folder auto-save, Lab 4 and Lab 5 imports, Sharpe ratio.

## Steps (each ends with passing tests)
1. Scaffold packages, build, Vitest, `make test`.
2. `journal` + `stats` + fixtures.
3. Storage + merge + encrypted backup, with round-trip tests.
4. UI: forms, list, dashboard.
5. PWA bits, offline check, phone-width pass.
6. Mount in the book as a new page under Track 8; update PLAN.md status.

## Decisions I will take unless you object
- Journal lives as a page inside the book (`<lab-journal>`), same origin, so offline caching is shared.
- Plain TypeScript custom elements, no React (as PLAN.md 5.1).
- Charts in hand-written SVG (no new dependency).
- `note` entry type added.

## Questions for you
1. Do you have the original CSV header (open item 1)? If not, I use the proposed fields in LABS.md.
2. OK to build the M0-lite foundation inside M3, even though M0 and M1 were skipped?
