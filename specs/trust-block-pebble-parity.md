# Change: trust-block-pebble-parity

- **Date:** 2026-06-19
- **Branch:** `change-trust-block-pebble-parity`
- **Risk tier:** 1 (review before merge; merging updates the dev theme)
- **Scope:** once (a store-level block, `blocks/lumeia-trust-stack.liquid`)

## What
Take the rebuilt trust block (`blocks/lumeia-trust-stack.liquid`, already on dev from PR #57) from "editor-freedom v1" to genuine Pebble parity, by reusing Pebble's own snippets and setting patterns rather than hand-rolled reduced versions. Three additions/replacements:
1. Padding via Pebble's Desktop/Mobile **Devices** toggle (a `device` select + four desktop sides + four mobile sides), rendered through the theme's own `spacing-style` snippet and `.spacing-style` class. Replaces the current hand-rolled `padding_top` / `padding_bottom` + `mobile_padding_scale`.
2. Typography via Pebble's real system on each trust line: a `type_preset` (rte / paragraph / subheading / h1-h6 / custom); when Custom, unlock font / weight / size + size-mobile / line-height; plus a colour preset (text / subtext / gradient). Copied verbatim from `blocks/text.liquid` and rendered through the `typography-style` snippet + the theme's `custom-typography` / `custom-font-size` / preset / `color-*` classes. Replaces the current `*_font_size` / `*_weight` / `*_color` (scheme/muted/custom-hex) controls.
3. **Width** (Fit / Fill, desktop + mobile) via the `size-style` snippet + `.size-style` class (the group/custom-section idiom), and **Animation** (theme animations + None + delay ms) via `animation_type` / `animation_delay` gated by `settings.animations_enabled`, rendered with the native `motion-component` web component and `data-motion` attributes, copied from `blocks/text.liquid`.

## Why
CONVENTIONS rule 12 (editor-freedom) and Stelios's standing note: the block should be indistinguishable from a native Pebble section, not "improved Ali". v1 hand-rolled its padding/typography/colour as bespoke CSS-variable controls. That works but it is not native: it diverges from Pebble's controls, behaves differently (no clamp scaling, no theme type presets, no gradient text, no animation), and a merchant who knows Pebble will notice. Reusing Pebble's actual snippets makes the block behave exactly like `text` / `group` and removes bespoke CSS we would otherwise own.

## Success criteria
From the theme editor, with no code, on the trust block a merchant can:
- Set padding for all four sides, switching between Desktop and Mobile with the same Devices toggle Pebble's Group block uses, and have it scale exactly like a native block (clamp-based).
- For each trust line, pick a theme type preset (Default / Paragraph / Subheading / H1-H6) or Custom, and when Custom set font, weight, size + mobile size, line-height; and pick text colour (Text / Subtext / Gradient) with a gradient picker. Identical controls to a native Text block.
- Set the block Width to Fit or Fill, independently for desktop and mobile.
- Pick a scroll Animation (Fade in / up / slide) with a delay, only shown when theme animations are enabled, behaving like every other animated Pebble block.
The block still keeps: colour scheme, alignment (d/m), 8 logo slots with Kuwait visibility, coloured logos, per-device logo + icon sizes, geolocation note, Kuwait secure-line override. CSS stays scoped, colours/fonts come from theme tokens, layout is RTL-safe, no Pebble core file is edited.

## How to verify
- Theme Check: `shopify theme check` clean on the changed file (rule 11).
- Desktop: block renders on the dev PDP buy box with the new controls driving padding / type / width / animation. (Visual confirmation only possible once merged to dev — flag if so.)
- Mobile: `scripts/mobile-shot.js` against the dev PDP once merged.
- Editor: the new controls (Devices padding toggle, per-line type preset + Custom group, width d/m, animation) all appear and function.
- Untested-here, flag for a live test (rule 13): live Kuwait geolocation (KW vs non-KW), Arabic RTL of the new alignment/typography.

## Design reference
None new. The reference is Pebble's own `blocks/text.liquid`, `blocks/group.liquid`, `blocks/icon-box.liquid`, `sections/custom-section.liquid` and the snippets `typography-style`, `spacing-style`, `clamp-calculate-style`, `size-style`. Reuse, do not re-implement.

## Notes / decisions
- **Padding idiom:** Pebble has two. The Devices toggle (explicit desktop + explicit mobile, no scale) is used by `group.liquid` and `custom-section.liquid`; the single mobile-scale is used by `text.liquid`. They are mutually exclusive inside `spacing-style` (a present mobile value wins, so a scale next to explicit mobile ranges is a dead control). The task named "the device select pattern", which is the group/custom-section idiom and gives strictly more control, so we adopt the Devices toggle and drop `mobile_padding_scale`. Documented in `.claude/SECTION-STANDARD.md` (Task 2).
- **Colour control change:** v1 offered scheme / muted / custom-hex per line. Native `text.liquid` offers Text / Subtext / Gradient only (no arbitrary hex). To be native, we adopt Text / Subtext / Gradient. "Subtext" is the scheme's muted foreground, covering the old "muted". This drops arbitrary-hex per line on purpose, in exchange for native behaviour + gradient text.
- **Saved-instance gotcha (rule 13):** changing setting ids means the saved Thrive instance (`lumeia_trust_stack_y9TN9r`) keeps old keys (ignored) and renders new controls at their schema defaults. Stelios must re-open the block in the editor and re-set padding / type / colour after merge. Flag at ship.
- **Not in this change:** wiring the block onto both PDP templates and removing the old `payment-icons-pdp` (a separate deploy task, already tracked). Ali's `payment-icons-pdp.liquid` stays intact for comparison.
- Render the two trust-line typography classes on the text `<span>` only (not the icon+text row), so Pebble's preset/`paragraph > *` margin rules never touch the icon.
