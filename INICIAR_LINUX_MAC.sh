#!/usr/bin/env bash
# ====================================================================
# ESSENCIAL ENERGIA - EXECUTOR PARA LINUX E MACOS
# Revisao: REV 001/2026 | Desenvolvido por Jonthan Oliveira
# ====================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================================"
echo "  ESSENCIAL ENERGIA - GESTOR DE ORDENS DE CARREGAMENTO"
echo "  MODO PORTATIL PARA PENDRIVE"
echo "  Revisao: REV 001/2026 | Desenvolvido por Jonthan Oliveira"
echo "======================================================================"
echo ""

PORTA=3000
while lsof -Pi :$PORTA -sTCP:LISTEN -t >/dev/null ; do
    PORTA=$((PORTA+1))
done

echo "Iniciando em: http://localhost:$PORTA"

if command -v python3 &>/dev/null; then
    (sleep 1 && (xdg-open "http://localhost:$PORTA" 2>/dev/null || open "http://localhost:$PORTA" 2>/dev/null)) &
    python3 -m http.server $PORTA --directory dist
elif command -v python &>/dev/null; then
    (sleep 1 && (xdg-open "http://localhost:$PORTA" 2>/dev/null || open "http://localhost:$PORTA" 2>/dev/null)) &
    python -m SimpleHTTPServer $PORTA
elif command -v npx &>/dev/null; then
    npx vite preview --port $PORTA
else
    echo "Abra o arquivo dist/index.html diretamente no seu navegador."
fi
