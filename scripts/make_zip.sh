#!/usr/bin/env bash
set -euo pipefail
zip -r regintel_bundle.zip . -x "*/node_modules/*" "*/venv/*" "*/__pycache__/*" ".git/*" "regintel_bundle.zip"
