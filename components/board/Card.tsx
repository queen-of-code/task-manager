"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { BoardCard } from "./types";

const LABEL_COLORS: Record<string, string> = {
  red: "bg-red-100 text-red-800 border-red-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type CardProps = {
  card: BoardCard;
  onOpen: (card: BoardCard) => void;
};

export function KanbanCard({ card, onOpen }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const visibleLabels = card.labels.slice(0, 3);
  const overflowCount = card.labels.length - visibleLabels.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-md border bg-card p-3 shadow-sm",
        isDragging && "opacity-50 ring-2 ring-ring",
      )}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => onOpen(card)}
        aria-label={`Open card: ${card.title}`}
      >
        {visibleLabels.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {visibleLabels.map((label) => (
              <Badge
                key={`${label.name}-${label.color}`}
                variant="outline"
                className={cn(
                  "text-[10px] font-medium",
                  LABEL_COLORS[label.color] ?? "bg-muted text-foreground",
                )}
              >
                {label.name}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                +{overflowCount}
              </Badge>
            )}
          </div>
        )}
        <p className="line-clamp-3 text-sm font-medium">{card.title}</p>
        {card.assignee && (
          <div className="mt-3 flex justify-end">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold"
              title={card.assignee}
            >
              {initials(card.assignee)}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
