import { NextRequest, NextResponse } from "next/server";

import { notFoundResponse, validationErrorResponse } from "@/lib/api-errors";
import { reorderCards } from "@/lib/services/cards";
import { reorderSchema } from "@/lib/validations/card";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), {
        status: 400,
      });
    }

    const data = await reorderCards(parsed.data);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(notFoundResponse(error.message), {
        status: 404,
      });
    }
    console.error("PATCH /api/cards/reorder failed", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to reorder cards" } },
      { status: 500 },
    );
  }
}
