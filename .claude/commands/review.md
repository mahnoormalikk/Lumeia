---
description: Independent review of the current change before merge. Spawns the theme-reviewer agent.
allowed-tools: Bash, Read
---

Spawn the `theme-reviewer` agent (via the Agent tool, subagent_type theme-reviewer) to review the current branch's diff against `main`. Give it the change spec from `specs/` if one exists.

Relay its findings and its merge recommendation to Stelios in full. Do not merge, the human decides. If it returns BLOCK or fixable findings, fix them on the branch and re-run /review until it is clean or Stelios accepts the remaining suggestions.
