#!/usr/bin/env bash
set -euo pipefail
PORT="${1:-8080}"
cd "$(dirname "$0")"
echo "St. Ann's Saints CYO Sports is running at http://localhost:${PORT}"
exec python3 -m http.server "$PORT"
