# GitHub setup — task-manager (Tier B minimal)

One-time configuration for **GitHub Issues + Projects v2** with **minimal** headless automation. Full queue (Tier A): [AI-DLC GITHUB-AIDLC-QUEUE.md](../.claude/deps/ai-dlc/docs/GITHUB-AIDLC-QUEUE.md).

## Already configured (2026-06-09)

| Item | Value |
|------|--------|
| **Projects v2 board** | [AIDLC — task-manager](https://github.com/users/queen-of-code/projects/8) (project **#8**) |
| **Board view** | **AI Workflow** — columns grouped by **AIDLC phase** ([view 1](https://github.com/users/queen-of-code/projects/8/views/1)) |
| **AIDLC phase field** | `Idea`, `Plan`, `Design`, `Build`, `Review`, `Ship`, `Done`, `Won't do` |
| **Repo link** | Linked to `queen-of-code/task-manager` |
| **Labels** | `aidlc_work:unstarted`, `aidlc_work:in_progress` |
| **Actions variables** | `AIDLC_PROJECT_OWNER`, `AIDLC_PROJECT_OWNER_TYPE`, `AIDLC_PROJECT_NUMBER`, `AIDLC_PHASE_FIELD_NAME` |

## Remaining — secrets (you only)

Headless agent launch needs these; they cannot be created without your API keys:

## 1. GitHub Actions secrets

| Secret | Purpose |
|--------|---------|
| `CURSOR_API_KEY` | [Cursor Integrations → API Keys](https://cursor.com/dashboard/integrations) |
| `AIDLC_PROJECT_PAT` | PAT with **`project`** scope for Projects v2 GraphQL |

## 2. Cursor Cloud Agent env (not GitHub)

| Name | Purpose |
|------|---------|
| `AIDLC_GH_CALLBACK_TOKEN` | PAT with **`repo`** — agent comments on issues and clears `aidlc_work:in_progress` |

## 3. Per-Feature workflow

1. Create GitHub issue for the Feature; body links `feature/<slug>/`.
2. Add issue to the Projects v2 board; set **AIDLC phase** (e.g. `Plan`).
3. Copy `feature/_template/` → `feature/<slug>/` (or let `/plan` create specs).
4. Apply label **`aidlc_work:unstarted`** → `aidlc-agent-launch.yml` starts the phase agent.
5. Review agent output; merge PR when ready → `aidlc-phase-advance.yml` moves board + re-applies `unstarted`.
6. After moving a card manually, run **AIDLC project label sync** (`workflow_dispatch`) or re-apply `aidlc_work:unstarted`.
7. After **Ship** PASS, run **`/learn`** manually in Cursor (not in Actions).

## 4. Submodule on clone

```bash
git submodule update --init --recursive
```

Cloud Agents: `.cursor/environment.json` runs this on agent start.
