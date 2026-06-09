# task-manager

Lightweight project management, built with the [AI-DLC](https://github.com/queen-of-code/AI-DLC) (AI Development Lifecycle).

## Process

- **Lifecycle:** [docs/AIDLC.md](docs/AIDLC.md)
- **Agent guardrails:** [AGENTS.md](AGENTS.md)
- **Project context:** [PROJECT.md](PROJECT.md)
- **GitHub automation (Tier B):** [docs/github-setup.md](docs/github-setup.md)

## Quick start (developers)

```bash
git clone https://github.com/queen-of-code/task-manager.git
cd task-manager
git submodule update --init --recursive
cp .env.example .env
npm install
npm run db:up
npx prisma migrate dev
npm run dev
# open http://127.0.0.1:3000
```

**Requirements:** Node.js 22+, Docker (for PostgreSQL 16).

| Command | Purpose |
|---------|---------|
| `npm run db:up` | Start PostgreSQL via Docker Compose |
| `npx prisma migrate dev` | Apply database migrations |
| `npm run dev` | Next.js dev server at `http://127.0.0.1:3000` |
| `npm test` | Unit + API integration tests (needs DB) |
| `npm run build` | Production build |

## Starting a Feature

1. Create a GitHub issue and Projects v2 card (field **AIDLC phase**).
2. In Cursor, run **`/plan`** with the feature slug, or apply label `aidlc_work:unstarted` to launch the Cloud Agent.
3. Specs land in `feature/<slug>/` after human gates per [docs/AIDLC.md](docs/AIDLC.md).

## Layout

```
.claude/deps/ai-dlc/   # AI-DLC skills submodule
.claude/skills/        # symlink → deps/ai-dlc/skills
feature/<slug>/        # Product Spec + Tech Spec per Feature
adr/                   # Architectural decision records
docs/                  # AIDLC + setup guides
```
