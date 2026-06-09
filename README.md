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
```

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
