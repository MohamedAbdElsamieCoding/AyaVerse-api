import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u06D6-\u06ED\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

async function main() {
  console.log("🌊 Starting Seeding...");

  const arabicResp = await fetch(
    "http://api.alquran.cloud/v1/quran/quran-uthmani"
  );
  const englishResp = await fetch("http://api.alquran.cloud/v1/quran/en.asad");

  const arabicData = (await arabicResp.json()).data;
  const englishData = (await englishResp.json()).data;

  await prisma.translation.deleteMany();
  await prisma.ayah.deleteMany();
  await prisma.surah.deleteMany();

  for (let i = 0; i < 114; i++) {
    const s = arabicData.surahs[i];
    const sEng = englishData.surahs[i];

    console.log(`📖 Seeding Surah ${s.number}: ${s.englishName}`);

    await prisma.surah.create({
      data: {
        number: s.number,
        nameArabic: s.name,
        nameEnglish: s.englishName,
        revelationType: s.revelationType,
        ayahCount: s.ayahs.length,
        ayahs: {
          create: s.ayahs.map((ayah: any, index: number) => ({
            number: ayah.numberInSurah,
            textArabic: ayah.text,
            textArabicSimple: normalizeArabic(ayah.text),
            juzNumber: ayah.juz,
            pageNumber: ayah.page,
            translations: {
              create: {
                text: sEng.ayahs[index].text,
                language: "en",
                author: "Muhammad Asad",
              },
            },
          })),
        },
      },
    });
  }
  console.log("✅ Seeding Complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
