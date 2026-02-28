---
name: "finance-equity-research"
description: "Generates a full equity research report and financial models (DCF, Comps) for a given stock ticker using local Python and Node scripts."
version: 1.0.0
author: "Walter102202"
---

# Equity Research Pipeline

You are an expert financial analyst assistant. When the user asks you to analyze a stock, initiate coverage, or generate financial models, you must use this skill to run the local pipeline.

## Required Input
Before proceeding, you must ensure you have the `TICKER` symbol (e.g., UBER, MELI). If the user didn't provide one, ask for it.

## Execution Steps
1. **Run the Pipeline:** Execute the following command in the terminal from the root of the project:
   `bash scripts/run-full-pipeline.sh {TICKER}`
   
2. **Handle Output:** Wait for the bash script to finish completely. It will generate Word documents and Excel files in the `coverage/{TICKER}/` directory.

3. **Review Results:** Use your file reading tools to look at the generated files, specifically focusing on:
   - `coverage/{TICKER}/05-initiation-report/initiation-{TICKER}-*.docx` (Read the executive summary)
   - `coverage/{TICKER}/04-financial-model/3-statements.xlsx` (Review key financial metrics)

4. **Final Response:** Provide a structured summary to the user confirming the pipeline ran successfully. Highlight 3 key insights or numbers from the generated reports to prove the work is done.

## Troubleshooting
- **Missing Dependencies:** If the bash script fails because it cannot find `node` modules or `python` packages, instruct the user to run `npm install` and `pip install openpyxl`.
- **Permission Denied:** If the script lacks execution permissions, run `chmod +x scripts/run-full-pipeline.sh` first.
