Follow my instructions

## Equity Research Pipeline

When the user asks to analyze a new ticker, initiate coverage, or run the full pipeline:
1. Use the `/full-pipeline` skill if available
2. Or follow the instructions in `.claude/skills/full-pipeline/skill.md`
3. Execute ALL steps end-to-end without stopping between tasks
4. For re-running existing scripts: `bash scripts/run-full-pipeline.sh {TICKER}`
