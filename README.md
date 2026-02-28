# Finance — Equity Research Pipeline

> **IMPORTANT DISCLAIMER**
>
> This repository is for **informational and educational purposes only**. The documents, models, reports, and analyses published here **do not constitute investment recommendations, financial advice, or solicitations to buy or sell any securities**. All content is generated using publicly available data and automated tools, and may contain errors, inaccuracies, or outdated information. The authors are not registered investment advisors, broker-dealers, or financial professionals. **Always consult a qualified financial advisor before making any investment decisions.** Use this material at your own risk.

---

## Overview

Automated sell-side equity research workspace powered by [Claude Code](https://claude.ai/claude-code). The pipeline generates institutional-style research deliverables — from sector overviews to full initiation reports — using publicly available data sources.

The system produces two types of output:
- **Word documents (.docx)** — narrative reports (sector overview, idea generation, initiation, earnings analysis, morning notes)
- **Excel workbooks (.xlsx)** — financial models with live formulas (comps, DCF, 3-statement model, thesis tracker, catalyst calendar)

## Current Coverage

| Ticker | Company | Rating | Target | Status |
|--------|---------|--------|--------|--------|
| **MELI** | MercadoLibre | BUY | $2,220 | Full initiation + Q4 2025 earnings cycle |
| **UBER** | Uber Technologies | BUY | $100 | Full initiation complete |

## Repository Structure

```
Finance/
├── coverage/                    # Research deliverables by ticker
│   ├── MELI/
│   │   ├── 01-sector-overview.docx
│   │   ├── 02-idea-generation.docx
│   │   ├── 03-valuation/
│   │   │   ├── comps-analysis.xlsx
│   │   │   └── dcf-model.xlsx
│   │   ├── 04-financial-model/
│   │   │   └── 3-statements.xlsx
│   │   ├── 05-initiation-report/
│   │   │   └── initiation-MELI-2026-02-27.docx
│   │   ├── 06-thesis-tracker.xlsx
│   │   ├── 07-catalyst-calendar.xlsx
│   │   ├── 08-earnings/Q4-2025/
│   │   │   ├── earnings-preview.docx
│   │   │   ├── earnings-analysis.docx
│   │   │   └── model-update.xlsx
│   │   └── 09-morning-notes/
│   │       └── YYYY-MM-DD-note.docx
│   └── UBER/
│       └── (same structure)
│
├── scripts/                     # Generator scripts
│   ├── generate-sector-overview.js
│   ├── generate-idea-generation.js
│   ├── generate-comps.py
│   ├── generate-dcf.py
│   ├── generate-3statements.py
│   ├── generate-initiation.js
│   ├── generate-thesis-tracker.py
│   ├── generate-catalyst-calendar.py
│   ├── generate-earnings-preview.js
│   ├── generate-earnings-analysis.js
│   ├── generate-model-update.py
│   ├── generate-morning-note.js
│   └── run-full-pipeline.sh
│
├── templates/                   # Reusable Excel/Word templates
│   ├── comps-template.xlsx
│   ├── dcf-template.xlsx
│   ├── 3-statements-template.xlsx
│   ├── thesis-tracker-template.xlsx
│   ├── catalyst-calendar-template.xlsx
│   └── initiation-template.docx
│
├── docs/                        # Design documents and plans
│   ├── designs/
│   └── plans/
│
└── .claude/skills/              # Claude Code automation skills
    ├── full-pipeline/           # End-to-end pipeline orchestrator
    └── data-sources/            # Data source catalog per step
```

## Pipeline

The research process follows a sequential pipeline with parallel steps where possible:

### Initiation (one-time per ticker)

```
Step 1: Sector Overview        →  .docx  (market sizing, competitive landscape)
Step 2: Idea Generation        →  .docx  (screening, long/short list, recommendation)
Step 3: Comps + DCF (parallel) →  .xlsx  (peer multiples + intrinsic valuation)
Step 4: 3-Statement Model      →  .xlsx  (IS, BS, CF — historical + 5Y projected)
Step 5: Initiation Report      →  .docx  (full report with rating and target price)
```

### Recurring

```
Step 6: Thesis Tracker         →  .xlsx  (pillar status, KPIs, conviction score)
Step 7: Catalyst Calendar      →  .xlsx  (earnings dates, events, expected impact)
Step 8: Earnings Cycle         →  .docx + .xlsx  (preview → analysis → model update)
Step 9: Morning Notes          →  .docx  (daily price action, news, thesis impact)
```

### Dependency Graph

```
[1] Sector → [2] Ideas → [3a] Comps ──┐
                          [3b] DCF  ───┤
                                       ↓
                          [4] 3-Stmts → [5] Initiation → [6] Thesis  ──┐
                                                          [7] Catalysts ┘
                                                                 ↓
                                                          [8] Verification
```

## Data Sources

All data is sourced from **publicly available, free resources**:

| Source | Data |
|--------|------|
| Yahoo Finance | Prices, multiples, financial statements, estimates |
| SEC EDGAR | 10-K, 10-Q, 20-F, 8-K filings |
| FRED | Risk-free rate, inflation, GDP, employment |
| Damodaran Online | Equity risk premiums, betas by sector, cost of capital |
| MacroTrends | Historical financials, valuation trends |
| StockAnalysis | Peer comparisons, screening |
| Finviz | Screener, sector heatmaps |
| Nasdaq | Earnings calendar, institutional holdings |
| Company IR Pages | Annual reports, presentations, guidance |
| Banxico / INEGI | Mexico macro data (rates, inflation, GDP) |
| IBGE | Brazil macro data |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Word documents (.docx) | Node.js + [docx](https://www.npmjs.com/package/docx) |
| Excel workbooks (.xlsx) | Python + [openpyxl](https://openpyxl.readthedocs.io/) |
| Pipeline orchestration | Bash (`run-full-pipeline.sh`) + Claude Code skills |
| Styling | Arial font, dark blue headers (#1B3A5C), consistent across all deliverables |

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.9+
- [Claude Code](https://claude.ai/claude-code) (for pipeline automation)

### Installation

```bash
# Clone the repository
git clone https://github.com/Walter102202/Finance.git
cd Finance

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install openpyxl
```

### Running the Pipeline

**For a new ticker** (generates all scripts and deliverables from scratch):

```
# In Claude Code
/full-pipeline
```

**To re-run existing scripts** for a ticker that already has generated scripts:

```bash
bash scripts/run-full-pipeline.sh TICKER

# Options:
bash scripts/run-full-pipeline.sh MELI --skip-existing    # Skip files that already exist
```

### Running Individual Steps

```bash
# Word documents (Node.js)
node scripts/generate-sector-overview.js TICKER
node scripts/generate-idea-generation.js TICKER
node scripts/generate-initiation.js TICKER
node scripts/generate-earnings-preview.js TICKER
node scripts/generate-earnings-analysis.js TICKER
node scripts/generate-morning-note.js TICKER

# Excel workbooks (Python)
python scripts/generate-comps.py TICKER
python scripts/generate-dcf.py TICKER
python scripts/generate-3statements.py TICKER
python scripts/generate-thesis-tracker.py TICKER
python scripts/generate-catalyst-calendar.py TICKER
python scripts/generate-model-update.py TICKER
```

## License

This project is for personal and educational use. See [Disclaimer](#finance--equity-research-pipeline) at the top of this document.
