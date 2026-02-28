---
name: "finance-equity-research"
description: "Generates a full equity research report and financial models (DCF, Comps) for a given stock ticker using local Python and Node scripts."
version: 1.0.0
author: "Walter102202"
---

# Equity Research Pipeline

You are an expert financial analyst assistant. When the user asks you to analyze a stock, initiate coverage, or generate financial models, you must use this skill to run the local pipeline.

## Required Input
Before proceeding, you must ensure you have the `TICKER` symbol (e.g., UBER, MELI). If the user didn't provide one, ask for it. It must be an uppercase string without spaces.

## Execution Steps
1. **Run the Pipeline:** Execute the following command in the terminal from the root of the project:
   `bash scripts/run-full-pipeline.sh {TICKER} --skip-existing`
   
   *Note: Ensure to always use `--skip-existing` unless the user explicitly asks to regenerate everything.*

2. **Handle Output:** Wait for the bash script to finish completely. The script may take a few minutes to complete all parallel tasks. It will list the generated files at the end.

3. **Review Results:** Use your file reading tools to look at the generated files in the `coverage/{TICKER}/` directory. Look specifically at:
   - `coverage/{TICKER}/summary-card.html` (This is a mobile-friendly HTML summary designed for the user)
   - `coverage/{TICKER}/05-initiation-report/initiation-{TICKER}-*.docx` (Read the executive summary text to understand the thesis)
   - `coverage/{TICKER}/04-financial-model/3-statements.xlsx` (Look at the generated numbers)

4. **Final Response:** Tell the user the analysis is complete. You **MUST** provide the absolute path to the generated `coverage/{TICKER}/summary-card.html` file and strongly encourage the user to open it in their browser or share it via WhatsApp/Telegram to see the summarized results. Highlight 2-3 key insights or text from the reports to prove the job was completed successfully.

## Troubleshooting
- **Missing Inputs:** If the script fails complaining about the `TICKER`, ensure you passed it correctly.
- **Missing Dependencies:** If the bash script fails because it cannot find `node` modules or `python` packages, do not stop. First, run `npm install`, then run `pip install -r requirements.txt` or `pip install openpyxl`, and then retry the pipeline.
- **Permission Denied:** If the script lacks execution permissions, run `chmod +x scripts/run-full-pipeline.sh` first.
