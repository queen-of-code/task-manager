import { AidlcPhase } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  createCardSchema,
  reorderSchema,
  updateCardSchema,
} from "@/lib/validations/card";

describe("card validations", () => {
  it("requires title and phase on create", () => {
    const result = createCardSchema.safeParse({
      title: "Ship auth",
      phase: AidlcPhase.BUILD,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createCardSchema.safeParse({
      title: "   ",
      phase: AidlcPhase.IDEA,
    });
    expect(result.success).toBe(false);
  });

  it("limits labels to ten items", () => {
    const labels = Array.from({ length: 11 }, (_, i) => ({
      name: `label-${i}`,
      color: "blue",
    }));
    const result = createCardSchema.safeParse({
      title: "Too many labels",
      phase: AidlcPhase.IDEA,
      labels,
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one field on update", () => {
    const result = updateCardSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts reorder payload", () => {
    const result = reorderSchema.safeParse({
      updates: [{ id: "abc", phase: AidlcPhase.PLAN, position: 0 }],
    });
    expect(result.success).toBe(true);
  });
});
