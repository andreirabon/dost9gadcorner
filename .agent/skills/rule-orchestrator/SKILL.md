---
name: rule-orchestrator
description: Orchestrates which rules to apply before answering or coding, matching user intent to rule descriptions and ensuring consistent guidance.
---

# Rule Selection Orchestrator

Before answering or coding:

1. Review available rules in `.cursor/rules/` that are Applied Intelligently.
2. Match user intent to rule descriptions ("Apply when ...").
3. Explicitly follow all relevant matched rules before implementation.
4. If multiple rules match, prioritize: explicit user instruction > security > architecture > framework patterns > style.
5. Do not skip relevant intelligent rules when scenario is similar.
6. Resolve conflicts by favoring touched-module conventions and any "Project Reality Overrides (Highest Priority)" sections.
7. For Laravel ecosystem decisions, check Laravel Boost `search-docs` first; use Context7 as supplemental docs source.
8. If a rule suggests optional tooling (TS/lint/frontend tests), run it only when configured in the current branch/repo.
9. When rules disagree on stack details, prefer the latest verified project reality and explicit local overrides (for this project: Vue Options API is the default for new work).

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Inertia Laravel: 3.0.6
- @inertiajs/vue3: 3.0.3
- Vue: 3.5.33
- Tailwind CSS: 4.2.4
- Vite: 8.0.9
- Pest: 4.6.3
- PHPUnit: 12.5.23
