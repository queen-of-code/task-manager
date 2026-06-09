# task-manager

Lightweight project management — track work items, phases, and delivery using the AIDLC V-model.

## Status

**App skeleton** (issue #1) in Build — Next.js 16 Kanban board with PostgreSQL persistence. See `feature/app-skeleton/tech-spec.md`.

## Repository map

| Path | Purpose |
|------|---------|
| `docs/AIDLC.md` | Canonical AI Development Lifecycle |
| `AGENTS.md` | Tracker, automation tier, stack, UI validation |
| `feature/<slug>/` | Product Spec + Tech Spec per Feature |
| `adr/` | Architectural decision records |
| `.claude/deps/ai-dlc/` | Vendored AI-DLC skills library (submodule) |
| `.github/workflows/aidlc-*.yml` | Tier B headless agent launch (minimal) |

## Next step

Run **`/plan`** in Cursor for the first Feature (or create a GitHub issue + Projects v2 card in **Plan**, add `aidlc_work:unstarted` to launch the Plan agent).
