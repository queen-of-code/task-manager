"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardLabel } from "@/lib/validations/card";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "gray",
] as const;

const LABEL_COLORS: Record<string, string> = {
  red: "bg-red-100 text-red-800 border-red-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
};

type LabelEditorProps = {
  labels: CardLabel[];
  onChange: (labels: CardLabel[]) => void;
};

export function LabelEditor({ labels, onChange }: LabelEditorProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);

  function addLabel() {
    const trimmed = name.trim();
    if (!trimmed || labels.length >= 10) return;
    if (labels.some((l) => l.name.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }
    onChange([...labels, { name: trimmed, color }]);
    setName("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <Badge
            key={`${label.name}-${label.color}`}
            variant="outline"
            className={cn(
              "gap-1 pr-1",
              LABEL_COLORS[label.color] ?? "bg-muted",
            )}
          >
            {label.name}
            <button
              type="button"
              className="rounded-full p-0.5 hover:bg-black/10"
              aria-label={`Remove label ${label.name}`}
              onClick={() =>
                onChange(labels.filter((l) => l.name !== label.name))
              }
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      {labels.length < 10 && (
        <div className="flex gap-2">
          <Input
            placeholder="Label name"
            aria-label="Label name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addLabel();
            }}
          />
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-28" aria-label="Label color">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_COLORS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={addLabel}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
