-- DropForeignKey
ALTER TABLE "ayahs" DROP CONSTRAINT "ayahs_surahId_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_ayahId_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- AlterTable
ALTER TABLE "ayahs" ALTER COLUMN "textArabicSimple" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ayahs_juzNumber_idx" ON "ayahs"("juzNumber");

-- CreateIndex
CREATE INDEX "ayahs_pageNumber_idx" ON "ayahs"("pageNumber");

-- CreateIndex
CREATE INDEX "ayahs_surahId_number_idx" ON "ayahs"("surahId", "number");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE INDEX "bookmarks_ayahId_idx" ON "bookmarks"("ayahId");

-- CreateIndex
CREATE INDEX "translations_ayahId_idx" ON "translations"("ayahId");

-- CreateIndex
CREATE INDEX "translations_language_idx" ON "translations"("language");

-- AddForeignKey
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
