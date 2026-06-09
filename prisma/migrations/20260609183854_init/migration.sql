-- CreateEnum
CREATE TYPE "AidlcPhase" AS ENUM ('IDEA', 'PLAN', 'DESIGN', 'BUILD', 'REVIEW', 'SHIP', 'DONE', 'WONT_DO');

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "phase" "AidlcPhase" NOT NULL,
    "position" INTEGER NOT NULL,
    "assignee" TEXT,
    "labels" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Card_phase_position_idx" ON "Card"("phase", "position");
