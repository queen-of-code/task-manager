import { AidlcPhase } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buildReorderUpdates, densePositions } from "@/lib/reorder";

const cards = [
  { id: "a", phase: AidlcPhase.IDEA, position: 0 },
  { id: "b", phase: AidlcPhase.IDEA, position: 1 },
  { id: "c", phase: AidlcPhase.PLAN, position: 0 },
];

describe("reorder helpers", () => {
  it("moves a card within the same column", () => {
    const updates = buildReorderUpdates(cards, "b", "a");
    expect(updates).toEqual([
      { id: "b", phase: AidlcPhase.IDEA, position: 0 },
      { id: "a", phase: AidlcPhase.IDEA, position: 1 },
    ]);
  });

  it("moves a card across columns", () => {
    const updates = buildReorderUpdates(cards, "a", "c", AidlcPhase.PLAN);
    expect(updates).toContainEqual({
      id: "a",
      phase: AidlcPhase.PLAN,
      position: 0,
    });
    expect(updates).toContainEqual({
      id: "b",
      phase: AidlcPhase.IDEA,
      position: 0,
    });
  });

  it("densifies positions from zero", () => {
    const dense = densePositions([
      { position: 4 },
      { position: 9 },
      { position: 12 },
    ]);
    expect(dense.map((item) => item.position)).toEqual([0, 1, 2]);
  });
});
