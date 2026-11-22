#!/usr/bin/env bash
# Assemble a self-contained release directory from a completed `next build`.
#
# Next's standalone output traces the JS it can see, but it cannot know about
# data read at runtime. Several routes read markdown and JSON via process.cwd()
# (/micro-dev-tips/[id], /learn10/[id], /system-design/[id], the java interview
# and practice guides, the learning tracks). Those directories are copied in
# explicitly below — if a route 404s or renders a placeholder after a deploy,
# this list is the first thing to check.
set -euo pipefail

SRC_DIR="${1:-.}"
OUT_DIR="${2:-release}"

cd "$SRC_DIR"

if [[ ! -d .next/standalone ]]; then
  echo "error: .next/standalone missing — build with output:'standalone' first" >&2
  exit 1
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# 1. The traced server and its minimal node_modules.
cp -R .next/standalone/. "$OUT_DIR"/

# 2. Static assets, which standalone deliberately leaves out.
mkdir -p "$OUT_DIR/.next"
cp -R .next/static "$OUT_DIR/.next/static"
[[ -d public ]] && cp -R public "$OUT_DIR/public"

# 3. Content read from disk at request time, relative to cwd.
RUNTIME_PATHS=(
  dailyblogsdb
  dailyblogsjava
  dailyblogsreact
  dailyblogtips
  gfgblogs
  learn10
  tech_battles_blogs
  src/content
  src/data
  src/posts
)
for p in "${RUNTIME_PATHS[@]}"; do
  if [[ -e "$p" ]]; then
    mkdir -p "$OUT_DIR/$(dirname "$p")"
    cp -R "$p" "$OUT_DIR/$p"
  else
    echo "warning: runtime path '$p' not found in source tree" >&2
  fi
done

# 4. Stamp the release so the running version is identifiable on the box.
git rev-parse HEAD > "$OUT_DIR/RELEASE_SHA" 2>/dev/null || echo "unknown" > "$OUT_DIR/RELEASE_SHA"
date -u +"%Y-%m-%dT%H:%M:%SZ" > "$OUT_DIR/RELEASE_AT"

echo "release assembled at $OUT_DIR ($(du -sh "$OUT_DIR" | cut -f1))"
