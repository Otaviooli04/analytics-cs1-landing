#!/usr/bin/env bash
# Sobe a landing em um servidor local. Uso: ./run.sh [porta]
set -e
cd "$(dirname "$0")"
PORTA="${1:-8080}"
echo "Landing no ar em http://localhost:$PORTA   (ctrl+c para parar)"
python3 -m http.server "$PORTA" --bind 127.0.0.1
