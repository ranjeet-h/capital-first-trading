# Curriculum specs

Chapter-by-chapter specifications for the study book. These are **specs for the
builder and for chapter authors**, not the finished chapters.

| File | Tracks | Status |
|---|---|---|
| `tracks-0-2.md` | T0 Start here, T1 Market foundations, T2 Money and math | draft, reviewed |
| `tracks-3-6.md` | T3 Chart reading, T4 Kite and execution (demo only), T5 Indicators, T6 Strategy | draft, reviewed |
| `tracks-7-10.md` | T7 Testing and validation, T8 Psychology and journaling, T9 Advanced (theory only), T10 Graduation gates | draft, reviewed |

## How to use

- Each chapter has a stable ID (`T<track>.<n>`). IDs never change; they key quiz items, progress and journal links.
- `PLAN.md` is the source of truth for scope and decisions; `LABS.md` for lab behaviour. If a spec here disagrees with them, `PLAN.md` / `LABS.md` win and the spec is fixed.
- Every number that can change (charges, taxes, limits, timings, dates) is marked `[VERIFY: ...]` or listed under "Facts to register". It goes into `data/facts.json` with a source URL and a verified-on date. Nothing time-sensitive is hard-coded in prose.

## Authoring rules (summary of PLAN.md section 4.6)

1. Large text is written by Haiku 5.5 subagents from a brief; the main model plans, briefs and reviews.
2. A spec is accepted only after review: rupee arithmetic recomputed, facts traced or tagged `[VERIFY]`, no advice or guarantee wording, required sections present.
3. Kite content uses the demo or recreated illustrations only. The book never places or instructs live orders.
4. Wording is original; no copying from Varsity or other books.

## Open questions

Each file ends with "Open questions for the reviewer" and "Facts to register". Those lists are what remain before a chapter can be written as final prose.
