import { AidlcPhase } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  PHASE_LABELS,
  PHASE_ORDER,
  compareCardsByPhaseAndPosition,
  phaseSortIndex,
} from "@/lib/phases";

describe("phases", () => {
  it("orders AIDLC phases left to right", () => {
    expect(PHASE_ORDER).toEqual([
      AidlcPhase.IDEA,
      AidlcPhase.PLAN,
      AidlcPhase.DESIGN,
      AidlcPhase.BUILD,
      AidlcPhase.REVIEW,
      AidlcPhase.SHIP,
      AidlcPhase.DONE,
      AidlcPhase.WONT_DO,
    ]);
  });

  it("maps phases to product spec labels", () => {
    expect(PHASE_ORDER.map((p) => PHASE_LABELS[p])).toEqual([
      "Idea",
      "Plan",
      "Design",
      "Build",
      "Review",
      "Ship",
      "Done",
      "Won't do",
    ]);
  });

  it("sorts cards by phase then position", () => {
    const cards = [
      { phase: AidlcPhase.BUILD, position: 1 },
      { phase: AidlcPhase.IDEA, position: 0 },
      { phase: AidlcPhase.BUILD, position: 0 },
    ];
    const sorted = [...cards].sort(compareCardsByPhaseAndPosition);
    expect(sorted[0].phase).toBe(AidlcPhase.IDEA);
    expect(sorted[1].position).toBe(0);
    expect(sorted[2].position).toBe(1);
    expect(phaseSortIndex(AidlcPhase.DONE)).toBeGreaterThan(
      phaseSortIndex(AidlcPhase.BUILD),
    );
  });
});
