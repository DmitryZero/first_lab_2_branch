/*
  Warnings:

  - You are about to drop the `TaskCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TaskCase";

-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "n" INTEGER NOT NULL,
    "m" INTEGER NOT NULL,
    "input_grid" INTEGER[],
    "output_grid" INTEGER[],

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);
