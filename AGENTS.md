# task-manager — agent instructions

Lightweight project management app built with the [AI-DLC](https://github.com/queen-of-code/AI-DLC) process.

**Read first:** `docs/AIDLC.md` (canonical lifecycle). This file records **repo-specific** overrides and transport.

## Issue tracker (AIDLC)

| Field | Value |
|--------|--------|
| **System** | `github-issues` + **GitHub Projects v2** |
| **Work item for a Feature** | One GitHub issue per Feature; link in issue body to `feature/<slug>/` |
| **Phase signal** | Projects v2 single-select field **`AIDLC phase`**: `Idea`, `Plan`, `Design`, `Build`, `Review`, `Ship`, `Done`, `Won't do` |
| **Parent ↔ `feature/<slug>/`** | Issue body includes `Feature folder: feature/<slug>/` and links to `product-spec.md` / `tech-spec.md` when they exist |
| **Automation tier** | **B — Minimal starter** — see [docs/github-setup.md](docs/github-setup.md) |
| **Automation entry points** | Label `aidlc_work:unstarted` → [`.github/workflows/aidlc-agent-launch.yml`](.github/workflows/aidlc-agent-launch.yml); PR merge → [`.github/workflows/aidlc-phase-advance.yml`](.github/workflows/aidlc-phase-advance.yml); manual label reset → [`.github/workflows/aidlc-project-label-sync.yml`](.github/workflows/aidlc-project-label-sync.yml) (`workflow_dispatch`) |

**Notes:** Projects v2 does not emit `project_card` webhooks. After moving a card on the board, run **AIDLC project label sync** (workflow dispatch) or manually set `aidlc_work:unstarted` on the issue. Upgrade to Tier A (full queue) when ready: [AI-DLC GITHUB-AIDLC-QUEUE.md](.claude/deps/ai-dlc/docs/GITHUB-AIDLC-QUEUE.md).

## Phase orchestrators

Invoke in Cursor chat (skills from global AI-DLC install or `.claude/skills` symlink):

| Command | Phase |
|---------|-------|
| `/plan` | Plan (+ Design in combined orchestrator) |
| `/design` | Design only (if split from plan) |
| `/build` | Build + Test (TDD) |
| `/review` | Review |
| `/ship` | Validate |
| `/learn` | Learn (after Validate PASS — not automated in Tier B) |

## Stack (planned)

| Layer | Choice |
|-------|--------|
| **App** | Full-stack web — frontend + backend API (details in first Feature Tech Spec) |
| **Specs** | `feature/<slug>/product-spec.md`, `feature/<slug>/tech-spec.md` |
| **ADRs** | `adr/NNNN-slug.md` — see [adr/README.md](adr/README.md) |
| **AI-DLC library** | Git submodule at `.claude/deps/ai-dlc` (pin a release tag for production) |

## UI validation environments

Procedure: [docs/INTERACTIVE-UI-VALIDATION.md](docs/INTERACTIVE-UI-VALIDATION.md). Tool: **Chrome DevTools MCP** (`chrome-devtools`) — see [`.cursor/mcp.json.example`](.cursor/mcp.json.example).

| Field | Value |
|--------|--------|
| **Local dev URL** | `http://127.0.0.1:3000` (update when dev server is chosen) |
| **Staging / pre-prod URL** | TBD |
| **Test credential env vars** | TBD — set in Cloud Agent env only, never commit values |
| **Login flow notes** | TBD on first auth Feature |

## PR conventions

- PR title/body: `Closes #N` or `Fixes #N` linking the Feature issue
- Branch pattern (Cursor Cloud Agents): `cursor/issue-{N}-{phase}-{hash}`
- CI must pass before merge; Review uses CI as manager

## Consumer skill overrides

Optional repo-specific skills live in `.cursor/skills/`. Same skill name **wins** over the generic AI-DLC bundle. None yet.
