import { AidlcPhase, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.SKIP_SEED === "true") {
    return;
  }

  const existing = await prisma.card.count();
  if (existing > 0) {
    return;
  }

  await prisma.card.createMany({
    data: [
      {
        title: "Explore GitHub sync",
        body: "Future feature — link cards to issues.",
        phase: AidlcPhase.IDEA,
        position: 0,
        labels: [{ name: "future", color: "purple" }],
      },
      {
        title: "App skeleton",
        body: "Bootstrap Kanban board with PostgreSQL persistence.",
        phase: AidlcPhase.BUILD,
        position: 0,
        assignee: "Melissa",
        labels: [{ name: "infra", color: "blue" }],
      },
      {
        title: "Interactive UI validation",
        phase: AidlcPhase.DONE,
        position: 0,
        labels: [{ name: "docs", color: "green" }],
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
