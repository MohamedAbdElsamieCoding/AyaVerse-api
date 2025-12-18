-- CreateTable
CREATE TABLE "surahs" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "nameArabic" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "revelationType" TEXT NOT NULL,
    "ayahCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayahs" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "textArabic" TEXT NOT NULL,
    "juzNumber" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "surahId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "juzs" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "startAyah" INTEGER NOT NULL,
    "endAyah" INTEGER NOT NULL,

    CONSTRAINT "juzs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "surahs_number_key" ON "surahs"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ayahs_surahId_number_key" ON "ayahs"("surahId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "juzs_number_key" ON "juzs"("number");

-- AddForeignKey
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
