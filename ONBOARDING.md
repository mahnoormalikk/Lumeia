# Developer Onboarding — Lumeia Theme

Read this first. It is the short version. The full rules are in [CONVENTIONS.md](CONVENTIONS.md) and the workflow is in [PLAYBOOK.md](PLAYBOOK.md). Custom-section build standards are in [.claude/SECTION-STANDARD.md](.claude/SECTION-STANDARD.md).

## What this repo is

This is the Shopify storefront theme for Lumeia (Siyada), built on the Pebble theme. It is the look and content of the site, not the backend. Orders, payment and 3PL logistics are configured in the Shopify admin and connected apps, not here (see "Backend work" below).

## The one thing that will bite you: the two-way sync

The **dev theme** (id `187485421948`) is wired to GitHub `main` in **both directions**. When you merge to `main`, the change syncs down to the dev theme. When someone edits the dev theme in the Shopify theme editor, that syncs **up** to `main` as an "Update from Shopify" commit.

Because of this:

- **Never edit a template in git while it is open in the theme editor.** The two sides fight and one overwrites the other. Merge any template PR with the editor **closed** on that template.
- The **live theme** (id `186928857468`) is publish-only. Never touch it from here.

## Workflow (every change)

1. Branch off `main`. Never commit to `main` directly.
2. Build your change on the branch.
3. Run `shopify theme check` and fix any errors on your changed files before opening the PR.
4. Open a PR. Keep one PR to one logical change.
5. After it is merged, **read the GitHub sync log** on the dev theme. A green Theme Check is not proof it synced. Theme Check does not catch every rule the Shopify sync enforces (for example, range settings need at least 3 steps, and saved-instance values are validated only by the sync).
6. Verify the result on the dev preview, desktop and mobile, before calling it done.

One PR is one merge. If you need to change something after a merge, open a **new branch and a new PR** off `main`. Pushing more commits to an already-merged branch does nothing useful, it just orphans the commit and re-creates a stale remote branch.

This is now **enforced by a pre-push hook** (`.githooks/pre-push`): if you try to push to a branch whose PR is already merged, the push is blocked with a reminder to branch off `main`. One-time setup per clone (needs the `gh` CLI): `git config core.hooksPath .githooks`. Emergency override: `git push --no-verify`.

## Hard rules (these have broken things before)

- **Schema-editable, never hardcoded.** All customer-facing text and images are theme settings, so they can be translated to Arabic. No hardcoded strings in Liquid.
- **Never rename a setting `id`** on a block or section that already has a saved instance. It silently resets that setting to default. Adding new ids is safe.
- **RTL and Arabic safe.** Use logical CSS properties (start/end), not left/right. The store is bilingual; Arabic is a hard requirement.
- **CSS scoped to its section**, never bare native-class selectors that leak store-wide.
- **Native first.** Use Pebble's own sections and blocks; build custom only when native genuinely cannot do it, and then meet the editor-freedom standard in SECTION-STANDARD.md.
- **Both PDPs for shared changes.** `product.complete-collagen.json` leads, `product.thrive-protein.json` mirrors. `product.json` is the legacy default.

## Who does what

- **Settings and content tweaks** (padding, colours, copy, swapping a block) are done in the theme editor by the owner, with exact values supplied. No git for these.
- **Structural and code changes** (new blocks, new sections, CSS, template structure) are done in git via PR, merged with the editor closed.

## Access checklist

| Area | Where | Access |
|---|---|---|
| Theme / storefront | This GitHub repo | Added as a collaborator. Clone, branch, PR. |
| Theme preview | Shopify | The dev theme `187485421948`. |
| Backend (orders, payment, 3PL) | Shopify admin | A staff account with permissions for orders, apps and settings. |

## Backend work (orders, payment, 3PL)

This is **not** in this repo. Payment is configured in the Shopify admin plus a payment app. Getting orders into the Smooth Logistics 3PL is a Shopify-to-3PL integration configured in dashboards. If any of this needs **custom code** (a custom Shopify app or middleware), that gets its **own repo**, created when the work starts. Do not put backend code in this theme repo.

## Environment

- Store: `rff63p-wf.myshopify.com`
- Storefront: `itslumeia.com` (Arabic at `/ar/`)
- Preview the dev theme: add `?preview_theme_id=187485421948` to any storefront URL.
