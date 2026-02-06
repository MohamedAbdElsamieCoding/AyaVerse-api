export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652\u06D6-\u06ED\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}
