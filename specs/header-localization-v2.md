# Change spec — Header localization selector v2 (issue #53)

Follow-up to PR #90. Target: match Feel (wearefeel.com). Owner feedback after #90 merged.

## What Feel actually does (studied 2026-06-28, Chrome, desktop DOM)
- Closed button: `flag + country name + currency` (e.g. "🇬🇧 United Kingdom GBP").
- Open panel: a `ul` with header "Choose your region" then one row per region:
  `circular flag + country name + currency`. Padding `30px 30px 5px`, item font 16px.
- Feel has NO language toggle (UK English only) — the EN/العربية toggle is a Lumeia addition.
  We keep it on the closed button (flag + both language names, active marked), per owner.
- Mobile: the region selector lives INSIDE the hamburger menu as an expandable item, not crowding the logo.

## JS contract (assets/localization.js, Pebble core — do NOT edit)
- `selectCountry(iso, event)`: sets `countryInput.value` + `form.submit()`. Fires from any element
  with `on:click="/selectCountry/{iso}"`. → we CAN add a flag `<img>`/bg to each country row.
- `changeLanguage(event)`: only reads `event.target` when it is an `HTMLSelectElement`.
  → the language control MUST stay a native `<select>` (no custom button toggle without editing core).
- connectedCallback refs (search, countryContainer, countryList) are all optional (`&&` guarded).
- Required refs for function: `form`, `countryInput` (hidden), `languageInput` (select).

## PR1 — scope (this branch: header-loc-v2)

1. NEW `snippets/lumeia-localization-form.liquid` — custom panel (rule 3: don't edit Pebble's
   `localization-form.liquid`). Feel-clean layout reusing the component JS:
   - "Choose your region" header + country rows: circular flag (`country | image_url`) + name + currency,
     check on active, `on:click="/selectCountry/{iso}"`. No filter/popular list (Kuwait is the only market).
   - Language: native `<select>` kept (ref `languageInput`, `on:change="/changeLanguage"`), styled clean.
   - hidden `countryInput`, the `localization` form, `localization-form-component` wrapper with refs.
2. `snippets/lumeia-localization.liquid` — render the new panel instead of core `localization-form`.
3. `assets/lumeia-custom.css`:
   - Panel: fix padding (no descender clip), flags in rows, Feel spacing, scoped to `.header__localization`/`.lumeia-loc`.
   - Mobile closed button: shrink EN/العربية text so it stops crowding the centred logo (logo untouched).
   - Fonts (brand): `.lumeia-loc__lang` English → `--lumeia-font-ui` (Space Grotesk); `:lang(ar)` → Almarai.
   - Desktop hover-open helper styles.
4. `assets/lumeia-custom.js` — desktop-only: open the selector panel on hover (mouseenter), close on leave,
   scoped to `.header__localization--desktop`, reusing the component's open/close. Click still works.
5. `snippets/menu-drawer.liquid` — add the Feel-style localization at the TOP of the mobile drawer
   (flag + languages + region list), so the hamburger menu behaves like Feel.
6. CHANGELOG.md + DECISIONS.md entry IN this PR.

## PR2 — deferred (after PR1 merges + verified live)
- Transparent home-page header edge alignment (header_layout logo-left/logo-center + sticky_header transparent).
  Needs live visual diagnosis on the dev theme; not a blind edit.

## Verify (rule 10/13)
- Theme Check clean on changed files.
- theme-reviewer (independent) before PR.
- After owner merges: desktop in Chrome (DOM + computed styles), mobile via `scripts/mobile-shot.js`
  (resize_window does NOT reflow the viewport — confirmed innerWidth stays 1512).
- RTL: check `html[lang="ar"]` panel mirrors and Almarai renders.

## Coordination
- Touches core header.liquid + menu-drawer.liquid → merge with the Theme Editor CLOSED.
- Owner merges (Tier 1). Owner publishes to live (Tier 2) — not in scope here.
