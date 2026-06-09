import { NextRequest, NextResponse } from "next/server";

import { validationErrorResponse } from "@/lib/api-errors";
import { createCard, listCards } from "@/lib/services/cards";
import { createCardSchema } from "@/lib/validations/card";

export async function GET() {
  try {
    const data = await listCards();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/cards failed", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to list cards" } },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(validationErrorResponse(parsed.error), {
        status: 400,
      });
    }

    const data = await createCard(parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cards failed", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create card" } },
      { status: 500 },
    );
  }
}
