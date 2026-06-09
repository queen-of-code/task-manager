import { NextRequest, NextResponse } from "next/server";

import { notFoundResponse, validationErrorResponse } from "@/lib/api-errors";
import { deleteCard, getCard, updateCard } from "@/lib/services/cards";
import { updateCardSchema } from "@/lib/validations/card";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    const data = await getCard(id);
    if (!data) {
      return NextResponse.json(notFoundResponse("Card not found"), {
        status: 404,
      });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`GET /api/cards/${id} failed`, error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to get card" } },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const parsed = updateCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), {
        status: 400,
      });
    }

    const data = await updateCard(id, parsed.data);
    if (!data) {
      return NextResponse.json(notFoundResponse("Card not found"), {
        status: 404,
      });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`PATCH /api/cards/${id} failed`, error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update card" } },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    const deleted = await deleteCard(id);
    if (!deleted) {
      return NextResponse.json(notFoundResponse("Card not found"), {
        status: 404,
      });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/cards/${id} failed`, error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete card" } },
      { status: 500 },
    );
  }
}
