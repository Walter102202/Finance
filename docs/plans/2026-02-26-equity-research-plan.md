# Equity Research — Cobertura Completa: Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up a reusable, sell-side professional equity research pipeline using the financial-analysis and equity-research plugins, ready to initiate coverage on any company.

**Architecture:** Sequential pipeline with 9 steps — steps 1-5 run once per coverage initiation, steps 6-9 run on recurring schedules. Each step uses a plugin slash command that generates Excel (.xlsx with live formulas) or Word (.docx) outputs into a structured directory tree per ticker.

**Tech Stack:** Claude Code plugins (financial-analysis + equity-research), Excel (.xlsx), Word (.docx), public data sources (Yahoo Finance, SEC EDGAR, FRED).

---

## Task 0: Create Directory Structure and Verify Plugins

**Files:**
- Create: `coverage/` (empty, will be populated per ticker)
- Create: `templates/` (will hold reusable templates)

**Step 1: Verify plugins are installed**

Run:
```bash
claude plugin list
```
Expected: Both `financial-analysis` and `equity-research` should appear in the output.

**Step 2: Create the base directory structure**

Run:
```bash
mkdir -p coverage templates
```

**Step 3: Verify structure**

Run:
```bash
ls -la
```
Expected: `coverage/`, `templates/`, `docs/` directories exist.

---

## Task 1: Create Coverage Directory for Target Ticker

> This task is parametric. Replace `{TICKER}` with the actual ticker when executing (e.g., MELI, WALMEX, BIMBO).

**Files:**
- Create: `coverage/{TICKER}/03-valuation/`
- Create: `coverage/{TICKER}/04-financial-model/`
- Create: `coverage/{TICKER}/05-initiation-report/`
- Create: `coverage/{TICKER}/08-earnings/`
- Create: `coverage/{TICKER}/09-morning-notes/`

**Step 1: Create the full directory tree for the ticker**

Run:
```bash
TICKER="XXXX"  # Replace with actual ticker
mkdir -p "coverage/$TICKER/03-valuation" \
         "coverage/$TICKER/04-financial-model" \
         "coverage/$TICKER/05-initiation-report" \
         "coverage/$TICKER/08-earnings" \
         "coverage/$TICKER/09-morning-notes"
```

**Step 2: Verify**

Run:
```bash
find "coverage/$TICKER" -type d | sort
```
Expected: All 5 subdirectories created under `coverage/{TICKER}/`.

---

## Task 2: Sector Overview (Step 1 of Pipeline)

**Plugin command:** `/sector-overview`

**Files:**
- Create: `coverage/{TICKER}/01-sector-overview.docx`

**Step 1: Run sector overview**

Execute:
```
/sector-overview {SECTOR_NAME}
```

Provide context:
- Sector name (e.g., "E-commerce LATAM", "Mexican Banking", "US Cloud Software")
- Geographic focus
- Request output as .docx with the following sections:
  1. Market size & growth (TAM/SAM/SOM)
  2. Key growth drivers and headwinds
  3. Competitive landscape with market share data
  4. Regulatory environment
  5. Sector-specific KPIs and benchmarks

**Step 2: Save output**

Save the generated document to: `coverage/{TICKER}/01-sector-overview.docx`

**Step 3: Review and validate**

Open the document and verify:
- [ ] TAM/SAM/SOM figures have cited sources
- [ ] At least 5 competitors listed with market share
- [ ] Regulatory section covers relevant jurisdictions
- [ ] KPIs are quantified (not just named)

---

## Task 3: Idea Generation (Step 2 of Pipeline)

**Plugin command:** `/idea-generation`

**Files:**
- Create: `coverage/{TICKER}/02-idea-generation.docx`

**Step 1: Run idea generation**

Execute:
```
/idea-generation {SECTOR_NAME}
```

Provide context:
- Reference the sector overview from Task 2
- Screening criteria: minimum market cap, liquidity threshold, exchange listing
- Request the following structure:
  1. Long list (10-15 candidates) with basic metrics
  2. Filters applied (market cap > $X, daily volume > $Y, etc.)
  3. Short list (3-5) with preliminary investment thesis for each
  4. Final recommendation with justification for the target

**Step 2: Save output**

Save to: `coverage/{TICKER}/02-idea-generation.docx`

**Step 3: Review and validate**

- [ ] Long list has at least 10 names with tickers and basic multiples
- [ ] Filters are explicitly stated and quantified
- [ ] Short list has 1-paragraph thesis per name
- [ ] Final recommendation has clear "why this one" reasoning

---

## Task 4: Comparable Company Analysis (Step 3a of Pipeline)

**Plugin command:** `/comps-analysis`

**Files:**
- Create: `coverage/{TICKER}/03-valuation/comps-analysis.xlsx`
- Create: `templates/comps-template.xlsx` (save as template on first run)

**Step 1: Run comps analysis**

Execute:
```
/comps {TICKER}
```

Provide context:
- Peer group: 6-10 comparable companies (from idea generation short list + global peers)
- Metrics to include: EV/EBITDA (NTM & LTM), P/E (NTM & LTM), P/B, EV/Revenue, ROE, Revenue Growth, EBITDA Margin
- Calculate: mean, median, and implied valuation for target at each multiple
- Data source: Yahoo Finance, most recent annual filings

**Step 2: Verify .xlsx has live formulas**

Open the file and check:
- [ ] Multiples are calculated from underlying data (not hardcoded)
- [ ] Median/mean rows use MEDIAN()/AVERAGE() formulas
- [ ] Implied valuation links to target's financial data
- [ ] Formatting: headers, number formats, conditional highlighting

**Step 3: Save as template**

Copy `comps-analysis.xlsx` to `templates/comps-template.xlsx` (strip company-specific data, keep structure and formulas).

---

## Task 5: DCF Model (Step 3b of Pipeline)

**Plugin command:** `/dcf-model`

**Files:**
- Create: `coverage/{TICKER}/03-valuation/dcf-model.xlsx`
- Create: `templates/dcf-template.xlsx` (save as template on first run)

**Step 1: Run DCF model**

Execute:
```
/dcf {TICKER}
```

Provide context:
- Projection period: 5 years explicit + terminal value
- FCF build-up: Revenue → EBITDA → EBIT → NOPAT → FCF (capex, WC changes)
- WACC inputs: risk-free rate (10Y Treasury), equity risk premium, beta (from peers), cost of debt, tax rate, D/E ratio
- Terminal value: both perpetuity growth method AND exit multiple method
- Scenarios: Base / Bull / Bear with key assumption differences
- Sensitivity tables: WACC vs. terminal growth rate, WACC vs. exit multiple

**Step 2: Verify .xlsx structure**

- [ ] Assumptions sheet with clearly labeled inputs (colored cells)
- [ ] FCF projection sheet with formulas linked to assumptions
- [ ] WACC calculation sheet
- [ ] Terminal value sheet (both methods)
- [ ] Valuation summary with implied price per share
- [ ] Sensitivity tables with DATA TABLE formulas
- [ ] 3 scenario tabs (base/bull/bear)

**Step 3: Save as template**

Copy to `templates/dcf-template.xlsx` (strip specific data, keep structure).

---

## Task 6: Three-Statement Financial Model (Step 4 of Pipeline)

**Plugin command:** `/3-statements`

**Files:**
- Create: `coverage/{TICKER}/04-financial-model/3-statements.xlsx`
- Create: `templates/3-statements-template.xlsx`

**Step 1: Run three-statement model**

Execute:
```
/3-statements {TICKER}
```

Provide context:
- Historical data: 3-5 years from most recent annual filings
- Projections: 5 years forward
- Income Statement: revenue by segment, COGS, gross margin, OpEx breakdown, EBITDA, EBIT, net income, EPS
- Balance Sheet: current assets (detail WC), PP&E, intangibles, current liabilities, long-term debt, equity
- Cash Flow: CFO (from NI + adjustments), CFI (capex, acquisitions), CFF (debt, dividends, buybacks)
- Auxiliary sheets: assumptions, revenue bridge, margin analysis, debt schedule

**Step 2: Verify model integrity**

- [ ] BS balances (Assets = Liabilities + Equity) for all periods
- [ ] CF ties to BS changes (ending cash = beginning + net CF)
- [ ] Revenue build-up sums to total revenue on IS
- [ ] All projection cells reference assumptions sheet
- [ ] Circular reference handling for interest expense (if applicable)
- [ ] Historical vs projected columns clearly distinguished (formatting)

**Step 3: Save as template**

Copy to `templates/3-statements-template.xlsx`.

---

## Task 7: Initiating Coverage Report (Step 5 of Pipeline)

**Plugin command:** `/initiating-coverage`

**Files:**
- Create: `coverage/{TICKER}/05-initiation-report/initiation-{TICKER}-{DATE}.docx`
- Create: `templates/initiation-template.docx` (first run)

**Step 1: Run initiation report**

Execute:
```
/initiating-coverage {TICKER}
```

Provide context — reference ALL prior outputs:
- Sector overview from Task 2
- Idea generation from Task 3
- Comps analysis from Task 4
- DCF model from Task 5
- Three-statement model from Task 6

Request the following structure (~20-40 pages):

1. **Cover page:** Company name, ticker, exchange, rating, target price, analyst name, date
2. **Executive Summary** (1 page): Rating, target price, upside %, 3-bullet thesis
3. **Investment Thesis** (3-5 pages): 3-5 pillar arguments with evidence
4. **Company Overview** (2-3 pages): Business model, segments, management, history
5. **Sector Analysis** (2-3 pages): Summarize sector overview
6. **Financial Analysis** (3-5 pages): Historical trends, margins, returns, leverage
7. **Valuation** (3-5 pages): Comps summary table, DCF summary, target price derivation
8. **Financial Model Summary** (2-3 pages): Key projections, assumptions table
9. **Risks** (2-3 pages): 5-8 risks with probability (H/M/L) and impact (H/M/L)
10. **Appendices**: Detailed financial tables, comps detail, DCF sensitivity
11. **Disclaimer**: Standard sell-side legal disclaimer

**Step 2: Review document quality**

- [ ] Rating is one of: Buy / Overweight / Hold / Underweight / Sell
- [ ] Target price matches DCF output (or weighted DCF + comps)
- [ ] Upside/downside calculated correctly from current price
- [ ] All pillar arguments have supporting data
- [ ] Risk section covers: macro, competitive, regulatory, execution, valuation
- [ ] Disclaimer present and complete

---

## Task 8: Thesis Tracker Setup (Step 6 of Pipeline — Ongoing)

**Plugin command:** `/thesis-tracker`

**Files:**
- Create: `coverage/{TICKER}/06-thesis-tracker.xlsx`

**Step 1: Initialize thesis tracker**

Execute:
```
/thesis-tracker {TICKER}
```

Provide context:
- Extract thesis pillars from the initiation report (Task 7)
- For each pillar, define: KPI to track, expected value, current value, status
- Rating scale: conviction 1-5
- Include a change log sheet

**Step 2: Verify tracker structure**

- [ ] Sheet 1 "Thesis": pillar, description, KPI, expected, actual, status (On Track/At Risk/Broken)
- [ ] Sheet 2 "Change Log": date, trigger, pillar affected, old status, new status, notes
- [ ] Sheet 3 "Rating": current rating, target price, conviction score, last updated
- [ ] Conditional formatting on status column (green/yellow/red)

**Ongoing usage:** Run `/thesis-tracker {TICKER}` weekly or after material events to update.

---

## Task 9: Catalyst Calendar Setup (Step 7 of Pipeline — Ongoing)

**Plugin command:** `/catalyst-calendar`

**Files:**
- Create: `coverage/{TICKER}/07-catalyst-calendar.xlsx`

**Step 1: Initialize catalyst calendar**

Execute:
```
/catalyst-calendar {TICKER}
```

Provide context:
- Known dates: next 4 quarterly earnings, annual meeting, investor day
- Sector events: regulatory deadlines, industry conferences
- Macro events: central bank meetings, GDP releases relevant to the company
- For each: date, event name, expected impact (+/-/neutral), magnitude (H/M/L), recommended action

**Step 2: Verify calendar structure**

- [ ] Columns: Date, Event, Category (Earnings/Regulatory/Macro/Corporate), Impact, Magnitude, Action, Status
- [ ] Status: Upcoming / Passed / Cancelled
- [ ] Sorted by date ascending
- [ ] Conditional formatting by status and impact

**Ongoing usage:** Update monthly and ad-hoc as new events emerge.

---

## Task 10: Earnings Preview (Step 8a — Pre-Earnings)

**Plugin command:** `/earnings-preview`

**Files:**
- Create: `coverage/{TICKER}/08-earnings/{QUARTER}/earnings-preview.docx`

**Step 1: Create quarter directory**

Run:
```bash
QUARTER="Q1-2026"  # Replace with actual quarter
mkdir -p "coverage/$TICKER/08-earnings/$QUARTER"
```

**Step 2: Run earnings preview (1-2 weeks before earnings date)**

Execute:
```
/earnings-preview {TICKER} {QUARTER}
```

Provide context:
- Your model's estimates for the quarter (from 3-statements model)
- Consensus estimates (if available from public sources)
- Key metrics to watch (revenue by segment, margins, guidance)
- Recent news/events that could affect results

Request structure:
1. Consensus vs. model estimates table
2. Key metrics to watch (3-5 with thresholds for beat/miss)
3. Market reaction scenarios (beat/inline/miss with expected move)
4. Positioning recommendation

**Step 3: Verify**

- [ ] Estimates table has: Revenue, EBITDA, EPS at minimum
- [ ] Model vs consensus delta highlighted
- [ ] Reaction scenarios are specific (e.g., "+3-5% if revenue beats by >5%")

---

## Task 11: Earnings Analysis (Step 8b — Post-Earnings)

**Plugin command:** `/earnings-analysis`

**Files:**
- Create: `coverage/{TICKER}/08-earnings/{QUARTER}/earnings-analysis.docx`

**Step 1: Run earnings analysis (day of or day after earnings)**

Execute:
```
/earnings-analysis {TICKER} {QUARTER}
```

Provide context:
- Actual reported results
- Your preview estimates (from Task 10) and consensus
- Management commentary highlights from the call/press release
- Any guidance changes

Request structure:
1. **Quick Take** (first paragraph, suitable for desk distribution)
2. Results vs. expectations table (actual / model / consensus / delta)
3. Key surprises (positive and negative)
4. Management commentary analysis
5. Guidance changes (old vs new)
6. Thesis impact: which pillars strengthened/weakened
7. Rating and target price: maintain or change?

**Step 2: Verify**

- [ ] Quick take is <100 words, actionable
- [ ] Beat/miss clearly categorized per metric
- [ ] Thesis impact references specific pillars from tracker

---

## Task 12: Model Update (Step 8c — Post-Earnings)

**Plugin command:** `/model-update`

**Files:**
- Modify: `coverage/{TICKER}/04-financial-model/3-statements.xlsx`
- Create: `coverage/{TICKER}/08-earnings/{QUARTER}/model-update.xlsx`

**Step 1: Run model update**

Execute:
```
/model-update {TICKER} {QUARTER}
```

Provide context:
- Actual results for the quarter
- New guidance (if any)
- Changes to sector outlook or macro assumptions

Request:
1. Replace estimated quarter with actuals in 3-statements model
2. Adjust forward projections based on new run-rate/guidance
3. Recalculate DCF and target price
4. Generate bridge: old target → new target (itemized by assumption change)

**Step 2: Verify model-update.xlsx**

- [ ] Bridge sheet: old TP, each delta labeled, new TP
- [ ] Assumptions changes highlighted (old → new in adjacent columns)
- [ ] Updated 3-statements file still balances

**Step 3: Update thesis tracker**

Run `/thesis-tracker {TICKER}` to reflect any changes from the earnings cycle.

---

## Task 13: Morning Note (Step 9 — Daily)

**Plugin command:** `/morning-note`

**Files:**
- Create: `coverage/{TICKER}/09-morning-notes/{YYYY-MM-DD}-note.docx`

**Step 1: Run morning note (each trading day)**

Execute:
```
/morning-note {TICKER}
```

Provide context:
- Current price and overnight moves
- Any news since last note
- Upcoming catalysts from catalyst calendar
- Current thesis status

Request structure (~1 page):
1. **Header:** Ticker | Rating | Target | Current Price | Upside
2. **Price Action:** 1D, 1W, 1M performance, volume vs average
3. **News/Events:** Relevant items from today
4. **Thesis Update:** Any changes (usually "no change")
5. **Action:** Hold / Tactical Buy / Tactical Sell / No action
6. **Upcoming:** Next catalyst from calendar

**Step 2: Save with date**

Save to: `coverage/{TICKER}/09-morning-notes/{TODAY}-note.docx`

---

## Summary: Execution Order

| Task | Plugin Command | Frequency | Dependency |
|------|---------------|-----------|------------|
| 0 | (setup) | Once | None |
| 1 | (mkdir) | Once per ticker | Task 0 |
| 2 | `/sector-overview` | Once per ticker | Task 1 |
| 3 | `/idea-generation` | Once per ticker | Task 2 |
| 4 | `/comps` | Once per ticker | Task 3 |
| 5 | `/dcf` | Once per ticker | Task 3 |
| 6 | `/3-statements` | Once per ticker | Tasks 4, 5 |
| 7 | `/initiating-coverage` | Once per ticker | Tasks 2-6 |
| 8 | `/thesis-tracker` | Weekly + events | Task 7 |
| 9 | `/catalyst-calendar` | Monthly + ad-hoc | Task 7 |
| 10 | `/earnings-preview` | Quarterly (pre) | Tasks 6, 9 |
| 11 | `/earnings-analysis` | Quarterly (post) | Task 10 |
| 12 | `/model-update` | Quarterly (post) | Task 11 |
| 13 | `/morning-note` | Daily | Task 7 |

**Tasks 4 & 5 can run in parallel** (comps and DCF are independent).
**Tasks 8 & 9 can run in parallel** (thesis tracker and catalyst calendar are independent).
