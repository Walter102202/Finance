---
name: data-sources
description: Catálogo centralizado de fuentes de datos confiables para el pipeline de equity research. Consultar este skill antes de generar scripts para saber exactamente dónde buscar información en cada paso. NO es invocable directamente — se referencia desde full-pipeline.
---

# Data Sources — Fuentes de Datos para Equity Research

Catálogo de fuentes públicas y gratuitas organizadas por paso del pipeline. Consultar la sección relevante antes de generar cada script.

---

## Tabla Maestra de Fuentes

| # | Fuente | URL | Tipo de Datos | Gratis | Confiabilidad |
|---|--------|-----|---------------|--------|---------------|
| 1 | Yahoo Finance | finance.yahoo.com | Precios, múltiplos, financials, estimates | Sí | Alta |
| 2 | SEC EDGAR | sec.gov/cgi-bin/browse-edgar | 10-K, 10-Q, 20-F, 8-K, proxy | Sí | Muy alta |
| 3 | FRED | fred.stlouisfed.org | Tasas, inflación, GDP, empleo | Sí | Muy alta |
| 4 | MacroTrends | macrotrends.net | Historical financials, múltiplos, trends | Sí | Alta |
| 5 | StockAnalysis | stockanalysis.com | Financials, valuation, peers, screening | Sí | Alta |
| 6 | Damodaran Online | pages.stern.nyu.edu/~adamodar/ | ERP, betas, cost of capital por industria/país | Sí | Muy alta |
| 7 | Finviz | finviz.com | Screener, heatmaps, múltiplos | Sí (básico) | Alta |
| 8 | Statista | statista.com | Market sizing, TAM/SAM, penetración | Parcial | Alta |
| 9 | World Bank | data.worldbank.org | GDP per cápita, indicadores macro globales | Sí | Muy alta |
| 10 | Banxico | banxico.org.mx | Política monetaria MX, tipo de cambio, inflación | Sí | Muy alta |
| 11 | INEGI | inegi.org.mx | Estadísticas económicas México | Sí | Muy alta |
| 12 | IBGE | ibge.gov.br | Estadísticas económicas Brasil | Sí | Muy alta |
| 13 | Nasdaq | nasdaq.com | Earnings calendar, institutional holdings | Sí | Alta |
| 14 | AlphaStreet | news.alphastreet.com | Earnings summaries, key metrics highlights | Sí | Media-Alta |
| 15 | Company IR Pages | (varía por empresa) | Annual reports, presentations, transcripts, guidance | Sí | Muy alta |

---

## Fuentes por Paso del Pipeline

### Paso 1: Sector Overview

**Objetivo:** Dimensionar el mercado (TAM/SAM/SOM), identificar drivers de crecimiento, landscape competitivo, entorno regulatorio.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Statista** | TAM/SAM del sector, tasas de crecimiento, penetración por mercado |
| 2 | **World Bank** | GDP per cápita, indicadores de desarrollo por país |
| 3 | **FRED** | GDP growth US, inflación, tasas de interés, consumer spending |
| Geo-MX | **Banxico** | Inflación MX, tasa de referencia, tipo de cambio USD/MXN |
| Geo-MX | **INEGI** | PIB sectorial MX, empleo, ventas retail, confianza del consumidor |
| Geo-BR | **IBGE** | PIB Brasil, inflación IPCA, ventas retail |
| Complemento | **Yahoo Finance** | Comparar market caps de principales players del sector |

**Búsquedas web sugeridas:**
- "{sector} market size {year} {region}"
- "{sector} growth forecast CAGR"
- "{sector} competitive landscape market share"

---

### Paso 2: Idea Generation (Screening)

**Objetivo:** Filtrar universo de empresas para identificar candidatas a cobertura.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Finviz** | Screener: filtrar por sector, market cap, P/E, EV/EBITDA, país |
| 2 | **StockAnalysis** | Financials rápidos, peer comparison, sector rankings |
| 3 | **Yahoo Finance Screener** | Filtros por múltiplos, geography, market cap ranges |

**Criterios de screening típicos:**
- Market cap > $1B (large cap) o > $500M (mid cap)
- Liquidez: volumen diario promedio > $5M
- Exchange: NYSE, NASDAQ, BMV, B3, BCS
- Sector match con sector overview del paso 1

---

### Paso 3a: Comparable Company Analysis (Comps)

**Objetivo:** Construir tabla de comps con 6-10 peers, calcular múltiplos implícitos.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Yahoo Finance** | Market cap, enterprise value, shares outstanding, stock price, P/E (TTM y forward), EV/EBITDA, P/B, dividend yield |
| 2 | **MacroTrends** | Revenue growth (3Y, 5Y), EBITDA margin trend, ROE histórico, historical multiples |
| 3 | **StockAnalysis** | Financial statements limpios, quick peer comparison tables |
| Backup | **Company IR / 10-K** | Revenue by segment (para ajustes de comparabilidad), management guidance |

**Métricas a recopilar por peer:**
- Precio, market cap, enterprise value
- Revenue LTM, Revenue growth YoY
- EBITDA LTM, EBITDA margin
- Net income, EPS
- P/E (TTM y forward), EV/EBITDA, EV/Revenue, P/B
- ROE, ROIC

---

### Paso 3b: DCF Model

**Objetivo:** Valoración intrínseca por flujos descontados. 5 años proyección + terminal value.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Damodaran Online** | Equity Risk Premium por país, unlevered beta por industria, country risk premium, default spread |
| 2 | **FRED** | Risk-free rate (US 10-Year Treasury: series DGS10), inflation expectations |
| 3 | **SEC EDGAR / Company IR** | CapEx histórico, D&A, working capital changes, debt schedule, tax rate efectiva |
| 4 | **Yahoo Finance** | Analyst consensus estimates (revenue, EPS), forward guidance, historical FCF |

**Datos clave de Damodaran (actualización anual en enero):**
- URL betas: `pages.stern.nyu.edu/~adamodar/` → "Updated Data" → "Betas by Sector"
- URL ERP: → "Country Default Spreads and Risk Premiums"
- URL cost of capital: → "Cost of Capital by Sector"

**Cálculo WACC — fuentes por componente:**
| Componente | Fuente |
|-----------|--------|
| Risk-free rate | FRED (DGS10) |
| Equity Risk Premium | Damodaran (ERP by country) |
| Beta | Damodaran (unlevered beta by industry) → relever con D/E de la empresa |
| Cost of debt | Company filings (interest expense / avg debt) o rating agency spreads |
| Tax rate | Company filings (effective tax rate, 3Y average) |
| Capital structure | Yahoo Finance (market cap) + Company filings (total debt) |

---

### Paso 4: 3-Statement Financial Model

**Objetivo:** Modelar IS, BS, CF con 3-5 años históricos + 5 años proyectados.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **SEC EDGAR** | 10-K/20-F completo: IS, BS, CF detallados, notas (deuda, leases, stock comp) |
| 2 | **MacroTrends** | Financials formateados (rápido para validar y obtener 10+ años de historia) |
| 3 | **StockAnalysis** | Financials limpios, quarterly data para estacionalidad |
| 4 | **Company IR** | Investor presentations (breakdowns por segmento, guidance, KPIs operativos) |

**Datos históricos requeridos (3-5 años):**
- Revenue by segment/geography
- COGS, gross profit, gross margin
- OpEx breakdown (SG&A, R&D, D&A)
- Operating income, EBIT, EBITDA
- Interest expense, tax provision, net income
- Total assets, cash, total debt, equity
- Operating CF, CapEx, FCF
- Shares outstanding (diluted)

---

### Paso 5: Initiation Report

**Objetivo:** Integrar toda la investigación en un reporte profesional de inicio de cobertura.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Company IR Page** | Últimas presentaciones, annual report, carta a accionistas, guidance más reciente |
| 2 | **AlphaStreet** | Resúmenes de últimos earnings, quotes de management, key takeaways |
| 3 | **Yahoo Finance** | Analyst price targets (consensus), recommendation trends |
| Complemento | *Pasos 1-4 del pipeline* | Sector overview, comps, DCF, financial model (son los inputs principales) |

**Para encontrar IR pages:**
- Buscar: "{company name} investor relations"
- Típicamente en: `investor.{company}.com` o `{company}.com/investors`

---

### Paso 6: Thesis Tracker

**Objetivo:** Monitorear pilares de tesis de inversión con KPIs específicos.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | *Output del Paso 5* | Thesis pillars, target metrics, investment rationale |
| 2 | **Yahoo Finance** | Precio actual vs target, cambios en estimates |
| 3 | **Company IR** | KPIs operativos más recientes (quarterly updates) |

**Nota:** Este paso es principalmente derivado de los outputs anteriores. Las fuentes externas se usan para updates recurrentes.

---

### Paso 7: Catalyst Calendar

**Objetivo:** Mapear eventos próximos que pueden mover el precio.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Nasdaq Earnings Calendar** | Próximas fechas de earnings por ticker (nasdaq.com/market-activity/earnings) |
| 2 | **Yahoo Finance** | Earnings dates, ex-dividend dates, stock split dates |
| 3 | **SEC EDGAR** | Filing dates (8-K para eventos materiales), proxy filing date → annual meeting |
| 4 | **Company IR** | Investor day dates, conference participation schedule |

**Búsquedas web sugeridas:**
- "{ticker} earnings date {quarter} {year}"
- "{ticker} investor day {year}"
- "{sector} conference {year}" (ej: "fintech conference 2026")

---

### Pasos Recurrentes: Earnings Analysis & Morning Notes

**Objetivo:** Análisis post-earnings y notas de seguimiento.

| Prioridad | Fuente | Datos a extraer |
|-----------|--------|----------------|
| 1 | **Company IR** | Press release de resultados, earnings presentation slides |
| 2 | **AlphaStreet** | Earnings highlights: beat/miss, key metrics, management quotes |
| 3 | **Yahoo Finance** | Estimates vs actuals, price reaction, analyst revisions |
| 4 | **SEC EDGAR** | 8-K (earnings filing), 10-Q (quarterly detail) |

---

## Fuentes Especiales por Geografía

### México (BMV)
| Fuente | URL | Datos |
|--------|-----|-------|
| Banxico | banxico.org.mx | Tasa de referencia, inflación, tipo de cambio |
| INEGI | inegi.org.mx | PIB, empleo, ventas retail, confianza del consumidor |
| BMV | bmv.com.mx | Filings de empresas mexicanas |
| CNBV | cnbv.gob.mx | Regulación financiera México |

### Brasil (B3)
| Fuente | URL | Datos |
|--------|-----|-------|
| IBGE | ibge.gov.br | PIB, IPCA (inflación), ventas retail |
| BCB | bcb.gov.br | Tasa Selic, política monetaria |
| CVM | cvm.gov.br | Regulador de valores de Brasil |
| B3 | b3.com.br | Filings de empresas brasileñas |

### Estados Unidos (NYSE/NASDAQ)
| Fuente | URL | Datos |
|--------|-----|-------|
| FRED | fred.stlouisfed.org | Risk-free rate, inflation, GDP, employment |
| SEC EDGAR | sec.gov/edgar | 10-K, 10-Q, 20-F, proxy, 8-K |
| BLS | bls.gov | CPI, employment statistics |

---

## Reglas de Uso

1. **Prioridad:** Siempre usar la fuente de prioridad 1 primero. Solo ir a fuentes secundarias si la primaria no tiene el dato o está desactualizada.
2. **Citación:** Todo script generado DEBE incluir una línea de fuente, ejemplo:
   ```
   "Source: Yahoo Finance, MacroTrends, Company Filings ({month} {year})"
   ```
3. **Geografía:** Para empresas LATAM, SIEMPRE incluir fuentes macro locales (Banxico/INEGI para MX, IBGE/BCB para BR) además de las globales.
4. **Damodaran:** Para el DCF, SIEMPRE consultar Damodaran para ERP y betas. No inventar estos valores.
5. **Actualidad:** Verificar que los datos sean del período más reciente disponible. Preferir datos TTM (trailing twelve months) sobre datos anuales para múltiplos.
6. **Cross-check:** Para datos financieros críticos (revenue, EBITDA), validar contra al menos 2 fuentes antes de hardcodear en scripts.
