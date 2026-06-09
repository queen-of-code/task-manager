import { AidlcPhase, Card, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { compareCardsByPhaseAndPosition } from "@/lib/phases";
import {
  CardLabel,
  CreateCardInput,
  ReorderInput,
  UpdateCardInput,
} from "@/lib/validations/card";

function toLabelJson(
  labels: CardLabel[] | undefined,
): Prisma.InputJsonValue | undefined {
  return labels === undefined ? undefined : labels;
}

export type CardDTO = {
  id: string;
  title: string;
  body: string | null;
  phase: AidlcPhase;
  position: number;
  assignee: string | null;
  labels: CardLabel[];
  createdAt: string;
  updatedAt: string;
};

function parseLabels(value: Prisma.JsonValue): CardLabel[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is CardLabel =>
      typeof item === "object" &&
      item !== null &&
      "name" in item &&
      "color" in item &&
      typeof item.name === "string" &&
      typeof item.color === "string",
  );
}

export function toCardDTO(card: Card): CardDTO {
  return {
    id: card.id,
    title: card.title,
    body: card.body,
    phase: card.phase,
    position: card.position,
    assignee: card.assignee,
    labels: parseLabels(card.labels),
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}

export async function listCards(): Promise<CardDTO[]> {
  const cards = await prisma.card.findMany();
  return cards.sort(compareCardsByPhaseAndPosition).map(toCardDTO);
}

export async function getCard(id: string): Promise<CardDTO | null> {
  const card = await prisma.card.findUnique({ where: { id } });
  return card ? toCardDTO(card) : null;
}

async function nextPosition(phase: AidlcPhase): Promise<number> {
  const aggregate = await prisma.card.aggregate({
    where: { phase },
    _max: { position: true },
  });
  return (aggregate._max.position ?? -1) + 1;
}

export async function createCard(input: CreateCardInput): Promise<CardDTO> {
  const position = await nextPosition(input.phase);
  const card = await prisma.card.create({
    data: {
      title: input.title,
      body: input.body ?? null,
      phase: input.phase,
      position,
      assignee: input.assignee ?? null,
      labels: toLabelJson(input.labels ?? []) ?? [],
    },
  });
  return toCardDTO(card);
}

export async function updateCard(
  id: string,
  input: UpdateCardInput,
): Promise<CardDTO | null> {
  const existing = await prisma.card.findUnique({ where: { id } });
  if (!existing) return null;

  const targetPhase = input.phase ?? existing.phase;
  const phaseChanged = targetPhase !== existing.phase;
  const positionProvided = input.position !== undefined;

  return prisma.$transaction(async (tx) => {
    if (phaseChanged && !positionProvided) {
      await compactColumn(tx, existing.phase, existing.id);
      const newPosition = await nextPositionInTx(tx, targetPhase);
      const updated = await tx.card.update({
        where: { id },
        data: {
          title: input.title,
          body: input.body === undefined ? undefined : input.body,
          phase: targetPhase,
          position: newPosition,
          assignee:
            input.assignee === undefined ? undefined : input.assignee,
          labels: toLabelJson(input.labels),
        },
      });
      return toCardDTO(updated);
    }

    if (positionProvided || phaseChanged) {
      const cardsInTarget = await tx.card.findMany({
        where: { phase: targetPhase, NOT: { id } },
        orderBy: { position: "asc" },
      });

      const insertAt = input.position ?? cardsInTarget.length;
      const reordered = [...cardsInTarget];
      reordered.splice(insertAt, 0, {
        ...existing,
        phase: targetPhase,
        position: insertAt,
      });

      if (phaseChanged) {
        await compactColumn(tx, existing.phase, existing.id);
      }

      for (let i = 0; i < reordered.length; i++) {
        const card = reordered[i];
        await tx.card.update({
          where: { id: card.id },
          data: {
            phase: targetPhase,
            position: i,
            ...(card.id === id
              ? {
                  title: input.title ?? existing.title,
                  body:
                    input.body === undefined ? existing.body : input.body,
                  assignee:
                    input.assignee === undefined
                      ? existing.assignee
                      : input.assignee,
                  labels:
                    input.labels === undefined
                      ? (existing.labels as Prisma.InputJsonValue)
                      : toLabelJson(input.labels),
                }
              : {}),
          },
        });
      }

      const updated = await tx.card.findUniqueOrThrow({ where: { id } });
      return toCardDTO(updated);
    }

    const updated = await tx.card.update({
      where: { id },
      data: {
        title: input.title,
        body: input.body === undefined ? undefined : input.body,
        assignee: input.assignee === undefined ? undefined : input.assignee,
        labels: input.labels === undefined ? undefined : input.labels,
      },
    });
    return toCardDTO(updated);
  });
}

export async function deleteCard(id: string): Promise<boolean> {
  const existing = await prisma.card.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.$transaction(async (tx) => {
    await tx.card.delete({ where: { id } });
    await compactColumn(tx, existing.phase);
  });
  return true;
}

export async function reorderCards(input: ReorderInput): Promise<CardDTO[]> {
  const ids = input.updates.map((u) => u.id);
  const existing = await prisma.card.findMany({ where: { id: { in: ids } } });
  if (existing.length !== ids.length) {
    throw new Error("One or more cards not found");
  }

  await prisma.$transaction(async (tx) => {
    const affectedPhases = new Set<AidlcPhase>();
    for (const card of existing) {
      affectedPhases.add(card.phase);
    }
    for (const update of input.updates) {
      affectedPhases.add(update.phase);
    }

    for (const update of input.updates) {
      await tx.card.update({
        where: { id: update.id },
        data: {
          phase: update.phase,
          position: update.position,
        },
      });
    }

    for (const phase of affectedPhases) {
      await normalizeColumn(tx, phase);
    }
  });

  return listCards();
}

type Tx = Prisma.TransactionClient;

async function nextPositionInTx(tx: Tx, phase: AidlcPhase): Promise<number> {
  const aggregate = await tx.card.aggregate({
    where: { phase },
    _max: { position: true },
  });
  return (aggregate._max.position ?? -1) + 1;
}

async function compactColumn(
  tx: Tx,
  phase: AidlcPhase,
  excludeId?: string,
): Promise<void> {
  const cards = await tx.card.findMany({
    where: {
      phase,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    orderBy: { position: "asc" },
  });

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].position !== i) {
      await tx.card.update({
        where: { id: cards[i].id },
        data: { position: i },
      });
    }
  }
}

async function normalizeColumn(tx: Tx, phase: AidlcPhase): Promise<void> {
  const cards = await tx.card.findMany({
    where: { phase },
    orderBy: { position: "asc" },
  });

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].position !== i) {
      await tx.card.update({
        where: { id: cards[i].id },
        data: { position: i },
      });
    }
  }
}
