/*
  Warnings:

  - You are about to drop the column `fileExtensions` on the `Importer` table. All the data in the column will be lost.
  - Added the required column `type` to the `Importer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImporterType" AS ENUM ('CSV');

-- AlterTable
ALTER TABLE "Importer" DROP COLUMN "fileExtensions",
ADD COLUMN     "type" "ImporterType" NOT NULL;
