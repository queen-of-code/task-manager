# ADR-0002: shadcn/ui and @dnd-kit for the Kanban board

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-09 |
| **Deciders** | Melissa Benua (Design phase, issue #1) |
| **Related** | [ADR-0001](0001-nextjs-prisma-postgresql-stack.md), [Tech Spec](../feature/app-skeleton/tech-spec.md), [#1](https://github.com/queen-of-code/task-manager/issues/1) |

---

## Context

The Product Spec calls for a **GitHub Projects v1–like** Kanban board: horizontal columns, draggable cards, card detail with title and supporting fields. Stakeholder preference for **shadcn** was recorded as a Design input. The board must be desktop-first, readable, and support **keyboard-accessible** move actions in addition to drag-and-drop.

## Decision

Use:

- **[shadcn/ui](https://ui.shadcn.com/)** (Radix primitives + Tailwind) for layout, dialogs, forms, buttons, badges, and scroll areas. Components live in `components/ui/` per shadcn convention (copy-in, owned by the repo).
- **[@dnd-kit](https://dndkit.com/)** (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) for column/card drag-and-drop, including keyboard sensors and screen-reader announcements.
- **Tailwind CSS** for board layout (horizontal scroll for eight columns on desktop).

Card chrome mirrors GitHub Projects v1 at minimum:

| Field | UI | Storage |
|-------|-----|---------|
| Title | Card face + detail header | `Card.title` (required) |
| Description | Detail panel (markdown-capable textarea) | `Card.body` (optional) |
| Labels | Colored pills on card face | `Card.labels` JSON array `{ name, color }` |
| Assignee | Avatar placeholder / initials | `Card.assignee` optional string |

Non-drag move path: card detail **“Move to column”** select and keyboard-operable controls satisfy accessibility without blocking DnD.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| **A — shadcn + @dnd-kit (chosen)** | Accessible DnD; matches stakeholder UI direction | — |
| B — shadcn + react-beautiful-dnd | Familiar API | Maintenance mode; weaker keyboard/a11y story |
| C — Custom DnD | Full control | High effort for first Feature; easy to get a11y wrong |
| D — MUI / Chakra | Full component libraries | Heavier bundle; diverges from stated shadcn preference |

## Consequences

### Positive

- shadcn components are copy-paste — no opaque design-system version lock-in.
- @dnd-kit supports keyboard dragging and custom collision detection for horizontal lanes.
- Label pills and dialogs align with familiar GitHub Projects v1 affordances.

### Negative / trade-offs

- shadcn setup adds initial CLI/config steps in Build.
- @dnd-kit requires careful optimistic-update + API reconciliation on drop.
- Eight fixed columns may require horizontal scroll on smaller desktop widths (acceptable per Product Spec — mobile out of scope).

### Neutral / follow-ups

- Rich markdown preview in card detail can be a follow-on polish item; textarea is sufficient for skeleton.
- Theming (dark mode) is not required for Validate; tokens should not preclude it.

## Compliance & verification

- Board UI uses shadcn primitives for interactive controls (Dialog, Button, Input, Badge, Select).
- Drag-and-drop must have a documented non-pointer alternative (column select in card detail).
- Review UI pass exercises create, move, edit, delete via Chrome DevTools MCP.

## References

- [shadcn/ui](https://ui.shadcn.com/)
- [@dnd-kit documentation](https://docs.dndkit.com/)
