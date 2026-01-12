/*
  Warnings:

  - Added the required column `sourceFields` to the `Importer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Importer" ADD COLUMN     "sourceFields" JSONB NOT NULL;
