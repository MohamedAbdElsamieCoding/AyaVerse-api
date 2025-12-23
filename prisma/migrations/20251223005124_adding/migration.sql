/*
  Warnings:

  - You are about to drop the column `lastAyahSurah` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastAyahSurah",
ADD COLUMN     "lastReadAyah" INTEGER;
