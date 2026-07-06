---
description: Ship a verified change. Record it and merge to main (dev theme). Live publish stays with Stelios.
allowed-tools: Bash, Read, Edit
---

Only after /verify is clean.

1. Record (in the repo, shared with the team): append a detailed entry to `CHANGELOG.md` using `.claude/templates/log-entry.md` as the shape, and a one-line entry to `DECISIONS.md` (date · change · outcome · evidence). Keep both technical, no people, hiring, or billing detail — this repo is developer-visible. Anything sensitive goes only in the owner's private project journal (`~/Documents/Claude Context/current-projects/lumeia-pdp-build.md`).
2. Reconcile issues and docs. Check whether this change maps to a GitHub issue and act on it: comment with what shipped, close it if it is done, or update and re-scope it if only partly addressed; and open a new issue for any follow-up or gap the change surfaced (`gh issue comment|close|edit|create`). Then scan for any doc this change makes stale (README, CONVENTIONS, PLAYBOOK, section header comments, the build log) and fix it in this same branch before merge. Stale docs actively mislead: a README line calling an already-rebuilt block "slated for rebuild" once sent a developer to redo finished work on a deprecated block.
3. Merge the branch into `main` (this updates the dev theme automatically). Delete the branch, locally and on origin.
4. Tell Stelios it is on the dev theme, what to check, and that publishing to live is his to do when ready (Tier 2). Never publish to live yourself.

**One PR = one merge. Once a PR is merged its branch is closed: pushing more commits to it does nothing, the work never reaches `main` (this caused a real mix-up — improvements pushed to an already-merged branch were invisible to Stelios). So: any change after a merge is a NEW branch off `main` and a NEW PR. Before pushing a follow-up fix to a branch, confirm its PR is still open (`gh pr view <n> --json state`); if it is merged, branch fresh from `main`.**
