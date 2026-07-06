# Lumeia Theme Development Playbook

How any change to the Lumeia Shopify theme gets made safely and repeatably. Pairs with README.md (themes, sync, deploy) and CONVENTIONS.md (the rules).

The principle: sessions are disposable, the written record is the memory. You approve the substance at each step, the AI writes the record, and irreversible or customer-facing actions stay with you.

## The loop

| Step | Stage | Command | Who | Records to |
|---|---|---|---|---|
| 0 | Cold start, see where we are | /status | you trigger | reads CHANGELOG + DECISIONS + git + theme |
| 1 | Scope the change (plan-critic on non-trivial work) | /scope-change | you + AI | a spec in `specs/` |
| 2 | Build on a branch, then Theme Check | /build | AI, with you for design | branch commits |
| 3 | Independent review | /review | AI, spawns theme-reviewer | review notes |
| 4 | Verify the rendered page, EN + AR, desktop + mobile (hard gate, before merge) | /verify | AI on a staging preview | evidence |
| 5 | Ship | /ship | AI records, you publish to live | CHANGELOG + DECISIONS + issues/docs reconciled |

### Verify is a hard gate (added 2026-06-28, after repeated render bugs shipped)

The independent review (step 3) reads code; it cannot see a clipped letter, a blown-up line-height, a wrong font, or a tap that does nothing. Those are only caught by opening the actual rendered page. So before asking the owner to merge any visual/CSS/layout change, verify the RENDER in **all four**: English desktop, English mobile, Arabic desktop, Arabic mobile.

How, without touching the live store or the GitHub-synced dev theme (which only updates on merge): push the branch to the one reusable preview theme (`shopify theme push --theme <staging id> --ignore templates/product.json` until product.json is slimmed), then check it. Desktop: Chrome (DOM + computed styles). Mobile + Arabic: the Playwright pattern in `scripts/` (computed styles are more reliable than `resize_window`, which does NOT reflow the viewport). Confirm fonts, weights, line-heights, spacing, and that interactions (e.g. the language switch) actually fire. Report the evidence, then PR. This is how the English→Almarai-on-Arabic bug was caught before the owner saw it.

**Arabic / RTL is the highest-risk surface — always test it.** The store sets Arabic fonts on `html[lang="ar"]`/`[dir="rtl"]` by pointing Pebble's `--font-*--family` variables at Almarai. Two consequences: (1) any rule that reads `var(--font-body--family)` resolves to Almarai on Arabic, so for text that must stay Latin (e.g. the word "English") use the literal font name, not the variable; (2) the whole header mirrors on Arabic (native Pebble RTL — we add no mirroring code). Never reintroduce broad `!important` font rules on `*`/`[class*="…"]`; scope to your own classes.

**Legacy `templates/product.json`** is the bloated default product template (25+ sections) used by the accessory/gift products. It breaks `shopify theme push`; until it is slimmed, push previews with `--ignore templates/product.json`.

## Risk tiers

| Tier | Examples | Gate |
|---|---|---|
| 0, safe | edits on the dev theme, building on a branch, reading, verifying | AI does freely |
| 1, review | merging a change into main (updates the dev theme), customer-facing content | you review the diff first |
| 2, you only | publishing to the live store, anything irreversible or outward-facing (vendor emails, app purchases, deletions) | you do it |

## Conventions

The rules every build and review follows live in CONVENTIONS.md, the single source. In short: schema-editable text, native-first, scoped CSS with brand tokens, RTL-safe, both PDP templates for shared changes, design references rebuilt not pasted. Custom blocks and sections reuse Pebble's own snippets (`spacing-style`, `typography-style`, `size-style`, `motion-component`) for native-grade controls rather than hand-rolling them, with paste-ready patterns in `.claude/SECTION-STANDARD.md` (rule 12). The theme-reviewer enforces them, and /build runs `shopify theme check` first to catch Liquid and schema errors the LLM reviewer cannot.

## Agents

- **plan-critic** — red-teams the change spec BEFORE building, on non-trivial changes, spawned by /scope-change. A cheap check that we are building the right thing.
- **theme-reviewer** — red-teams the built change against CONVENTIONS BEFORE merge, spawned by /review.

Both run in a fresh, independent context, so they judge work they did not write.

**Environment note (reviewer fallback).** `/review` spawns `theme-reviewer` by its registered agent type. That works in a normal `claude` CLI session opened inside this repo. In some environments (e.g. a different host app) the project's custom agent types are not registered as selectable, so `theme-reviewer` cannot be spawned by type. The fallback is NOT to skip review: spawn a `general-purpose` agent and instruct it to read and follow `.claude/agents/theme-reviewer.md` against `git diff main...HEAD`. Same independent, fresh-context review; only the invocation differs. The review step is never optional.

## Hooks

- **block-live-push** — blocks any command that pushes or publishes to the live theme (Tier 2, owner only). Tested.
- **session primer** — loads the rules and theme IDs at the start of each session in the repo.

(A guard that warns on hardcoded customer-facing text is a possible future addition, see PROCESS-TODO.md.)

## Templates

`.claude/templates/change-spec.md` (the scope of a change) and `.claude/templates/log-entry.md` (the ship log entry), so every change has the same shape.

## Durable record

- **CHANGELOG.md** — detailed history of theme changes, in the repo, shared with the team. Technical only. **The CHANGELOG and DECISIONS entry ships inside the feature PR's commit, not as a later step** — that is how it stops getting forgotten. At session start, `/status` compares CHANGELOG's newest date against `gh pr list --state merged` and flags any drift.
- **DECISIONS.md** — one line per change, the fast index.
- **GitHub issues + docs stay true.** Every shipped change reconciles with the issue tracker — comment on the issue it addresses, close it if done, re-scope it if partly done, or open a new issue for a follow-up or gap it surfaced — and fixes any doc it makes stale (README, CONVENTIONS, PLAYBOOK, section notes). See /ship step 2. The tracker and the docs must never claim work is pending that is already built, or a fresh developer redoes it (this happened: a stale README line sent a dev to rebuild a block that was already rebuilt).
- This PLAYBOOK, README and CONVENTIONS describe how we work.
- The owner's private journal (outside the repo) holds anything sensitive (people, hiring, billing), never the repo.

/status rebuilds state in any fresh session. As part of it: never push a follow-up commit to a branch whose PR has already merged (`gh pr view <branch>` must show OPEN first, else branch off main) — doing so re-creates an orphan remote branch that auto-delete won't clean. /status and /ship sweep `git branch -r` and delete any branch that is not a currently-open PR (`git push origin --delete <branch>`, content confirmed in main).

## Where it lives

In this repo: commands, agents and hooks under `.claude/`, the docs at the root. Open Claude Code inside the repo folder so the commands and hooks activate. Invited developers inherit all of it.

## Decisions on record

- Two PDP templates kept (Collagen leads, Thrive mirrors); consolidation only at catalogue growth.
- Task tracking: GitHub Issues (the connected Linear is the XO workspace, off-limits); a dedicated Lumeia Linear is a later option.
- Mobile verification: the Playwright script (`scripts/mobile-shot.js`) closes the gap; a phone screenshot is the fallback.
- Dev-to-live promotion (a `production` branch) is wired at launch, not before.
- Automation: human-triggered per step; the AI executes and records; live and outward actions stay with the owner.
