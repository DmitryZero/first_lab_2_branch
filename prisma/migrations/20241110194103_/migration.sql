/*
  Warnings:

  - Added the required column `is_successful` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "expected_value" INTEGER[],
ADD COLUMN     "is_successful" BOOLEAN NOT NULL;
