#!/usr/bin/env bash
set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $branch"

git status --short

git add .
msg=${1:-"chore: update RegIntel monorepo"}
git commit -m "$msg"
git push origin main
