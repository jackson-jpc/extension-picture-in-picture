#!/usr/bin/env bash
# Gera dist/chrome, dist/firefox e os dois .zip prontos para as lojas.
set -euo pipefail
cd "$(dirname "$0")"
command -v python3 >/dev/null || { echo "precisa de python3"; exit 1; }
rm -rf dist && mkdir -p dist
for target in chrome firefox; do
  cp -r src "dist/$target"
  python3 - "$target" <<'PY'
import json, sys
t = sys.argv[1]
base = json.load(open("manifest.base.json"))
extra = json.load(open(f"manifest.{t}.json"))
cs_extra = extra.pop("content_scripts_extra", {})
base.update(extra)
for cs in base["content_scripts"]:
    cs.update(cs_extra)
json.dump(base, open(f"dist/{t}/manifest.json", "w"), indent=2, ensure_ascii=False)
PY
  (cd "dist/$target" && zip -qr "../pip-unlocker-$target.zip" .)
  echo "ok: dist/$target  ->  dist/pip-unlocker-$target.zip"
done
