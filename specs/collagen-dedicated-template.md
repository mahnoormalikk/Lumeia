# Change: collagen-dedicated-template

- **Date:** 2026-06-19
- **Branch:** `change-collagen-dedicated-template`
- **Risk tier:** 1 (review before merge; merging updates the dev theme). The admin step (assigning the product to the template) is tier 2, Stelios.
- **Scope:** twice (both PDP templates touched, kept in sync; Collagen leads)

## What
Give Complete Collagen its own dedicated product template `templates/product.complete-collagen.json` (mirroring how Thrive has `product.thrive-protein.json`), and in the same change wire the rebuilt trust block onto Collagen and drop Ali's old `payment-icons-pdp` instance from both PDPs.

## Why
Right now Collagen renders from the default `product.json` while Thrive has a named template. It is asymmetric and the default doubles as Collagen's build, so the other products on the default inherit Collagen content. A dedicated per-SKU template for each of the two real products is cleaner and makes the both-products workflow unambiguous. Collagen also still shows Ali's old payment block instead of the rebuilt trust block.

## Success criteria
- `templates/product.complete-collagen.json` exists, byte-identical to the current `product.json` except: the `payment_icons_pdp_*` block is replaced by a `lumeia-trust-stack` block, in the same slot Thrive uses.
- The Collagen trust block instance is written in the rebuilt (parity) schema and seeded with the same payment logos and icons as the Thrive instance, so it renders correctly with no editor re-set and no re-upload.
- `product.thrive-protein.json` keeps its trust block and no longer carries the redundant old `payment-icons-pdp` instance.
- Both PDP templates end with exactly one payment/trust display (ours), symmetric.
- Ali's `blocks/payment-icons-pdp.liquid` file is untouched (kept for the 3-way comparison); only the on-page instances are removed.
- `product.json` (default) is left as-is for now; no other products launch standalone yet.

## How to verify
- Theme Check clean on the changed files (rule 11).
- After merge + admin assignment: Collagen renders from the dedicated template on the dev PDP, trust block shows logos + two lines, old payment row gone; Thrive unchanged except the redundant old payment row gone.
- Mobile: `scripts/mobile-shot.js` on the dev Collagen PDP once assigned.
- Untested here, flag (rule 13): the admin template-assignment availability (the new template must appear in Collagen's Theme-template dropdown), live Kuwait geolocation, Arabic RTL.

## Notes / decisions
- Combine the dedicated-template creation with the trust-block wiring so it is one merge and one admin pass, not assign-then-patch.
- Removing Ali's instance from both pages is the documented "replace the old block" intent. The file stays for comparison; Stelios can re-add the instance in the editor or veto at PR review.
- `product.json` stays the default fallback; neutralising it to a generic template is an optional later cleanup (logged), not needed while only Collagen and Thrive launch.
- Rule 7 reference updated: the canonical PDP pair is now `product.complete-collagen.json` (lead) and `product.thrive-protein.json` (mirror); `product.json` is the legacy default.
- Editor must be closed when this merges, or the open-editor auto-revert can fight the template JSON sync.
