# Data Sources Skill — Design Document

**Date:** 2026-02-28
**Status:** Approved
**Purpose:** Crear un skill centralizado que catalogue todas las fuentes de datos confiables por paso del pipeline, para que Claude sepa exactamente dónde buscar información al generar scripts para nuevas empresas.

---

## Decisiones de diseño

| Decisión | Opción elegida | Alternativa descartada |
|----------|---------------|----------------------|
| Nivel de integración | Referencia consultable (estática) | Lookup activo con WebFetch |
| Alcance | Todo el pipeline (8 pasos) | Solo financieros / Solo financieros+macro |
| Invocación | Referencia interna desde full-pipeline | Skill invocable independiente |
| Arquitectura | Skill separado (data-sources/) | Embeber en full-pipeline |

## Arquitectura

```
.claude/skills/
├── full-pipeline/skill.md    ← MODIFICAR: agregar referencia a data-sources por paso
└── data-sources/skill.md     ← NUEVO: catálogo centralizado de fuentes
```

## Estructura del skill data-sources/skill.md

### Sección 1 — Frontmatter
- name: data-sources
- description: Catálogo de fuentes de datos por paso del pipeline

### Sección 2 — Tabla maestra de fuentes
Todas las fuentes con: nombre, URL, tipo de datos, gratuito sí/no, confiabilidad

### Sección 3 — Fuentes por paso del pipeline

| Paso | Fuentes primarias | Datos a extraer |
|------|-------------------|----------------|
| 1. Sector Overview | Statista, FRED, World Bank, Banxico/INEGI | TAM/SAM, GDP, inflación, penetración |
| 2. Idea Generation | Finviz, StockAnalysis, Yahoo Screener | Screening por múltiplos, market cap, sector |
| 3a. Comps | Yahoo Finance, MacroTrends, StockAnalysis | P/E, EV/EBITDA, P/B, margins, growth |
| 3b. DCF | FRED, Damodaran, SEC EDGAR, Yahoo Finance | Risk-free rate, ERP, beta, CapEx, D&A |
| 4. 3-Statements | SEC EDGAR, MacroTrends, Company IR | IS, BS, CF históricos 3-5 años |
| 5. Initiation | Company IR, AlphaStreet | Transcripts, guidance, management commentary |
| 6. Thesis Tracker | (derivado de pasos anteriores) | KPIs, métricas de seguimiento |
| 7. Catalyst Calendar | Nasdaq Calendar, Yahoo Finance, SEC | Earnings dates, filing dates, eventos |

### Sección 4 — Fuentes especiales
- Damodaran Online: ERP por país, betas por industria, cost of capital
- Fuentes por geografía: Banxico/INEGI (MX), IBGE (BR), FRED (US)

### Sección 5 — Reglas de prioridad
- Fuente primaria primero, secundaria como fallback
- Citar fuente en cada script generado

## Cambio en full-pipeline/skill.md

En cada paso, agregar:
```
**Fuentes de datos:** Consultar skill data-sources, sección "{paso}"
```

## Implementación

1. Crear `.claude/skills/data-sources/skill.md` con el catálogo completo
2. Modificar `.claude/skills/full-pipeline/skill.md` para referenciar data-sources en cada paso
