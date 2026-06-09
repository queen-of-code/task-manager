import { AidlcPhase } from "@prisma/client";

export type ReorderableCard = {
  id: string;
  phase: AidlcPhase;
  position: number;
};

export type ReorderUpdate = {
  id: string;
  phase: AidlcPhase;
  position: number;
};

export function buildReorderUpdates(
  cards: ReorderableCard[],
  activeId: string,
  overId: string,
  targetPhase?: AidlcPhase,
): ReorderUpdate[] | null {
  const active = cards.find((c) => c.id === activeId);
  const over = cards.find((c) => c.id === overId);
  if (!active || !over) return null;

  const destinationPhase = targetPhase ?? over.phase;
  const sameColumn = destinationPhase === active.phase;

  const columnCards = cards
    .filter((c) => c.phase === destinationPhase && c.id !== activeId)
    .sort((a, b) => a.position - b.position);

  let insertIndex = columnCards.findIndex((c) => c.id === overId);
  if (insertIndex === -1) {
    insertIndex = columnCards.length;
  } else if (!sameColumn || active.position > over.position) {
    // keep insertIndex as-is for cross-column and downward moves
  }

  const reordered = [...columnCards];
  reordered.splice(insertIndex, 0, {
    id: activeId,
    phase: destinationPhase,
    position: insertIndex,
  });

  const updates: ReorderUpdate[] = reordered.map((card, index) => ({
    id: card.id,
    phase: destinationPhase,
    position: index,
  }));

  if (!sameColumn) {
    const sourceCards = cards
      .filter((c) => c.phase === active.phase && c.id !== activeId)
      .sort((a, b) => a.position - b.position);

    for (let i = 0; i < sourceCards.length; i++) {
      updates.push({
        id: sourceCards[i].id,
        phase: active.phase,
        position: i,
      });
    }
  }

  return updates;
}

export function densePositions<T extends { position: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, position: index }));
}
