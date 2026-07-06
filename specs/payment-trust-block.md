# Change: payment-trust-block (rebuild)

- **Date:** 2026-06-18
- **Branch:** `change-payment-trust-block`
- **Risk tier:** 1 (review before merge)
- **Scope:** once (a store-level block; renders in the PDP buy box on both products)

## What
Rebuild the buy-box payment-and-trust strip (currently `blocks/payment-icons-pdp.liquid`) as a proper, fully editable, translatable block.

## Why
The current one is hardcoded English text "badges" (KNET / VISA / MC), with the guarantee and secure-checkout lines baked into the liquid. Nothing is editable and nothing surfaces in Translate & Adapt, so it cannot go Arabic. This is also the first real run of the workflow and the trial-task benchmark.

## Success criteria
From the theme editor, with no code, a merchant can:
- Add, remove and reorder payment logos, each via image upload (real logos, not text): KNET, Visa, Mastercard, Apple Pay, Google Pay, AmEx.
- Toggle a logo as Kuwait-only, so KNET shows only to KW visitors and AmEx can be hidden for KW (keep the current geolocation behaviour).
- Edit the two trust lines (the 60-day guarantee line, and the secure-checkout line) as schema text, so they surface in Translate & Adapt and can be set in Arabic. Each line also has a custom-uploadable icon at a custom size.
Colours and fonts come from brand tokens, CSS is scoped to the block, the layout is RTL-safe, and it is a standalone block that does not edit any Pebble core file.

## How to verify
- Desktop: renders correctly on the dev PDP buy box.
- Mobile: `scripts/mobile-shot.js` on the dev PDP.
- Editable: every logo and both text lines are editable in the theme editor.
- Translatable: the two text lines appear in Translate & Adapt.
- Geolocation: KNET shows for a Kuwait visitor and is hidden otherwise.

## Design reference
Match the current intent (subtle, greyscale-style payment logos in a row, then the guarantee line, then the secure-checkout line), but with real uploaded logos instead of text and everything editable. Reference only.

## Notes
The Kuwait geolocation (`localization.country.iso_code == 'KW'`) is the one part that genuinely needs Liquid; keep it. Brand tokens live in `assets/lumeia-custom.css`. This is the only hand-written file the prior developer left, so rebuilding it cleanly is also the model for "custom but editable."
