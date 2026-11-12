# Capital-First Trading Study Book: Master Plan

Status: written 2026-11-11. Built so far, in the order M0, M1, M3 (the owner approved this order and asked for it "done properly"): the book, the foundation (storage, encrypted backup, offline service worker, installable manifest), the money core (Lab 2 cost calculator, Lab 1 position size), and the Lab 3 journal (plans, buys and sells in parts, review, dashboard, weekly review, backup and restore). Journal auto-fill from Labs 1 and 2 is done. The Zerodha Console tradebook importer is done too. Synced-folder auto-save and AGENTS.md are done. Labs 4 (strategy tester) and 5 (forward-test script and importer) have first versions shipped. Still open: walk-forward testing, real-data import adapters, a holiday calendar, split detection beyond a 20% jump check, a background worker for experiments, and the owner's 5-day real-use run of the forward script (M7 acceptance). See the status notes in LABS.md. There is no CI and none is planned: all checks run locally with `make`. Detail: docs/M3-journal-plan.md.
Companion file: [LABS.md](LABS.md) (detailed specs for the five labs).

This plan is the single reference for the coding agent. Where it says **OPEN**, the owner has not decided; the agent must not decide silently, it must ask.

---

## 1. Product in one paragraph

An offline-first, interactive study book that teaches Indian-market (NSE/BSE, Zerodha Kite) trading from zero, with capital preservation first. It runs in any browser on laptop, phone and tablet, installs as a PWA, needs no server or account, and keeps all user data on the device. It contains prose chapters, animations, quizzes, graduation gates and five hands-on labs. It never places orders and never talks to a broker.

## 2. Owner profile and goals (decisions already made)

| Topic | Decision |
|---|---|
| Owner | Senior software engineer (JS, Python, React, Node). Complete trading beginner. |
| Aim | Become a genuinely skilled trader over years; eventual second income is a hope, not a plan. Never promised. |
| Starting live capital | Small: Rs 10,000 to Rs 50,000, only after graduation gates. Reinvest profits; add money irregularly from spare income only, never household savings. |
| Withdrawals | None until a threshold the book's scaling policy computes. Never during a drawdown. |
| Style focus | End-of-day swing and positional, fixed loss per trade, trailing stop, no profit cap (trend following). |
| Intraday | Optional later module, paper-only, unlocked after gates. |
| Leverage / F&O | Theory only. No practice path. |
| Daily target Rs 2,000-3,000 | Must be shown honestly as unrealistic at this capital (needs roughly Rs 30 lakh+ at a very good 20% a year). Never used as a goal for any strategy. |
| Fit with low-win-rate style | Unknown to owner. Resolved by a losing-streak simulator (Lab 4 + chapter), not by assumption. |
| Platform | Fully offline, no server, no accounts, all data bundled or user-imported. Works on web, phone, tablet. |
| Data | Bundled **synthetic** data only. Real data is downloaded by the owner and imported through source adapters, with in-app instructions. No redistribution of exchange or Yahoo data. |

## 3. Non-negotiable constraints

1. No live order placement, no broker API calls, no stored credentials. Ever.
2. No server dependency at runtime. After first load and install, every page, lab and quiz works with the network off.
3. No CDN at runtime. Fonts, Mermaid, chart library and all scripts are self-hosted and precached.
4. Every rupee calculation is shown with a worked example and is covered by an automated test.
5. Every time-sensitive fact (charges, STT, tax rates, Zerodha plans, SEBI rules, market timings, holidays) comes from an official source, carries a verification date and source URL, and is stored in `data/facts.json` (see 8.3).
6. No copying of Zerodha Varsity or other copyrighted text. Original explanations, examples and diagrams only. Link out as references.
7. Do not invent Zerodha UI features. Use recreated interface illustrations, labelled "illustration, check your own Kite for the current layout", with a verification date.
8. Hypothetical, backtested and live results are always labelled as such. Nothing implies guaranteed returns.
9. Rust and Svelte are not introduced beyond the mdBook binary itself (see 5.1).

## 4. Learning design

### 4.1 Chapter pattern (every chapter)
1. Hook: a concrete rupee scenario or a mistake.
2. Concept, in plain language, from first principles.
3. Visual explanation (diagram or animation).
4. Worked example with rupee figures.
5. Interactive demo.
6. Guided exercise (hints available).
7. Independent exercise.
8. Quiz with explained answers for wrong choices.
9. Practical "paper" task (journal an entry, run a lab, or a Kite demo task).
10. "What this does NOT tell you": limits and common misuse.
11. Sources block: links plus verification dates.

Page types (like the frontend book): **Concept**, **Math/Calculator**, **Kite walkthrough**, **Strategy**, **Lab**, **Assessment**. Each has a template in `mdbook/templates/`.

### 4.2 Curriculum (draft, owner approved the order)

| Track | Chapters (initial list; agent may split, not drop) |
|---|---|
| 0 Start here | What trading is and is not; investing vs trading vs speculation; capital-first rules; how to use the book; graduation gates overview. |
| 1 Market foundations | Companies, exchanges, SEBI, NSE, BSE; demat and trading accounts; T+1 settlement; order matching, bid-ask, liquidity; circuit limits; indices; corporate actions; market timings and holidays. |
| 2 Money and math | Costs (brokerage, STT, GST, exchange, SEBI, stamp, DP) on Rs 5,000 and Rs 50,000; taxes on trading; position sizing; stop-loss distance; risk limits (trade, day, week, month); expectancy, win rate, profit factor; max drawdown; why a 90% win rate can lose money; risk of ruin; the Rs 2-3k reality check; compounding, scaling and withdrawal policy. |
| 3 Chart reading | Candles; timeframes; support and resistance; trend and structure; breakouts and breakdowns; gaps; volume. |
| 4 Kite and execution (demo only) | Interface; watchlists; market depth; order types (market, limit, SL, SL-M); CNC vs MIS; GTT; order book, trade book, holdings vs positions; cost preview; Console; common execution mistakes. |
| 5 Indicators | SMA/EMA; RSI; MACD; ATR; Bollinger Bands; Fibonacci; volume indicators; multi-timeframe; VWAP (optional, intraday). Each: math, interpretation, limits. |
| 6 Strategy | Styles compared against the owner's goals; one fully specified trend-following swing strategy; losing-streak simulator; why scalping, option selling, averaging down and martingale are dangerous. |
| 7 Testing | Hypothesis; backtesting; look-ahead and survivorship bias; overfitting; out-of-sample and walk-forward; costs and slippage; paper trading; forward testing. |
| 8 Psychology and journal | Loss aversion, FOMO, revenge trading, overconfidence, discipline; trading plan and checklist; journaling and review. |
| 9 Advanced (theory only) | Futures, options, Greeks, hedging; SEBI F&O study as a case study; algo trading and the SEBI retail algo framework (Algo-ID, broker compliance); FII/DII; microstructure. Explicit "not a shortcut" framing. |
| 10 Graduation gates | See 6. |

### 4.3 Interactive components (shared, reusable)
Each is a custom element with a documented attribute API, no global state, and tests. Initial set:

- `<order-flow-sim>`: order travels trader, broker, exchange, matching.
- `<order-book-sim>`: bids and asks update as orders arrive; spread and depth.
- `<candle-builder>`: ticks become OHLC candles at chosen timeframe.
- `<sl-trigger-sim>`: stop-loss trigger, SL vs SL-M, gap-through-stop.
- `<leverage-demo>`: how leverage magnifies gain and loss (theory chapter only).
- `<position-size-viz>`: shares vs stop distance.
- `<drawdown-compounding>`: recovery math (a 50% loss needs a 100% gain).
- `<streak-sim>`: lives through losing streaks at a given win rate and R.
- `<indicator-playground>`: parameters change, indicator redraws on sample data.
- `<pattern-quiz>`, `<predict-next>`, `<spot-the-mistake>`: assessment widgets.
- `<quiz-block>`, `<exercise-block>`, `<gate-check>`: structured assessment, state saved locally.
- `<kite-illustration>`: recreated Kite screens with annotations (see 4.5).
- Added to cover the owner's brief: `<sr-drawing-exercise>` (draw support/resistance, get scored against reference levels), `<pattern-identification>` (spot formations on charts, with honest limits), `<strategy-simulator>` (step a rule set through synthetic data), `<risk-limit-simulator>` (daily/weekly/monthly limits and stop rules; used by gate G4), `<capital-allocation-planner>` (how much to allocate, what stays untouched, when to cut or stop), `<journal-widget>` (quick log from any chapter into the Lab 3 journal).
- The five labs: `<lab-position-size>`, `<lab-costs>`, `<lab-journal>`, `<lab-backtest>`, `<lab-forward-import>`.

Animation rules: respect `prefers-reduced-motion`; every animation has Play/Pause/Step/Reset and a text alternative; all run on touch devices; no animation is the only way to learn something.

### 4.4 Quiz and exercise content format
Content lives as JSON files next to chapters (`mdbook/src/<track>/<chapter>/quiz.json`), validated by a JSON schema at build time. Fields: id, type (mcq, multi, numeric, order, spot-the-mistake, scenario), prompt, options, answer, explanation per wrong option, concept tags, difficulty, `reviewAfterDays`. Numeric questions accept a tolerance and show the worked solution.

### 4.5 Kite training rules
- Kite demo uses dummy data and is for interface practice. Zerodha does not provide a paper-trading account. The book must say so (verify wording on support.zerodha.com before writing).
- Practical Kite tasks are checklist exercises the owner does in their own demo; the book cannot verify them. Self-attested, with a short reflection field.
- Kite Connect: the free Personal plan has no market data; market data needs the paid plan. Mention only in the advanced/automation chapter, with the SEBI Algo-ID requirement. The book does not use it.

### 4.6 Authoring workflow (strict owner rule, 2026-11-11)
- **All large-text writing (chapters, sections, long prose, curriculum documents) is done by Haiku 5.5** (`claude-haiku-5-5`). A stronger model plans: it decides each chapter's structure and required content, writes the brief, and reviews the output. Code, tests, small edits and plans are not delegated.
- Each Haiku task gets one self-contained brief and writes one file. No "write the rest of the folder" tasks.
- **Review gate before a chapter counts as written:** rupee arithmetic recomputed, every time-sensitive fact traced to `data/facts.json` or marked provisional, safety wording checked (no advice, no guaranteed returns, no unlabelled hypothetical results), required sections present, no copied third-party text.
- Haiku must never invent Zerodha features, charges, tax rates or regulations. If unsure it writes `[VERIFY: <what>]` and the reviewer resolves it from an official source.
- Chapter-level objectives, prerequisites and dependencies live in `curriculum/` (see `curriculum/README.md`). **The files in `curriculum/` are authoritative for chapter lists; they extend and supersede the draft list in 4.2.** Additions beyond 4.2: risk framework (overtrading, max trades, consecutive-loss rules, reducing exposure, portfolio exposure, slippage, gap risk, planned vs actual execution risk), capital framework (how much to allocate, what stays untouched, when to cut or stop), primary vs secondary markets, auctions and order flow, price alerts, reversal/momentum/price-action strategies, support-and-resistance drawing and chart-pattern simulators.
- Tax calculator: deferred until tax rates are verified from an official source (default decision; owner can override).

## 5. Architecture

### 5.1 Decision: hybrid (mdBook for prose, a TypeScript component bundle for interactivity)

| Option | Maintainability | Interactivity | Offline/PWA | Authoring | Agent ease | Verdict |
|---|---|---|---|---|---|---|
| mdBook only, per-page JS/CSS (current books) | Poor at scale (manual `book.toml` registration) | Weak, untestable | Possible | Excellent | Easy | Rejected: labs need tests and shared code |
| Full React/Next app with MDX | Good | Excellent | Good | Good | Medium | Rejected: loses mdBook authoring and search the owner prefers; heavier |
| **mdBook + shared TS component bundle** | Good | Very good | Good | Excellent | Easy | **Recommended** |

Justification for TypeScript: the cost, sizing, statistics and backtest logic are money math and need typed, unit-tested pure functions shared by the UI, tests and the forward-test script. mdBook itself is a build tool the owner already uses; no Rust code is written. No Svelte. React is not needed: custom elements with a tiny render helper suffice. **OPEN (ratify):** owner confirms hybrid.

### 5.2 Repository layout
```
capital-first-trading/
├── PLAN.md  LABS.md  README.md  AGENTS.md  (AGENTS.md written in M0)
├── mdbook/
│   ├── book.toml
│   ├── src/                     # Markdown chapters, SUMMARY.md
│   │   └── <NN-track>/<NN-chapter>.md + quiz.json
│   ├── theme/                   # head.hbs, css, fonts (self-hosted)
│   └── templates/               # page-type templates
├── packages/
│   ├── core/                    # pure TS: costs, sizing, stats, indicators, backtest, adapters, strategy
│   └── ui/                      # custom elements, charts, quiz engine, storage layer
├── tools/
│   ├── build/                   # post-build: bundle, SW precache manifest, facts check
│   └── forward-test/            # Lab 5 Node/TS script (imports packages/core)
├── data/
│   ├── facts.json               # verified facts registry
│   └── synthetic/               # generated datasets + generator config
└── tests/
    ├── unit/ (in packages)  e2e/ (Playwright)  content/ (link, schema, facts, math checks)
```

### 5.3 Build pipeline
1. `packages/*` built with esbuild (or Vite library mode) into hashed ES modules in `mdbook/theme/dist/`.
2. A loader script (`head.hbs`) finds `[data-lab]` and custom elements on the page and dynamically imports only the needed chunks. No manual `book.toml` registration per component.
3. `mdbook build` produces the site.
4. `tools/build` post-processes: generates the precache manifest (every file plus content hash), writes `sw.js` with a versioned cache, writes `manifest.webmanifest` and icons, runs the facts staleness check.
5. Deploy the static output (GitHub Pages or Vercel, free tier). Hosting is only for first download; the app does not need it afterwards.

### 5.4 Offline and PWA
- Service worker precaches the entire site on install (a few MB to tens of MB; budget in 8.2). Navigation falls back to cached pages. Update flow: new version downloaded in background, "Update ready, reload" prompt, never auto-reload mid-lab.
- Manifest: standalone display, icons, theme colour. Installable on Android and desktop; "Add to Home Screen" instructions for iOS.
- Storage persistence: call `navigator.storage.persist()`; show current storage use. **iOS caveat:** Safari can evict site data after inactivity for sites not installed to the Home Screen. The app must detect this, tell the owner to install it, and nag for backups (see 5.5).
- mdBook search index is part of the precache, so search works offline.
- Chart rendering: candidate `lightweight-charts` (check licence and attribution at build time) with fallback to hand-written SVG/canvas for teaching animations. Everything bundled.

### 5.5 Persistence and backup
| Data | Store | Why |
|---|---|---|
| Settings, last-read, small progress flags | localStorage | Tiny, synchronous |
| Quiz attempts, gate status, journal, imported datasets, backtest runs, forward-test imports | IndexedDB (via a small wrapper in `packages/ui/storage`) | Larger, structured; localStorage (~5 MB) is too small for imported price data |
| Everything | Export/import as one versioned JSON backup file | Only way to move data between devices without a server |

Rules: schema version on every record; migrations tested; backup reminder if no export in 14 days (configurable); import validates and shows a diff before overwriting; nothing leaves the device.

### 5.6 Accessibility and responsive design
WCAG 2.2 AA target: keyboard operable, focus visible, colour is never the only signal (important for red/green P&L), labelled controls, reduced-motion support, screen-reader summaries for charts. Layouts tested at 360 px phone width, tablet, desktop. Touch targets at least 44 px. Numbers formatted in Indian grouping (₹1,23,456) with a toggle for plain grouping.

## 6. Assessment and graduation

Every gate is a checklist with measurable criteria stored locally. Passing is educational competence, not proof of profitability, and the UI says so on every gate screen. No pressure: gates can be retaken; there is no timer to "go live".

| Gate | Pass criteria (initial, owner may tune) |
|---|---|
| G1 Market knowledge | Quiz at least 85% on Tracks 0-1, plus explain-in-own-words prompts completed. |
| G2 Money math | Cost, position-size, expectancy numeric questions all correct within tolerance on a fresh randomised set; complete the Rs 2-3k reality check module. |
| G3 Kite readiness | Self-attested Kite demo checklist done; execution-mistake quiz at least 90%. |
| G4 Risk discipline | In the streak and risk-limit simulators, stop trading when the daily limit is hit in 10 of 10 scenarios (no revenge trade). |
| G5 Strategy validation | Run the Lab 4 backtest with costs and a held-out period; correctly explain the result, the biases and why it may not hold live. |
| G6 Paper/forward record | Journal at least 30 forward-test or paper trades, plan adherence at least 90%, no limit breaches. Number of trades and thresholds are OPEN: owner to confirm, since 30 trades is statistically thin. |
| G7 Live-readiness review | Written self-review: capital to be used, risk per trade, daily/weekly/monthly limits, stop rules, withdrawal policy. Book shows a printable one-page trading plan. |

Passing G1-G7 enables a "may consider small real-money stage" message with caveats. It never says "ready to profit".

## 7. Content and research standards

- Authoritative sources only: SEBI, NSE, BSE, Zerodha support and charges pages, Zerodha Varsity as reference. Academic sources for statistics and behavioural claims.
- Separate three things visibly: **established fact**, **widely used heuristic**, **hypothesis / contested**. Use labelled callouts.
- Each chapter ends with Sources (title, URL, accessed date). Time-sensitive numbers use the facts registry.
- Examples use real NSE large-cap names for context only and fictitious or synthetic prices for numbers, unless the owner-imported data is the exercise. No stock recommendations. A standing notice: this is education, not investment advice, and the author is not a SEBI-registered adviser (**OPEN:** owner to confirm wording).
- Plain language. Define jargon on first use. Rupee figures everywhere.
- Original diagrams. Mermaid for static diagrams; custom elements for animated ones.

### 7.1 Facts registry (`data/facts.json`)
Each entry: `id`, `value`, `unit`, `sourceUrl`, `verifiedOn`, `reviewEveryDays`, `notes`. Chapters and labs reference ids, never hard-code numbers. A build check fails if a referenced fact is older than its review window, and the UI shows "Verified on <date>" beside it, with a warning banner when stale. Initial facts to verify first: Zerodha equity delivery and intraday brokerage, STT, exchange transaction charges, SEBI fee, stamp duty, GST, DP charge, tax rates on short- and long-term gains and on business income, market hours, T+1 rule, circuit limit rules, Kite demo and API plan statements, retail algo framework dates. The Zerodha equity charges were verified on 2026-11-11 and live in `data/rates/zerodha-equity.json` (NSE exchange charge 0.00307% = 0.00297% + 0.0001% IPFT; rounding and the DP-charge exclusion are in LABS.md). Other facts remain unverified until their chapters are written.

## 8. Quality and testing

### 8.1 Test layers
- **Unit (Vitest):** every function in `packages/core` including edge cases; golden tests for cost engine against Zerodha's published worked examples and the official calculator; property tests (for example, shares x risk-per-share never exceeds the risk budget).
- **Component tests:** custom elements render, respond to input, restore state.
- **E2E (Playwright):** every page loads; labs work; quiz flow; **offline test** (install, switch network off, visit every page, run each lab, reload); backup export/import round trip; mobile viewport runs; iOS WebKit project included.
- **Content checks (run locally with `make check`):** broken links; every chapter has the required sections; quiz JSON schema; facts freshness; every number-with-rupee in a worked example is either computed by a tested function or flagged `<!-- hand-checked -->` with a reviewer note; spelling.
- **Accessibility:** axe checks in Playwright on a page sample plus every lab.
- **Performance budgets:** see 8.2.

### 8.2 Budgets (initial; revise with data)
- First meaningful load on mid-range phone over 4G: under 3 s for a chapter page without labs.
- Total precache size: under 60 MB (target 30 MB). Synthetic datasets compressed.
- Each lab chunk: under 250 KB gzipped, loaded only on the pages that use it.
- Backtest of 5 years daily data on 1 stock: under 1 s on a mid-range phone, runs in a Web Worker.

### 8.3 Reviewing time-sensitive content
A monthly "facts review" task is documented in AGENTS.md. A stale fact never silently displays as current.

## 9. Milestones

Each milestone ends with a working, deployable, offline-capable build and passes its tests. Do not start the next milestone with failing tests.

| M | Deliverable | Acceptance (summary) |
|---|---|---|
| M0 Foundation | Repo scaffold, mdBook + TS build, loader, service worker, manifest, storage layer, backup/export, AGENTS.md, one sample chapter with one sample component. | Installs as PWA on Android Chrome, iOS Safari (Home Screen) and desktop; sample page works fully offline; local `make` checks green; backup round trip works. |
| M1 Money core | `packages/core` costs and sizing with golden tests; facts registry v1 with verified Zerodha charges. **Lab 2 and Lab 1** shipped. | Lab 1 and 2 pass LABS.md acceptance; verification dates shown; stale-fact banner tested. |
| M2 Tracks 0-2 content | Tracks 0, 1 and 2 chapters with animations, quizzes, reality-check module, streak simulator, gates G1-G2. Until M3 ships, "log it in your journal" paper tasks are done on paper. | Every chapter has all pattern elements; all quizzes validate; gates G1-G2 functional. |
| M3 **Journal (Lab 3 MVP)** | **Starts only after the owner explicitly approves pausing book work** (decided 2026-11-11: book first, then journal; the agent must ask before diverting). Scope: `journal_v1` schema, plan and execution forms with auto-fill from Labs 1 and 2 (manual override allowed), `core/stats` with tests, dashboard with equity and drawdown curves and R histogram, filters by mode, weekly review form, JSON/CSV export and import, merge with `updated_at`/tombstones, Web Share, optional encryption, backup reminders. Works on phone and desktop, offline. Target: ready before the owner's first Kite demo or paper trade. | Lab 3 acceptance (LABS.md) except items that need Lab 5; hand-computed fixtures match; export on device A and import on device B merges correctly; installable PWA. |
| M4 Tracks 3-5 content | Charts, Kite (illustrations), indicators; indicator playground; candle builder; gate G3. | As M2 for these tracks. |
| M5 Backtester | Data adapters, synthetic generator, **Lab 4** with bias demos and walk-forward. Track 7 content. | LABS.md acceptance; reproducible seeded results. |
| M6 Strategy and psychology | Track 6 (full trend-following spec shared by Lab 4 and Lab 5), Track 8, gates G4-G5. | Strategy spec JSON loads identically in backtester and script. |
| M7 Forward test | **Lab 5** script and `<lab-forward-import>`, import docs for each data source, gate G6. | LABS.md acceptance; script runs on owner's machine for 5 consecutive trading days without manual fixes. |
| M8 Advanced theory | Track 9, gate G7, printable trading plan. | Content standards met; F&O framed as theory only. |
| M9 Hardening | Accessibility audit, performance pass, offline soak test (7-day), content review of every fact, README, release. | All budgets met; zero open P1 issues. |

Having the journal does not unlock live trading; the gates in section 6 still decide that. Journal entries made before the gates are marked `paper`, `kite_demo` or a learning note, never `live`. Book milestones can run in parallel with code milestones if different agents own different folders, but the switch from book work to the journal (M3) needs the owner's approval first.

## 10. Definition of done (any chapter or feature)
1. Matches the page-type template and chapter pattern.
2. All numbers computed by tested code or explicitly hand-checked.
3. Time-sensitive facts come from the registry with dates.
4. Works offline, on 360 px width, with keyboard only, and with reduced motion.
5. Quizzes validated, wrong-answer explanations written.
6. Sources listed; no copied third-party text.
7. Tests added and passing locally (`make test`, `make e2e`).
8. No unlabelled hypothetical returns.

## 11. Open items for the owner

1. **Journal CSV spec:** the pasted spec was cut off after "Fields (one row per trade; CSV header)". Lab 3 uses a proposed field list; replace it if you have the original.
2. Ratify the hybrid architecture (5.1).
3. Confirm G6 thresholds (trade count, adherence) and the disclaimer wording.
4. Confirm whether the deployed site will be public or private. This affects data licensing (we bundle only synthetic data either way).
5. Confirm the forward-test script runs on your laptop (Node) and which data source you prefer by default (Yahoo via `yahoo-finance2` or NSE files).
6. Verify current NSE terms for bhavcopy use before an NSE adapter is documented as supported.
7. Tax rates and the owner's own tax status (delivery gains vs business income) must be verified with an official source or a tax professional before the tax chapter is written.
8. **Learning-note entries (found during chapter drafting, 2026-11-11):** chapters ask the reader to log "learning notes", but the Lab 3 `mode` list is paper, live, forward, backtest, kite_demo. Proposed: add a non-trade entry type `note` (excluded from all trade statistics). Decide before M3.
9. **Rs 2,000-3,000 wording:** the curriculum specs sometimes call it "a ceiling"; the book text calls it "your daily profit aspiration", never a target to chase. Confirm.
10. **Chapter drafts need a review pass:** Tracks 0-2 drafts exist in `mdbook/src/` (31 chapters). Every `[VERIFY]` tag and `<!-- OPEN -->` comment must be resolved before release; dummy cost numbers in T2.2, T2.12 and T2.16 are replaced by Lab 2's verified figures.
