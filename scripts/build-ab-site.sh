#!/usr/bin/env bash
# Build the deployed site:
#   site/         — current version (v1, from Vite dist/)
#   site/v0/      — original vanilla version, exported from v0.2-vanilla tag
#
# Run from repo root after `npm run build`. Designed to work in CI and locally.

set -euo pipefail

OUT_DIR="${1:-site}"
V0_TAG="${V0_TAG:-v0.2-vanilla}"

if [[ ! -d dist ]]; then
  echo "error: dist/ not found. Run 'npm run build' first." >&2
  exit 1
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# Current version = root
cp -R dist/. "$OUT_DIR/"

# Original version = subdir, archived directly from tag (no rebuild)
mkdir -p "$OUT_DIR/v0"
git archive "$V0_TAG" | tar -x -C "$OUT_DIR/v0"

echo "Built $OUT_DIR/ (v1 at root, v0 at v0/ from $V0_TAG)"
