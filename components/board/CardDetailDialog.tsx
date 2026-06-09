"use client";

import { AidlcPhase } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PHASE_LABELS, PHASE_ORDER } from "@/lib/phases";

import { LabelEditor } from "./LabelEditor";
import { BoardCard } from "./types";

type CardDetailDialogProps = {
  card: BoardCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<BoardCard>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type CardDetailFormProps = {
  card: BoardCard;
  onSave: (id: string, updates: Partial<BoardCard>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

function CardDetailForm({
  card,
  onSave,
  onDelete,
  onClose,
}: CardDetailFormProps) {
  const [title, setTitle] = useState(card.title);
  const [body, setBody] = useState(card.body ?? "");
  const [assignee, setAssignee] = useState(card.assignee ?? "");
  const [phase, setPhase] = useState<AidlcPhase>(card.phase);
  const [labels, setLabels] = useState(card.labels);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(card.id, {
        title: title.trim(),
        body: body.trim() || null,
        assignee: assignee.trim() || null,
        phase,
        labels,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(card.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-title">Title</Label>
          <Input
            id="card-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-body">Description</Label>
          <Textarea
            id="card-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-assignee">Assignee</Label>
          <Input
            id="card-assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Name or initials"
          />
        </div>

        <div className="space-y-2">
          <Label>Move to column</Label>
          <Select
            value={phase}
            onValueChange={(value) => setPhase(value as AidlcPhase)}
          >
            <SelectTrigger aria-label="Move to column">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHASE_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PHASE_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Labels</Label>
          <LabelEditor labels={labels} onChange={setLabels} />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:justify-between">
        <Button
          variant="destructive"
          onClick={() => void handleDelete()}
          disabled={isDeleting || isSaving}
        >
          {confirmDelete ? "Confirm delete" : "Delete card"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={isSaving || !title.trim()}
          >
            Save
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

export function CardDetailDialog({
  card,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: CardDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Card details</DialogTitle>
          <DialogDescription>
            Edit card fields or move to another AIDLC phase.
          </DialogDescription>
        </DialogHeader>

        {card ? (
          <CardDetailForm
            key={card.id}
            card={card}
            onSave={onSave}
            onDelete={onDelete}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
