---
description: Verify a change actually works on the dev theme. Pull-verify plus visual, desktop and mobile.
allowed-tools: Bash, Read
---

Verify on the DEV theme (187485421948), per the shipping protocol. A push success message is not proof.

1. Theme Check: `shopify theme check` reports no errors (Liquid syntax, schema) on the changed files. If it does, it was not ready to ship. Note: Theme Check is NOT the sync's validator — it does not check saved-instance setting values against the schema. After a merge that touches a template or a block schema, read the GitHub→theme sync log (admin → theme → GitHub) for a per-file "Validation failed" / "succeeded/failed" line; a rejected file silently does not apply even though Theme Check was clean.
2. Synced: pull the changed files back from the dev theme and grep for the change. State file, line, and the exact string matched.
3. Desktop visual: check computed styles or rendered DOM via Chrome tools where layout matters.
4. Mobile: run `scripts/mobile-shot.*` against the dev preview and read the PNG. If the script is not in place yet, ask Stelios for one cropped phone screenshot (crop under ~1800px tall to avoid the image-size limit).
5. Assumptions tested, not assumed: anything depending on external behaviour (geolocation with a switched-country session, an app's actual behaviour, a third-party limit) is tested live. If it genuinely cannot be tested here, say so and flag it for a real test before launch — never report it verified (rule 13).
6. Report the evidence. If anything does not match intent, diagnose before declaring done. Never tell Stelios to "hard-reload and check", verification is our job.
