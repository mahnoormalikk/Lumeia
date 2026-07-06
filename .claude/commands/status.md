---
description: Cold start. Reconstruct where the Lumeia theme work stands and give the single next action.
allowed-tools: Bash, Read
---

Reconstruct the current state, then state the one next action. Do not start work; just orient.

1. Read `CHANGELOG.md` and `DECISIONS.md` (this repo, the shared record) for recent changes. Optionally glance at the owner's private journal at `~/Documents/Claude Context/current-projects/lumeia-pdp-build.md` for wider project context if available.
2. Git: current branch, `git status -s`, `git log --oneline -6`, and whether the branch is ahead of `main`.
3. Theme state: `shopify theme list --store lumeia-5.myshopify.com --json` (IDs are 12 digits; dev = "DEV GitHub Lumeia x Wellina" 187485421948, live = "Lumeia x Wellina" 186928857468).
4. Output, briefly: where we are (branch, what is in flight, what is blocked on Stelios), then THE single next action.
