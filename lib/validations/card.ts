import { AidlcPhase } from "@prisma/client";
import { z } from "zod";

export const labelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().min(1).max(32),
});

export const labelsSchema = z.array(labelSchema).max(10);

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().max(10000).optional(),
  phase: z.nativeEnum(AidlcPhase),
  assignee: z.string().max(100).optional(),
  labels: labelsSchema.optional(),
});

export const updateCardSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    body: z.string().max(10000).nullable().optional(),
    phase: z.nativeEnum(AidlcPhase).optional(),
    position: z.number().int().min(0).optional(),
    assignee: z.string().max(100).nullable().optional(),
    labels: labelsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const reorderSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        phase: z.nativeEnum(AidlcPhase),
        position: z.number().int().min(0),
      }),
    )
    .min(1),
});

export type CardLabel = z.infer<typeof labelSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
