---
name: full-pipeline
description: Ejecuta el pipeline completo de equity research de principio a fin para cualquier empresa. Genera TODOS los entregables (sector overview, idea generation, comps, DCF, 3-statements, initiation report, thesis tracker, catalyst calendar) en una sola sesión sin detenerse entre pasos. Usar cuando el usuario pida analizar, iniciar cobertura, o ejecutar el pipeline completo para un ticker.
---

# Full Pipeline — Equity Research End-to-End

Ejecuta el pipeline completo de equity research para una empresa, generando todos los entregables en una sola sesión.

## Cuándo usar este skill

Activar cuando el usuario diga:
- "Analiza {TICKER}"
- "Inicia cobertura de {EMPRESA}"
- "Ejecuta el pipeline completo para {TICKER}"
- "Corre todo el proceso para {TICKER}"
- Cualquier variante que implique el pipeline completo

## REGLA FUNDAMENTAL: NO DETENERSE

**Este skill anula la regla de "one task at a time" de los sub-skills.**

- NO preguntar "cuál task quieres ejecutar"
- NO detenerse entre pasos para pedir aprobación
- NO mostrar verificaciones de prerequisitos (tú los produces)
- SÍ ejecutar todo de principio a fin
- SÍ pasar el output de cada paso como input del siguiente
- SÍ informar progreso breve entre pasos

## FUENTES DE DATOS

**Antes de generar cada script, consultar el skill `data-sources` para saber exactamente qué fuentes usar y en qué orden de prioridad.** Cada paso tiene su sección dedicada con fuentes primarias, secundarias, y datos específicos a extraer.

## Información requerida

Antes de ejecutar, confirmar con el usuario:

| Campo | Ejemplo | Requerido |
|-------|---------|-----------|
| TICKER | WALMEX | Sí |
| COMPANY_NAME | Walmart de México | Sí |
| SECTOR | Retail / Autoservicios México | Sí |
| EXCHANGE | BMV (Bolsa Mexicana de Valores) | Sí |

Si el usuario solo da el ticker, investigar y deducir el resto. Preguntar solo si hay ambigüedad.

## Pipeline de ejecución (8 pasos)

### Paso 0: Setup de directorios

```bash
TICKER="XXXX"
mkdir -p "coverage/$TICKER/03-valuation" \
         "coverage/$TICKER/04-financial-model" \
         "coverage/$TICKER/05-initiation-report" \
         "coverage/$TICKER/08-earnings" \
         "coverage/$TICKER/09-morning-notes" \
         "templates"
```

### Paso 1: Sector Overview → `coverage/{TICKER}/01-sector-overview.docx`

**Skill a invocar:** `equity-research:sector`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 1: Sector Overview"

Pasar:
- Sector name y geographic focus
- Solicitar: TAM/SAM/SOM, growth drivers, competitive landscape, regulatory, KPIs
- Generar script `scripts/generate-sector-overview.js` con datos de la empresa
- Ejecutar: `node scripts/generate-sector-overview.js {TICKER}`

**Al terminar, informar:** "Paso 1/8 completo: Sector Overview generado." y continuar inmediatamente.

### Paso 2: Idea Generation → `coverage/{TICKER}/02-idea-generation.docx`

**Skill a invocar:** `equity-research:screen`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 2: Idea Generation"

Pasar:
- Referencia al sector overview del Paso 1
- Screening criteria (market cap, liquidity, exchange)
- Long list → filters → short list → final recommendation
- Generar script `scripts/generate-idea-generation.js` con datos específicos
- Ejecutar: `node scripts/generate-idea-generation.js {TICKER}`

**Al terminar:** "Paso 2/8 completo: Idea Generation." → continuar.

### Paso 3a + 3b: Comps + DCF (PARALELO)

Estos dos pasos son independientes. **Ejecutarlos en paralelo usando sub-agentes.**

#### 3a: Comparable Company Analysis → `coverage/{TICKER}/03-valuation/comps-analysis.xlsx`

**Skill a invocar:** `financial-analysis:comps`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 3a: Comps"

Pasar:
- Peer group: 6-10 comparable companies
- Métricas: EV/EBITDA, P/E, P/B, EV/Revenue, ROE, Revenue Growth, EBITDA Margin
- Mean, median, implied valuation
- Generar script `scripts/generate-comps.py` con datos reales de los peers
- Ejecutar: `python scripts/generate-comps.py {TICKER}`

#### 3b: DCF Model → `coverage/{TICKER}/03-valuation/dcf-model.xlsx`

**Skill a invocar:** `financial-analysis:dcf`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 3b: DCF Model"

Pasar:
- 5 años de proyección + terminal value
- FCF build-up: Revenue → EBITDA → EBIT → NOPAT → FCF
- WACC, terminal value (perpetuity + exit multiple)
- Escenarios: Base/Bull/Bear
- Sensitivity tables
- Generar script `scripts/generate-dcf.py` con datos de la empresa
- Ejecutar: `python scripts/generate-dcf.py {TICKER}`

**Al terminar ambos:** "Paso 3/8 completo: Comps + DCF generados." → continuar.

### Paso 4: 3-Statement Financial Model → `coverage/{TICKER}/04-financial-model/3-statements.xlsx`

**Skill a invocar:** `financial-analysis:3-statements`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 4: 3-Statement Financial Model"

Pasar:
- 3-5 años históricos + 5 años proyectados
- Income Statement, Balance Sheet, Cash Flow Statement
- Revenue by segment, OpEx breakdown, debt schedule
- Vincular con datos de comps y DCF
- Generar script `scripts/generate-3statements.py` con datos financieros reales
- Ejecutar: `python scripts/generate-3statements.py {TICKER}`

**Al terminar:** "Paso 4/8 completo: 3-Statement Model." → continuar.

### Paso 5: Initiation Report → `coverage/{TICKER}/05-initiation-report/initiation-{TICKER}-{DATE}.docx`

**Skill a invocar:** `equity-research:initiate`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 5: Initiation Report"

**IMPORTANTE:** Para este paso, NO seguir el flujo de 5 sub-tasks del skill `initiating-coverage`. En su lugar:
- Usar TODA la información generada en pasos 1-4 como input
- Generar directamente el script `scripts/generate-initiation.js` con:
  - Cover page con ticker, rating, target price
  - Executive summary
  - Investment thesis (3-5 pilares)
  - Company overview
  - Sector analysis (resumir paso 1)
  - Financial analysis (datos de pasos 3-4)
  - Valuation (comps + DCF)
  - Risks
  - Disclaimer
- Ejecutar: `node scripts/generate-initiation.js {TICKER}`

**Al terminar:** "Paso 5/8 completo: Initiation Report." → continuar.

### Paso 6 + 7: Thesis Tracker + Catalyst Calendar (PARALELO)

Estos dos pasos son independientes. **Ejecutarlos en paralelo.**

#### Paso 6: Thesis Tracker → `coverage/{TICKER}/06-thesis-tracker.xlsx`

**Skill a invocar:** `equity-research:thesis`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 6: Thesis Tracker"

Pasar:
- Thesis pillars del initiation report (paso 5)
- KPIs, expected values, status (On Track/At Risk/Broken)
- Change log, rating sheet
- Generar script `scripts/generate-thesis-tracker.py`
- Ejecutar: `python scripts/generate-thesis-tracker.py {TICKER}`

#### Paso 7: Catalyst Calendar → `coverage/{TICKER}/07-catalyst-calendar.xlsx`

**Skill a invocar:** `equity-research:catalysts`
**Fuentes de datos:** Consultar skill `data-sources`, sección "Paso 7: Catalyst Calendar"

Pasar:
- Próximos 4 earnings, annual meeting, investor day
- Eventos sectoriales, regulatorios, macro
- Fecha, evento, impacto, magnitud, acción recomendada
- Generar script `scripts/generate-catalyst-calendar.py`
- Ejecutar: `python scripts/generate-catalyst-calendar.py {TICKER}`

**Al terminar ambos:** "Paso 6-7/8 completo: Thesis Tracker + Catalyst Calendar." → continuar.

### Paso 8: Verificación final y resumen

Listar todos los archivos generados:
```bash
find "coverage/{TICKER}" -type f | sort
```

Presentar resumen:
```
PIPELINE COMPLETADO — {TICKER}

Rating: [BUY/HOLD/SELL]
Target Price: $XX.XX
Upside: XX%

Archivos generados:
  01-sector-overview.docx
  02-idea-generation.docx
  03-valuation/comps-analysis.xlsx
  03-valuation/dcf-model.xlsx
  04-financial-model/3-statements.xlsx
  05-initiation-report/initiation-{TICKER}-{DATE}.docx
  06-thesis-tracker.xlsx
  07-catalyst-calendar.xlsx

Para re-ejecutar los scripts:
  bash scripts/run-full-pipeline.sh {TICKER}
```

## Manejo de errores

Si un paso falla:
1. Intentar una vez más con enfoque diferente
2. Si falla de nuevo, informar cuál paso falló y continuar con los siguientes pasos que no dependan de él
3. Al final, listar pasos fallidos para que el usuario los re-ejecute manualmente

## Pasos independientes vs dependientes

```
Paso 1 (Sector) → Paso 2 (Idea Gen) → Paso 3a (Comps) ─┐
                                     → Paso 3b (DCF)  ──┤
                                                         ↓
                                       Paso 4 (3-Stmts) → Paso 5 (Initiation) → Paso 6 (Thesis)  ─┐
                                                                                → Paso 7 (Catalysts)┘
                                                                                         ↓
                                                                                  Paso 8 (Resumen)
```

## Notas técnicas

- **Scripts .docx** (Node.js): Requieren `npm install docx` — ya instalado en el proyecto
- **Scripts .xlsx** (Python): Requieren `pip install openpyxl` — ya instalado
- **Estilo:** Arial, header azul oscuro (#1B3A5C), consistente en todos los entregables
- **Datos:** Solo fuentes públicas — ver skill `data-sources` para catálogo completo por paso
- Los scripts se generan en `scripts/` y sus outputs van a `coverage/{TICKER}/`

## Contexto del proyecto

- Plan detallado: `docs/plans/2026-02-26-equity-research-plan.md`
- Ejemplo completo: `coverage/MELI/` (MercadoLibre - cobertura completa)
- Templates: `templates/` (comps, dcf, 3-statements, initiation, thesis, catalyst)
