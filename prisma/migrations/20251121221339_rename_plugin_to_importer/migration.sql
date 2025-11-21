/*
  Warnings:

  - You are about to drop the `Plugin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plugin" DROP CONSTRAINT "Plugin_userId_fkey";

-- DropTable
DROP TABLE "Plugin";

-- CreateTable
CREATE TABLE "Importer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileExtensions" TEXT[],
    "mapping" JSONB NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Importer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Importer" ADD CONSTRAINT "Importer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
