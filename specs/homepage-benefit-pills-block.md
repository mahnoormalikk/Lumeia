# Change: homepage-benefit-pills-block

- **Date:** 2026-06-30
- **Branch:** `homepage-benefit-pills-block`
- **Risk tier:** 1 (review before merge; touches a Pebble core block's accepted-blocks list + homepage template)
- **Scope:** once (store-level blocks; wired into the homepage hero)

## What
Rebuild the hero slide's faked "benefit pills" (Ships across the GCC / Independently Tested / Halal Certified) and the faked "60-day money-back guarantee" icon line as real, Pebble-grade custom blocks the merchant fully controls.

## Why
Today both are faked in `assets/lumeia-custom.css` by hijacking Pebble native markup keyed off auto-generated section ids:
- pills = a single `text` block whose three italic words are styled via `.highlight-text--solid-background` (lines ~263-275)
- guarantee = a shield icon injected with a CSS `::before` on `[id$="__hero"] [class*="text_bdMqeg"]`

Consequences: not editable (you must bold the right words), not translatable cleanly, **not RTL-safe** (Space Grotesk hardcoded on the element, so once homepage copy is translated the pills render Latin font on Arabic), and fragile (keyed off a generated block id `text_bdMqeg`). Owner wants real pills like the IM8/Anthros references: per-pill icon + colour, row on desktop, **stackable vertically on mobile**.

## How
New blocks:
- `blocks/lumeia-benefit-pills.liquid` — public container (has preset, addable). Holds repeatable `_lumeia-pill` children via `content_for 'blocks'`. Controls: colour scheme, layout direction desktop + mobile (row-wrap / column = the vertical mobile stack), alignment d/m, gap d/m, width (fit/fill) d/m, padding d/m (device toggle), animation.
- `blocks/_lumeia-pill.liquid` — private child (`tag:null`, no preset). Per pill: icon (upload OR preset, optional, show/hide), icon position (inline-start / top), icon size d/m, icon colour; text (schema, translatable); typography preset (default `text-subheading`) + custom; pill background colour; text colour; border radius; inner padding; optional border.

Reuse (no new block): the existing `blocks/lumeia-list-item.liquid` for the guarantee line (icon upload + text, exactly the PDP block the owner referenced).

Wiring (one small Pebble-core edit): `blocks/_slide-content.liquid` only accepts `text`/`button`/`_spacer`. Add `lumeia-benefit-pills` and `lumeia-list-item` to its accepted `blocks` list — additive, no behaviour change to existing slides. Justified: this theme is uploaded (no Pebble auto-updates), so the usual "core edit blocks updates" risk is negligible; flagged as a documented exception to convention rule 3.

**Arabic-safe by construction:** pill text uses the `text-subheading` type preset, which resolves to Space Grotesk on English and Almarai on Arabic via the existing `--font-subheading--family` rules in `lumeia-custom.css`. No hardcoded font; text lives in schema so Translate & Adapt carries it.

## Sequencing (two PRs, to avoid the known nested-schema sync race)
- **PR-A:** the two new block files + the `_slide-content` whitelist. Schema registers.
- **PR-B (after PR-A merged + synced):** swap the hero `index.json` instance (text-pills -> `lumeia-benefit-pills` seeded with 3 pills; guarantee text -> `lumeia-list-item`) and delete the now-dead CSS hack from `lumeia-custom.css`.

## Success criteria
- Owner can add/remove/reorder pills, set each pill's icon/text/colour, and switch the row to a vertical stack on mobile, all from the theme editor.
- Hero renders the real blocks; the old `.highlight-text` pill CSS and the `::before` shield are gone.
- Pills render Space Grotesk on EN, Almarai on AR; layout mirrors correctly on RTL.

## How to verify
- Desktop: Chrome DOM + computed styles on staging (pill font per locale, bg/fg colours, radius, row layout).
- Mobile: Playwright iPhone 13 (column stack works; EN Mulish/Space Grotesk, AR Almarai).
- EN + AR both, desktop + mobile (hard gate before each merge).

## Design reference (reference only, rebuilt)
Owner screenshots: IM8/Elite-supplement benefit-pill cards (icon + text pill, 2-up) and Anthros "CORRECTS POSTURE / RELIEVES PAIN / ENHANCES FOCUS" (icon-on-top pills, 3-up, stack on mobile).

## Notes
- Container needed because `_slide-content` lays children in a column flex; a horizontal pill row needs its own flex-row wrapper.
- Land block schema before the template instance (SECTION-STANDARD race gotcha).
- Owner: keep the theme editor CLOSED on the homepage while PR-B's index.json is in flight.
