# ADR-0001: Next.js full-stack with Prisma and PostgreSQL

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-09 |
| **Deciders** | Melissa Benua (Design phase, issue #1) |
| **Related** | [Product Spec](../feature/app-skeleton/product-spec.md), [Tech Spec](../feature/app-skeleton/tech-spec.md), [#1](https://github.com/queen-of-code/task-manager/issues/1) |

---

## Context

The **task-manager** repository is greenfield — no application code, no database, no CI for the app. The first Feature (**app-skeleton**) must deliver a runnable web Kanban board with **database-backed persistence** for a solo local operator. `AGENTS.md` already documents local dev at `http://127.0.0.1:3000`, which aligns with common Node web defaults.

Constraints:

- Single developer, local-first; no production deployment in this Feature.
- Product Spec requires data to survive browser refresh **and** app restart — a real database process, not in-memory or browser-only storage.
- Future Features (auth, GitHub sync, multiple boards) need a stable foundation without re-scaffolding.
- Build agents need one deployable Unit with clear API/UI boundaries for Review.

## Decision

Adopt a **monolithic full-stack Next.js 16** application (App Router, TypeScript) at the repository root, with:

- **Prisma** as the ORM and migration tool.
- **PostgreSQL 16** as the database, run locally via **Docker Compose**.
- **REST JSON API routes** under `app/api/` for all card/board mutations; the browser is a client that does not own business rules or persistence.
- **Vitest** for unit and API integration tests; **Playwright** for CI smoke tests only (UI validation in Review uses Chrome DevTools MCP per `docs/INTERACTIVE-UI-VALIDATION.md`).

Layering:

```
Browser (React + shadcn/ui)
    → Next.js Route Handlers (app/api/*)
        → Service layer (lib/services/*)
            → Prisma → PostgreSQL
```

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| **A — Next.js 16 + Prisma + PostgreSQL (chosen)** | Full-stack monolith; dockerized Postgres | — |
| B — Next.js + SQLite file | Simpler local setup, no Docker | Weaker match to “app + database” dev story; harder path to multi-user/hosted Features |
| C — Separate SPA + Express API | Clear split | Extra scaffolding for a solo greenfield skeleton; more moving parts for Tier B automation |
| D — Browser-only (IndexedDB / localStorage) | Fastest prototype | Violates Product Spec persistence requirement |

## Consequences

### Positive

- One process (`next dev`) plus one container (`postgres`) matches documented local dev URL.
- Prisma migrations give Review a concrete schema contract.
- Route Handlers keep API and UI in one repo/PR for the first Feature.
- PostgreSQL is a credible base for later auth and sync Features.

### Negative / trade-offs

- Requires Docker for local database (document clearly in README).
- Monolith couples UI and API deploys until a future split Feature.
- Cold start and Node toolchain are heavier than a static SPA.

### Neutral / follow-ups

- Production hosting, connection pooling, and backups are out of scope until a deploy Feature.
- Consider SQLite or embedded Postgres only if Docker proves blocking for contributors.

## Compliance & verification

- `prisma/schema.prisma` is the schema source of truth; migrations committed with schema changes.
- API handlers must not import React components; `lib/` holds domain and persistence logic.
- CI runs `prisma validate`, unit tests, API integration tests, and `next build`.

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma](https://www.prisma.io/docs)
- [Product Spec — App skeleton](../feature/app-skeleton/product-spec.md)
