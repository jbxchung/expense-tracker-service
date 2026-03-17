-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "excludeFromReports" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_sessions" RENAME CONSTRAINT "session_pkey" TO "user_sessions_pkey";

-- RenameIndex
ALTER INDEX "IDX_session_expire" RENAME TO "user_sessions_expire_idx";
