"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { AidlcPhase } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";

import { buildReorderUpdates } from "@/lib/reorder";
import { PHASE_ORDER } from "@/lib/phases";

import { CardDetailDialog } from "./CardDetailDialog";
import { Column } from "./Column";
import { KanbanCard } from "./Card";
import { BoardCard } from "./types";

async function fetchCards(): Promise<BoardCard[]> {
  const res = await fetch("/api/cards");
  if (!res.ok) throw new Error("Failed to load cards");
  const json = (await res.json()) as { data: BoardCard[] };
  return json.data;
}

type BoardProps = {
  initialCards: BoardCard[];
};

export function Board({ initialCards }: BoardProps) {
  const [cards, setCards] = useState<BoardCard[]>(initialCards);
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<BoardCard | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startRefresh] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function refreshCards() {
    startRefresh(async () => {
      try {
        const data = await fetchCards();
        setCards(data);
        setError(null);
      } catch {
        setError("Could not load cards. Is the database running?");
      }
    });
  }

  const cardsByPhase = useMemo(() => {
    const grouped = Object.fromEntries(
      PHASE_ORDER.map((phase) => [phase, [] as BoardCard[]]),
    ) as Record<AidlcPhase, BoardCard[]>;

    for (const card of cards) {
      grouped[card.phase].push(card);
    }

    for (const phase of PHASE_ORDER) {
      grouped[phase].sort((a, b) => a.position - b.position);
    }

    return grouped;
  }, [cards]);

  async function handleCreateCard(phase: AidlcPhase, title: string) {
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, phase }),
    });
    if (!res.ok) {
      setError("Failed to create card");
      return;
    }
    refreshCards();
  }

  async function handleSave(
    id: string,
    updates: Partial<BoardCard>,
  ): Promise<void> {
    const res = await fetch(`/api/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      setError("Failed to save card");
      throw new Error("save failed");
    }
    refreshCards();
  }

  async function handleDelete(id: string): Promise<void> {
    const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      setError("Failed to delete card");
      throw new Error("delete failed");
    }
    refreshCards();
  }

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const overData = over.data.current;
    const targetPhase =
      overData?.type === "column"
        ? (over.id as AidlcPhase)
        : cards.find((c) => c.id === over.id)?.phase;

    const updates = buildReorderUpdates(
      cards,
      String(active.id),
      String(over.id),
      targetPhase,
    );

    if (!updates) return;

    const previous = cards;
    const optimistic = [...cards];
    for (const update of updates) {
      const idx = optimistic.findIndex((c) => c.id === update.id);
      if (idx >= 0) {
        optimistic[idx] = {
          ...optimistic[idx],
          phase: update.phase,
          position: update.position,
        };
      }
    }
    setCards(optimistic);

    const res = await fetch("/api/cards/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });

    if (!res.ok) {
      setCards(previous);
      setError("Failed to move card — changes reverted");
      return;
    }

    const json = (await res.json()) as { data: BoardCard[] };
    setCards(json.data);
  }

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {activeCard ? `Dragging card ${activeCard.title}` : ""}
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={(e) => void handleDragEnd(e)}
      >
        <div className="flex flex-1 gap-4 overflow-x-auto p-6">
          {PHASE_ORDER.map((phase) => (
            <Column
              key={phase}
              phase={phase}
              cards={cardsByPhase[phase]}
              onOpenCard={(card) => {
                setSelectedCard(card);
                setDialogOpen(true);
              }}
              onCreateCard={handleCreateCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="w-72 opacity-90">
              <KanbanCard card={activeCard} onOpen={() => undefined} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailDialog
        card={selectedCard}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
