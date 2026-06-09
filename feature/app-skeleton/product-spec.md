# Product Spec — App skeleton (Kanban task manager)

**AIDLC phase:** Design (Product Spec approved; Tech Spec in review)  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | App skeleton — Kanban task manager shell |
| **Status** | Approved (2026-06-09 — Plan gate; `/design` on issue #1) |
| **Author** | Melissa Benua (with AI-DLC Plan agent) |
| **Created** | 2026-06-09 |
| **Last updated** | 2026-06-09 |
| **Related Tech Spec** | `feature/app-skeleton/tech-spec.md` (created in `/design`) |

## Problem & audience

### Problem statement

The **task-manager** repository has process scaffolding (AIDLC, automation, spec templates) but **no runnable application**. Melissa needs a personal Kanban board to track work through the **AIDLC lifecycle** — with real persistence, not throwaway demo data — in an interaction model familiar from **classic GitHub Projects (v1)**.

### Who it's for

- **Primary (only):** Melissa — solo personal use. No multi-user, team, or tenant requirements in this Feature.

### Current experience (baseline)

Today there is no app: no board, no cards, no database, no local dev experience. Work tracking for this project lives outside the app (GitHub Issues/Projects) or in docs.

## Outcomes & business impact

### Desired outcomes

- A **runnable web application** with a single Kanban board for personal task tracking.
- **Eight fixed columns** aligned to AIDLC phases: Idea, Plan, Design, Build, Review, Ship, Done, Won't do.
- **Full CRUD** on cards (create, view, edit, delete) with changes **persisted in a database** — survives browser refresh and app restart.
- **GitHub Projects v1–like cards and board UX** — horizontal lanes, draggable cards, card detail with title and supporting fields typical of v1 cards.
- A **stable foundation** for follow-on Features (auth, GitHub sync, multiple boards, etc.) without re-scaffolding.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | App loads locally and shows the Kanban board | Open dev URL; eight AIDLC columns visible; no console-blocking errors |
| 2 | Columns match AIDLC phases | Column headers are exactly: Idea, Plan, Design, Build, Review, Ship, Done, Won't do (left-to-right workflow order) |
| 3 | Create a card | Add a new card to any column; card appears on the board |
| 4 | Read / view a card | Open card detail; title and v1-style fields visible |
| 5 | Update a card | Edit card content and/or move card to another column (e.g. drag or equivalent); change reflected on board |
| 6 | Delete a card | Remove a card; it no longer appears after refresh |
| 7 | Persistence | Create or move a card, restart app and/or refresh browser; data is still present |
| 8 | Single board | One default board — no board picker or multi-project nav required |
| 9 | Run instructions documented | README or PROJECT.md explains how to start app **and** database locally |

### Business impact

Personal productivity tool for managing task-manager (and related) work through AIDLC phases. Unblocks **Design → Build** for all downstream Features. No commercial or multi-user impact at this stage.

## User experience & scenarios

### Key scenarios

1. **First open** — Melissa starts the app and database locally, opens the browser, and sees one Kanban board with eight AIDLC columns (board may start empty; she can add cards immediately).
2. **Capture work** — She creates a new card in **Idea** (or any column) with a title and optional detail, matching how she'd add an issue to a GitHub Projects v1 board.
3. **Advance work** — She drags a card from **Plan** to **Design** (or uses an equivalent move action) as the item progresses through AIDLC.
4. **Edit or drop** — She opens a card to update its title/description, or deletes a card she no longer needs.
5. **Come back later** — She closes the browser, returns days later, and the board state is unchanged — cards are where she left them.

### Experience principles

- **Familiar:** Classic GitHub Projects v1 — board-first, horizontal columns, cards as units of work, drag-between-columns.
- **AIDLC-native:** Column names are the lifecycle phases, not generic Todo/Doing/Done.
- **Personal & simple:** No login friction; one board; optimized for solo desktop use.
- **Real data:** What you create is stored — not a mock UI.
- **Accessible baseline:** Readable contrast; keyboard-accessible CRUD and move actions where feasible *(depth in Design)*.

## Scope

### In scope

- Web application with **one Kanban board**
- **Eight fixed columns:** Idea, Plan, Design, Build, Review, Ship, Done, Won't do
- **Cards** with GitHub Projects v1–like presentation: at minimum **title**; plus **description** and other v1-parity fields as appropriate (e.g. labels, assignee placeholder) — exact field set refined in Design without changing the product intent
- **CRUD:** create, read, update, delete cards
- **Move cards** between columns (drag-and-drop or equivalent)
- **Database-backed persistence** for board and cards
- Local development experience: app + database runnable from the repo
- Desktop-first layout

### Out of scope

- User accounts, login, authentication, multi-user collaboration
- Multiple boards or projects
- GitHub Issues / Projects v2 integration or sync
- Notifications, comments, milestones, automation webhooks
- Production deployment / hosted environment
- Mobile-optimized layout
- Custom column names or user-defined workflows (columns are fixed to AIDLC)

### Dependencies on other teams or features

- None external. First application Feature; unblocks all others.

## Constraints (non-technical where possible)

- **Solo personal use** — security model is “trusted local operator”; no auth Feature required here.
- Must align with repo direction: **lightweight project management** using AIDLC.
- Column names must stay aligned with **`AIDLC phase`** values documented in `AGENTS.md` / GitHub Projects v2 setup.
- Stakeholder preferences for **shadcn** and **web app** are inputs to `/design`, not binding product requirements.
- Local dev URL convention in `AGENTS.md` is `http://127.0.0.1:3000` until changed.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-09 | Feature slug: `app-skeleton` |
| 2026-06-09 | Interaction model: Kanban board akin to **GitHub Projects v1** |
| 2026-06-09 | **Audience:** Personal project — Melissa only; no auth |
| 2026-06-09 | **Persistence:** Database required — not in-memory or browser-only storage |
| 2026-06-09 | **CRUD:** Full create, read, update, delete on cards |
| 2026-06-09 | **Columns:** Fixed AIDLC phases — Idea, Plan, Design, Build, Review, Ship, Done, Won't do |
| 2026-06-09 | **Cards:** GitHub Projects v1–like fields and interactions |
| 2026-06-09 | **Boards:** One board sufficient for v1 |

## Related documents

- Tech Spec: `feature/app-skeleton/tech-spec.md` (after `/design`)
- Issues: [#1 — App skeleton (Kanban task manager)](https://github.com/queen-of-code/task-manager/issues/1)
- Projects v2 board: [AIDLC — task-manager](https://github.com/users/queen-of-code/projects/8) (project **#8**)
- ADRs: `adr/` (database and stack choices likely in first `/design` pass)
