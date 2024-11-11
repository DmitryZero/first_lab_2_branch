/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "TaskCase" (
    "id" SERIAL NOT NULL,
    "n" INTEGER NOT NULL,
    "m" INTEGER NOT NULL,
    "input_grid" INTEGER[],
    "output_grid" INTEGER[],

    CONSTRAINT "TaskCase_pkey" PRIMARY KEY ("id")
);
