import { AidlcPhase } from "@prisma/client";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { GET as listCards, POST as createCard } from "@/app/api/cards/route";
import {
  DELETE as deleteCard,
  GET as getCard,
  PATCH as updateCard,
} from "@/app/api/cards/[id]/route";
import { PATCH as reorderCards } from "@/app/api/cards/reorder/route";
import { prisma } from "@/lib/db";

function jsonRequest(
  method: string,
  url: string,
  body?: unknown,
): Request {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function resetDatabase() {
  await prisma.card.deleteMany();
}

describe("cards API integration", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("creates and lists cards", async () => {
    const createRes = await createCard(
      jsonRequest("POST", "http://localhost/api/cards", {
        title: "First card",
        phase: AidlcPhase.IDEA,
      }) as never,
    );
    expect(createRes.status).toBe(201);

    const listRes = await listCards();
    const listJson = await listRes.json();
    expect(listRes.status).toBe(200);
    expect(listJson.data).toHaveLength(1);
    expect(listJson.data[0].title).toBe("First card");
  });

  it("gets, updates, and deletes a card", async () => {
    const createRes = await createCard(
      jsonRequest("POST", "http://localhost/api/cards", {
        title: "Editable",
        phase: AidlcPhase.PLAN,
      }) as never,
    );
    const created = await createRes.json();
    const id = created.data.id as string;

    const getRes = await getCard(
      jsonRequest("GET", `http://localhost/api/cards/${id}`) as never,
      { params: Promise.resolve({ id }) },
    );
    expect(getRes.status).toBe(200);

    const patchRes = await updateCard(
      jsonRequest("PATCH", `http://localhost/api/cards/${id}`, {
        title: "Updated title",
        phase: AidlcPhase.BUILD,
      }) as never,
      { params: Promise.resolve({ id }) },
    );
    const patched = await patchRes.json();
    expect(patchRes.status).toBe(200);
    expect(patched.data.title).toBe("Updated title");
    expect(patched.data.phase).toBe(AidlcPhase.BUILD);

    const deleteRes = await deleteCard(
      jsonRequest("DELETE", `http://localhost/api/cards/${id}`) as never,
      { params: Promise.resolve({ id }) },
    );
    expect(deleteRes.status).toBe(204);

    const missingRes = await getCard(
      jsonRequest("GET", `http://localhost/api/cards/${id}`) as never,
      { params: Promise.resolve({ id }) },
    );
    expect(missingRes.status).toBe(404);
  });

  it("reorders cards transactionally", async () => {
    const first = await (
      await createCard(
        jsonRequest("POST", "http://localhost/api/cards", {
          title: "One",
          phase: AidlcPhase.IDEA,
        }) as never,
      )
    ).json();
    const second = await (
      await createCard(
        jsonRequest("POST", "http://localhost/api/cards", {
          title: "Two",
          phase: AidlcPhase.IDEA,
        }) as never,
      )
    ).json();

    const reorderRes = await reorderCards(
      jsonRequest("PATCH", "http://localhost/api/cards/reorder", {
        updates: [
          {
            id: second.data.id,
            phase: AidlcPhase.IDEA,
            position: 0,
          },
          {
            id: first.data.id,
            phase: AidlcPhase.IDEA,
            position: 1,
          },
        ],
      }) as never,
    );
    const reordered = await reorderRes.json();
    expect(reorderRes.status).toBe(200);
    expect(reordered.data[0].title).toBe("Two");
    expect(reordered.data[1].title).toBe("One");
  });
});
