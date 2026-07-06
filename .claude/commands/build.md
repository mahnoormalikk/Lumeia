---
description: Build a scoped change on its branch, following the conventions.
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

Implement the agreed change on its branch. Re-read `CONVENTIONS.md` first and hold these while building:

- Every customer-facing string and image is a schema setting, never hardcoded (rule 1).
- Native Pebble section or block first; custom only when native cannot do it; never bulk-edit Pebble core files (rules 2, 3).
- CSS scoped to the section, brand tokens not raw values (rules 4, 5).
- RTL and Arabic safe by construction (rule 6).
- If a design reference was given, rebuild it as a compliant editable section; never paste exported or Figma code (rule 8).
- If the change is shared across both PDPs, apply to `product.complete-collagen.json` (lead) and `product.thrive-protein.json` (mirror); Collagen leads, Thrive mirrors (rule 7). Shared section code is one file and reaches both; only per-product content is duplicated. `product.json` is the legacy default, not a PDP.
- Reuse, do not duplicate (rule 9). Keep it surgical.
- For a custom block, build to the editor-freedom standard (rule 12, `.claude/SECTION-STANDARD.md`): copy the control patterns from Pebble's text/grid/icon-box/group/image blocks so the merchant can restyle and re-space it per device, not just edit text.

If you change the schema of a block or section that already has a saved instance (look in `templates/*.json`), do not silently break it. Renaming an id resets that control to default in the saved instance; reusing an id but tightening a constraint (raising a `range` min, removing a `select` option) makes any saved value that is now out of range FAIL the GitHub→theme sync and reject the whole template. Theme Check does NOT catch either — it does not validate saved-instance values. So either keep the constraint, or clean the saved instance(s) in the same change, and flag a saved-instance re-set at ship.

Before handing off, run `shopify theme check` and fix any errors it reports on the changed files (rule 11). The reviewer is an LLM and will not catch a Liquid syntax or schema error; this will. Commit in small, clear commits on the branch. Do not push to `main` or to live. Only with Theme Check clean, go to /review.
