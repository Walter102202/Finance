#!/bin/bash
# =============================================================================
# run-full-pipeline.sh — Ejecuta el pipeline completo de equity research
#
# USO:
#   bash scripts/run-full-pipeline.sh TICKER [--skip-existing] [--initiation-only]
#
# EJEMPLO:
#   bash scripts/run-full-pipeline.sh MELI
#   bash scripts/run-full-pipeline.sh WALMEX --skip-existing
#
# NOTA: Este script ejecuta los scripts de generación que YA EXISTEN.
#       Para una nueva empresa, primero hay que generar scripts nuevos
#       usando el skill /full-pipeline en Claude Code.
# =============================================================================

set -e

TICKER="${1:?Error: Debe especificar un TICKER. Uso: bash scripts/run-full-pipeline.sh TICKER}"
SKIP_EXISTING="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATE=$(date +%Y-%m-%d)

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Track timing
START_TIME=$(date +%s)
step_start() { STEP_START=$(date +%s); }
step_end() {
  local elapsed=$(( $(date +%s) - STEP_START ))
  success "$1 (${elapsed}s)"
}

should_skip() {
  if [ "$SKIP_EXISTING" = "--skip-existing" ] && [ -f "$1" ]; then
    warn "Saltando: $1 ya existe"
    return 0
  fi
  return 1
}

echo ""
echo "============================================================"
echo "  EQUITY RESEARCH PIPELINE — $TICKER"
echo "  Fecha: $DATE"
echo "============================================================"
echo ""

cd "$PROJECT_DIR"

# =============================================================================
# PASO 0: Crear estructura de directorios
# =============================================================================
log "Paso 0: Creando estructura de directorios..."
step_start

mkdir -p "coverage/$TICKER/03-valuation" \
         "coverage/$TICKER/04-financial-model" \
         "coverage/$TICKER/05-initiation-report" \
         "coverage/$TICKER/08-earnings" \
         "coverage/$TICKER/09-morning-notes" \
         "templates"

step_end "Directorios creados para $TICKER"

# =============================================================================
# PASO 1: Sector Overview (Node.js → .docx)
# =============================================================================
OUT="coverage/$TICKER/01-sector-overview.docx"
if ! should_skip "$OUT"; then
  log "Paso 1/8: Generando Sector Overview..."
  step_start
  node scripts/generate-sector-overview.js "$TICKER"
  step_end "Sector Overview → $OUT"
fi

# =============================================================================
# PASO 2: Idea Generation (Node.js → .docx)
# =============================================================================
OUT="coverage/$TICKER/02-idea-generation.docx"
if ! should_skip "$OUT"; then
  log "Paso 2/8: Generando Idea Generation..."
  step_start
  node scripts/generate-idea-generation.js "$TICKER"
  step_end "Idea Generation → $OUT"
fi

# =============================================================================
# PASO 3a + 3b: Comps + DCF en PARALELO (Python → .xlsx)
# =============================================================================
log "Paso 3/8: Generando Comps y DCF en paralelo..."
step_start

COMPS_OUT="coverage/$TICKER/03-valuation/comps-analysis.xlsx"
DCF_OUT="coverage/$TICKER/03-valuation/dcf-model.xlsx"

PIDS=()

if ! should_skip "$COMPS_OUT"; then
  python scripts/generate-comps.py "$TICKER" &
  PIDS+=($!)
fi

if ! should_skip "$DCF_OUT"; then
  python scripts/generate-dcf.py "$TICKER" &
  PIDS+=($!)
fi

# Esperar ambos procesos
FAIL=0
for pid in "${PIDS[@]}"; do
  wait "$pid" || FAIL=1
done

if [ $FAIL -ne 0 ]; then
  error "Error en Comps o DCF. Abortando."
fi

step_end "Comps + DCF generados en paralelo"

# =============================================================================
# PASO 4: 3-Statement Financial Model (Python → .xlsx)
# =============================================================================
OUT="coverage/$TICKER/04-financial-model/3-statements.xlsx"
if ! should_skip "$OUT"; then
  log "Paso 4/8: Generando 3-Statement Model..."
  step_start
  python scripts/generate-3statements.py "$TICKER"
  step_end "3-Statement Model → $OUT"
fi

# =============================================================================
# PASO 5: Initiation Report (Node.js → .docx)
# =============================================================================
OUT="coverage/$TICKER/05-initiation-report/initiation-$TICKER-$DATE.docx"
if ! should_skip "$OUT"; then
  log "Paso 5/8: Generando Initiation Report..."
  step_start
  node scripts/generate-initiation.js "$TICKER"
  step_end "Initiation Report → $OUT"
fi

# =============================================================================
# PASO 6 + 7: Thesis Tracker + Catalyst Calendar en PARALELO (Python → .xlsx)
# =============================================================================
log "Paso 6-7/8: Generando Thesis Tracker y Catalyst Calendar en paralelo..."
step_start

THESIS_OUT="coverage/$TICKER/06-thesis-tracker.xlsx"
CAT_OUT="coverage/$TICKER/07-catalyst-calendar.xlsx"

PIDS=()

if ! should_skip "$THESIS_OUT"; then
  python scripts/generate-thesis-tracker.py "$TICKER" &
  PIDS+=($!)
fi

if ! should_skip "$CAT_OUT"; then
  python scripts/generate-catalyst-calendar.py "$TICKER" &
  PIDS+=($!)
fi

FAIL=0
for pid in "${PIDS[@]}"; do
  wait "$pid" || FAIL=1
done

if [ $FAIL -ne 0 ]; then
  error "Error en Thesis Tracker o Catalyst Calendar. Abortando."
fi

step_end "Thesis Tracker + Catalyst Calendar generados"

# =============================================================================
# RESUMEN
# =============================================================================
TOTAL_TIME=$(( $(date +%s) - START_TIME ))

echo ""
echo "============================================================"
echo "  PIPELINE COMPLETADO — $TICKER"
echo "  Tiempo total: ${TOTAL_TIME}s"
echo "============================================================"
echo ""
echo "  Archivos generados:"
echo "  coverage/$TICKER/"

# List generated files
find "coverage/$TICKER" -type f | sort | while read -r f; do
  SIZE=$(wc -c < "$f" 2>/dev/null | tr -d ' ')
  echo "    $(basename "$f") (${SIZE} bytes)"
done

echo ""
echo "============================================================"
