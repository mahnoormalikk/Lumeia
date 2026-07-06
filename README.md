# Lumeia Storefront Theme

Source of truth for the Lumeia (Siyada) Shopify theme. Built on Pebble (Foxtheme / Wellina). Connected to Shopify through the GitHub integration so the code here and the store stay in sync automatically.

## How we work

The development process is in PLAYBOOK.md (the loop and how changes are made) and the rules every change follows are in CONVENTIONS.md. Read those before making changes.

## Themes in the store

| Theme | ID | Role | GitHub |
|---|---|---|---|
| Lumeia x Wellina | 186928857468 | LIVE (customer-facing, password-gated until launch) | Not connected. Never edit directly. |
| DEV GitHub Lumeia x Wellina | 187485421948 | Development | Connected to branch `main`. All work happens here. |

## How the sync works

The `main` branch and the DEV theme are two mirrors of the same thing. Editing content in the DEV theme editor auto-commits it to `main`. Pushing code to `main` updates the DEV theme within about a minute. Deletions sync too.

Important: `main` and the DEV theme are NOT the customer-facing store. The DEV theme is unpublished and visible only to us in preview. So a change, reviewed or not, only ever appears in our dev workspace. Customers never see it until it is deliberately promoted to live (see below). The word `main` here means "our working copy," not "production."

One housekeeping rule: do not push code while the DEV theme is open in the editor, because the two writes can overwrite each other. This is a dev-theme concern only and has nothing to do with the live store.

## Going live (deploy)

Until launch the store is password-gated and all work happens on the DEV theme, so there is nothing to deploy yet.

At launch we connect the live theme (Lumeia x Wellina, 186928857468) to a second branch, `production`. From then on, going live means merging `main` into `production` after review, which updates the live theme. The live theme is the same theme throughout; it stays stable and only changes when we deliberately promote a reviewed batch of work. It never auto-updates from day-to-day dev edits, because those go to `main`, not `production`. The live theme is never edited directly in the Shopify editor.

## Theme updates

This Pebble theme was uploaded (bought from FoxEcom directly), not installed from the Shopify Theme Store. Shopify confirms this on the theme: "Updates are not supported for uploaded themes." So the version stays at whatever we have, currently 1.2.0, and will never change on its own. There is no Shopify update banner to worry about and nothing can auto-update under us.

New versions come only from FoxEcom directly. When there is a real reason to take one, we apply it as a controlled git merge: bring the fresh vanilla version in on a separate branch, diff it against our customised `main`, merge and resolve, test on the dev theme, then promote. Never install a new FoxEcom version straight onto the dev or live theme, because that overwrites our work. Bring it to the team to merge instead. The README rule about not bulk-editing FoxEcom's core files exists to keep these merges clean.

## Branches

`main` is the only working branch and it mirrors the DEV theme. For anything beyond a tiny content tweak, work on a short-lived branch and open a pull request so the change is reviewed as a diff before it merges into `main`. No other branches are needed right now.

## Theme structure

`sections/` holds page sections. `custom-section.liquid` is Pebble's native flexible section, so using it is correct and is not hand-coded. `blocks/` holds reusable blocks, and files starting with `_` are private sub-blocks. `templates/` holds JSON page templates, where `product.json` is Complete Collagen and `product.thrive-protein.json` is Thrive Protein. `assets/` holds CSS, JS and images, where `lumeia-custom.css` and `lumeia-custom.js` hold our overrides. `config/`, `locales/`, `layout/` and `snippets/` are standard Shopify.

## Rules

The full, canonical rules are in CONVENTIONS.md. In short: never hardcode customer-facing text (it must be a schema-editable field so Translate & Adapt can translate it), keep CSS scoped to its section, do not bulk-rewrite Pebble's core files, and all edits happen on the DEV theme. The payment and trust block has since been rebuilt as the schema-driven `blocks/lumeia-trust-stack.liquid` (with `_lumeia-payment-logo` child blocks for the payment badges, logo-or-text each), which is what the Collagen and Thrive PDPs use; the old `blocks/payment-icons-pdp.liquid` is deprecated and superseded, kept only until it is removed. Do not build on the old block.

## Indexing (SEO)

Some pages are deliberately kept out of search engines. The gift and accessory products have to stay published on the Online Store channel (Kaching adds them to the cart as 0 KWD line items and Smooth picks by order lines), but we do not want them found in Google. So `/collections/all`, the `/collections` list, the accessory products (product type `Accessory`), and the single-sachet samples (tag `single-sachet`) carry a `noindex,follow` tag. The two real product pages (Complete Collagen, Thrive Protein) and the homepage stay indexable, and Shopify already hides cart, checkout, account and search.

The how lives in one place: `snippets/lumeia-robots.liquid` (its header comment has the full list and reasoning), summarised as CONVENTIONS rule 15. To hide a new accessory from search automatically, set its product type to `Accessory`. If we ever want one of these pages to appear in search later, that snippet is the single place to change.

## Who does what

Frontend layout, content and sections: Stelios with Claude, directly on the DEV theme and repo. Backend, Arabic and RTL, app integrations, payments and logistics validation: the developer. Every change is a commit, reviewed before it reaches live.
