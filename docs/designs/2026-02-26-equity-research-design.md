# Equity Research — Cobertura Completa: Design Document

**Fecha:** 2026-02-26
**Plugins:** financial-analysis (core) + equity-research (add-on)
**Contexto:** Sell-side profesional, datos públicos/gratuitos, outputs en Excel + Word/PDF
**Tipo de flujo:** Genérico parametrizable por {SECTOR} y {TICKER}

---

## Estructura de Directorios

```
Finance/
├── coverage/
│   └── {TICKER}/
│       ├── 01-sector-overview.docx
│       ├── 02-idea-generation.docx
│       ├── 03-valuation/
│       │   ├── comps-analysis.xlsx
│       │   └── dcf-model.xlsx
│       ├── 04-financial-model/
│       │   └── 3-statements.xlsx
│       ├── 05-initiation-report/
│       │   └── initiation-{TICKER}-{DATE}.docx
│       ├── 06-thesis-tracker.xlsx
│       ├── 07-catalyst-calendar.xlsx
│       ├── 08-earnings/
│       │   └── {QUARTER}/
│       │       ├── earnings-preview.docx
│       │       ├── earnings-analysis.docx
│       │       └── model-update.xlsx
│       └── 09-morning-notes/
│           └── {YYYY-MM-DD}-note.docx
├── templates/
│   ├── comps-template.xlsx
│   ├── dcf-template.xlsx
│   ├── 3-statements-template.xlsx
│   └── initiation-template.docx
└── docs/
    └── plans/
```

### Convenciones

- Ticker en mayúsculas como ID de cobertura
- Fechas en formato ISO YYYY-MM-DD
- Quarters como Q1-2026
- Cada .xlsx incluye fórmulas vivas (no solo valores)
- Cada .docx sigue formato sell-side: header, disclaimer, rating

---

## Flujo de Initiation (Pasos 1-5, una vez por cobertura)

### Paso 1: `/sector-overview {sector}`

- **Input:** Nombre del sector
- **Fuentes:** Reportes públicos, datos macro, SEC/BMV filings de peers
- **Output:** `01-sector-overview.docx`
  - Tamaño de mercado y crecimiento (TAM/SAM/SOM)
  - Drivers y headwinds del sector
  - Landscape competitivo (market share)
  - Regulación relevante
  - Métricas clave del sector (KPIs sectoriales)

### Paso 2: `/idea-generation {sector}`

- **Input:** Sector overview del paso 1
- **Fuentes:** Screening por múltiplos, momentum, calidad fundamental
- **Output:** `02-idea-generation.docx`
  - Long list de candidatos (10-15 nombres)
  - Filtros aplicados (liquidez, cap, cobertura existente)
  - Short list (3-5) con tesis preliminar
  - Recomendación del target con justificación

### Paso 3: `/comps-analysis {TICKER}` + `/dcf-model {TICKER}`

- **Input:** Ticker seleccionado, datos financieros públicos
- **Fuentes:** Yahoo Finance, SEC/BMV filings, reportes anuales
- **Output:**
  - `comps-analysis.xlsx`: Comparables con EV/EBITDA, P/E, P/B, ROE, crecimiento. Mediana, media, valuación implícita del target.
  - `dcf-model.xlsx`: Proyección FCF 5-10Y, WACC, terminal value (exit multiple + perpetuity growth), sensibilidad, precio por escenario (base/bull/bear).

### Paso 4: `/3-statements {TICKER}`

- **Input:** Filings históricos (3-5 años), guidance
- **Output:** `3-statements.xlsx`
  - Income Statement proyectado 5Y (revenue build-up por segmento)
  - Balance Sheet proyectado (working capital, deuda, capex)
  - Cash Flow Statement (operating, investing, financing)
  - Hojas auxiliares: assumptions, revenue bridge, margin analysis
  - Fórmulas vivas enlazadas entre hojas

### Paso 5: `/initiating-coverage {TICKER}`

- **Input:** Outputs de pasos 1-4
- **Output:** `initiation-{TICKER}-{DATE}.docx` (~20-40 págs)
  - Executive Summary con rating y target price
  - Tesis de inversión (3-5 pilares)
  - Overview de la compañía y management
  - Análisis del sector (resumen paso 1)
  - Modelo financiero (resumen pasos 3-4)
  - Valuación: DCF + comps → target price con upside/downside
  - Riesgos (5-8 con probabilidad e impacto)
  - Apéndices (tablas detalladas, supuestos)
  - Disclaimer legal sell-side

---

## Flujo Recurrente (Pasos 6-9, ongoing)

### Paso 6: `/thesis-tracker {TICKER}` — Semanal/por evento

- **Output:** `06-thesis-tracker.xlsx`
  - Pilares de la tesis + status (on track / at risk / broken)
  - KPIs: esperados vs reales
  - Convicción actual (1-5) con justificación
  - Log de cambios con fecha y trigger
  - Rating actual y cambio pendiente (si aplica)

### Paso 7: `/catalyst-calendar {TICKER}` — Mensual + ad-hoc

- **Output:** `07-catalyst-calendar.xlsx`
  - Eventos con fecha (earnings, investor day, regulación, M&A)
  - Impacto esperado (positivo/negativo/neutro, magnitud)
  - Acción recomendada pre/post evento
  - Status (upcoming / passed / cancelled)

### Paso 8: Ciclo de Earnings — Trimestral

**8a. `/earnings-preview {TICKER} {QUARTER}`** (1-2 semanas antes)
- **Output:** `earnings-preview.docx`
  - Estimados consenso vs modelo propio
  - Métricas clave a vigilar
  - Escenarios de reacción del mercado
  - Posicionamiento recomendado

**8b. `/earnings-analysis {TICKER} {QUARTER}`** (día del reporte)
- **Output:** `earnings-analysis.docx`
  - Resultados vs consenso vs modelo (beat/miss/in-line)
  - Sorpresas clave y commentary del management
  - Cambios en guidance
  - Impacto en tesis: mantener/revisar rating
  - Quick take para el desk

**8c. `/model-update {TICKER} {QUARTER}`** (post-earnings)
- **Output:** `model-update.xlsx`
  - 3-statements actualizados con datos reales
  - Nuevas proyecciones ajustadas
  - Bridge: target price anterior → nuevo
  - Resumen de cambios en supuestos

### Paso 9: `/morning-note {TICKER}` — Diaria (días hábiles)

- **Output:** `{YYYY-MM-DD}-note.docx`
  - Precio actual y performance (1D, 1W, 1M)
  - Noticias/eventos relevantes del día
  - Impacto en tesis (si aplica)
  - Acción recomendada (hold/trade)
  - Formato breve (~1 página)

---

## Diagrama del Flujo

```
INITIATION (una vez por cobertura)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [1] sector-overview → [2] idea-generation → [3] comps + dcf
                                               ↓
                           [5] initiation ← [4] 3-statements

ONGOING (recurrente)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [6] thesis-tracker ←──────── semanal / por evento
 [7] catalyst-calendar ←───── mensual + ad-hoc
 [8] earnings cycle: ←─────── trimestral
     preview → analysis → model-update → (actualiza [6])
 [9] morning-note ←────────── diaria
```

---

## Fuentes de Datos

| Fuente | Uso |
|--------|-----|
| Yahoo Finance | Precios, múltiplos, datos históricos |
| SEC EDGAR / BMV | Filings (10-K, 10-Q, 20-F, reportes anuales) |
| Reportes anuales | Datos financieros, guidance, segmentos |
| Investor presentations | Strategy, KPIs, TAM |
| Earnings transcripts (públicos) | Management commentary, guidance |
| Macro data (FRED, Banxico, INEGI) | Tasas, inflación, PIB |

---

## Decisiones de Diseño

1. **Pipeline secuencial** sobre hub-and-spoke o modular: máxima trazabilidad para sell-side
2. **Un directorio por ticker** para aislamiento y portabilidad
3. **Templates reutilizables** en `/templates/` para consistencia entre coberturas
4. **Versionado por quarter** en earnings para historial completo
5. **Morning notes por fecha** para archivo cronológico
6. **Datos públicos** como fuente base, con posibilidad de conectar MCP providers después
