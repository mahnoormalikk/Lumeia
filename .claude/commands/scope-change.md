---
description: Scope a change before building. Produces a written change spec and creates the branch.
allowed-tools: Bash, Read, Write
---

No building until the spec is agreed. Discuss with Stelios until it converges, then write it using `.claude/templates/change-spec.md` as the shape. Capture:

- What: the change, one or two lines.
- Why: the goal or problem.
- Success criteria: how we know it is done.
- How to verify: the desktop check, the mobile check (script or screenshot), the specific things to confirm.
- Risk tier: 0 (dev only, I do freely), 1 (review before merge), 2 (touches live or is irreversible, Stelios only).
- Once or twice: does it hit both PDP templates, or is it store-level (once)?
- Design reference: Figma link, URL, or screenshot if any. Reference only, we rebuild it, never paste exported code (CONVENTIONS rule 8). Prefer reading the Figma via the connector.
- Native or custom: can Pebble's own sections/blocks do this (rule 2, native-first)? If a custom block is needed, list the editor controls it must expose per `.claude/SECTION-STANDARD.md` (rule 12) — typography, colour, width, padding, sizes, layout, per device.
- Feasibility: for anything depending on external behaviour (geolocation, an app's limits, payments, logistics), state how it will be tested. Do not assume it works (rule 13).

Write the spec to `specs/<short-name>.md`, append a one-liner to `DECISIONS.md`, then create branch `change-<short-name>` off `main`. For a non-trivial change (a new section, a new feature, anything design-heavy) spawn the `plan-critic` agent on the spec and relay its verdict to Stelios before building; skip it for tiny tweaks. Then hand to /build.
