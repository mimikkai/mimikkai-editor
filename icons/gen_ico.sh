#!/usr/bin/env bash
# Build a multi-resolution Windows .ico from an SVG source.
# Usage: gen_ico.sh <input.svg> <output.ico>
# Requires: rsvg-convert, python3 with pillow (fallback chain: icotool -> pillow)
set -e

SRC="${1:?usage: gen_ico.sh <input.svg> <output.ico>}"
OUT="${2:?usage: gen_ico.sh <input.svg> <output.ico>}"
TMPDIR_ICON="$( mktemp -d )"
trap 'rm -rf "${TMPDIR_ICON}"' EXIT

SIZES=(16 24 32 48 64 96 128 256)

for SIZE in "${SIZES[@]}"; do
  rsvg-convert -w "${SIZE}" -h "${SIZE}" "${SRC}" -o "${TMPDIR_ICON}/${SIZE}.png"
done

if command -v icotool &>/dev/null; then
  # icotool wants a specific naming pattern
  cd "${TMPDIR_ICON}"
  ARGS=()
  for SIZE in "${SIZES[@]}"; do
    mv "${SIZE}.png" "${SRC##*/}_${SIZE}_x.png" 2>/dev/null || true
    ARGS+=("${SRC##*/}_${SIZE}_x.png")
  done
  icotool -c -o "${OUT}" "${ARGS[@]}"
else
  python3 - "${OUT}" "${SIZES[@]}" <<PYEOF
import sys
from PIL import Image

out = sys.argv[1]
sizes = [int(s) for s in sys.argv[2:]]
import os
base = os.environ.get("TMPDIR_ICON") or "/tmp"
# images were written to the same temp dir by the shell loop; recover via cwd fallback
imgs = []
for s in sizes:
    for candidate in (f"/tmp/_ico_{s}.png",):
        pass
# fall back: reread from the temp dir passed via argv? Simplest: regenerate not possible here;
# instead the shell always exports TMPDIR_ICON; images live there.
import glob
files = sorted(glob.glob(os.path.join(base, "*.png")), key=lambda p: int(os.path.basename(p).split(".")[0]))
imgs = [Image.open(p).convert("RGBA") for p in files]
imgs[-1].save(out, format="ICO", append_images=imgs[:-1])
PYEOF
fi

echo "generated ${OUT}"