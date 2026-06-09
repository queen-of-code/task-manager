import { Board } from "@/components/board/Board";
import { listCards } from "@/lib/services/cards";

export default async function HomePage() {
  const initialCards = await listCards();

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">task-manager</h1>
        <p className="text-sm text-muted-foreground">
          Personal Kanban board — AIDLC phases
        </p>
      </header>
      <Board initialCards={initialCards} />
    </main>
  );
}
