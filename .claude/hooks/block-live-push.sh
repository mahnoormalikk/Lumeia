#!/usr/bin/env bash
# Blocks any Bash command that pushes or publishes to the LIVE theme.
# Live = 186928857468 ("Lumeia x Wellina"). Publishing to live is Tier 2 (Stelios only).
# Reads the tool call JSON on stdin; exit 2 blocks the call, stderr is the reason.
input=$(cat)
cmd=$(printf '%s' "$input" | python3 -c "import json,sys
try: print(json.load(sys.stdin).get('tool_input',{}).get('command',''))
except Exception: print('')" 2>/dev/null)

if printf '%s' "$cmd" | grep -qiE 'theme +(push|publish)' && \
   printf '%s' "$cmd" | grep -qE '186928857468|--live|--allow-live'; then
  echo "BLOCKED: this targets the LIVE theme (186928857468). Publishing to live is Tier 2 — Stelios does it. Work on the dev theme 187485421948 and let Stelios publish." >&2
  exit 2
fi
exit 0
