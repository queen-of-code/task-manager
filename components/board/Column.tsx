"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AidlcPhase } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PHASE_LABELS } from "@/lib/phases";
import { cn } from "@/lib/utils";

import { KanbanCard } from "./Card";
import { BoardCard } from "./types";

type ColumnProps = {
  phase: AidlcPhase;
  cards: BoardCard[];
  onOpenCard: (card: BoardCard) => void;
  onCreateCard: (phase: AidlcPhase, title: string) => Promise<void>;
};

export function Column({
  phase,
  cards,
  onOpenCard,
  onCreateCard,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: phase,
    data: { type: "column", phase },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await onCreateCard(phase, trimmed);
      setTitle("");
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30",
        isOver && "ring-2 ring-ring",
      )}
    >
      <header className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{PHASE_LABELS[phase]}</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Add card to ${PHASE_LABELS[phase]}`}
          onClick={() => setIsAdding((v) => !v)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      {isAdding && (
        <div className="space-y-2 border-b p-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            aria-label="New card title"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
              if (e.key === "Escape") setIsAdding(false);
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => void handleCreate()}
              disabled={isSubmitting || !title.trim()}
            >
              Add card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setTitle("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className="min-h-[12rem] space-y-2 p-3"
        >
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onOpen={onOpenCard} />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </section>
  );
}
