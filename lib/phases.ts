import { AidlcPhase } from "@prisma/client";

export const PHASE_ORDER: readonly AidlcPhase[] = [
  AidlcPhase.IDEA,
  AidlcPhase.PLAN,
  AidlcPhase.DESIGN,
  AidlcPhase.BUILD,
  AidlcPhase.REVIEW,
  AidlcPhase.SHIP,
  AidlcPhase.DONE,
  AidlcPhase.WONT_DO,
] as const;

export const PHASE_LABELS: Record<AidlcPhase, string> = {
  [AidlcPhase.IDEA]: "Idea",
  [AidlcPhase.PLAN]: "Plan",
  [AidlcPhase.DESIGN]: "Design",
  [AidlcPhase.BUILD]: "Build",
  [AidlcPhase.REVIEW]: "Review",
  [AidlcPhase.SHIP]: "Ship",
  [AidlcPhase.DONE]: "Done",
  [AidlcPhase.WONT_DO]: "Won't do",
};

export function phaseSortIndex(phase: AidlcPhase): number {
  return PHASE_ORDER.indexOf(phase);
}

export function compareCardsByPhaseAndPosition<
  T extends { phase: AidlcPhase; position: number },
>(a: T, b: T): number {
  const phaseDiff = phaseSortIndex(a.phase) - phaseSortIndex(b.phase);
  if (phaseDiff !== 0) return phaseDiff;
  return a.position - b.position;
}
