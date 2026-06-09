import { AidlcPhase } from "@prisma/client";

import { CardLabel } from "@/lib/validations/card";

export type BoardCard = {
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
