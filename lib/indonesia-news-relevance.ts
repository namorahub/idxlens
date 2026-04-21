/**
 * Filter judul RSS agar selaras dengan fokus: saham/pasar Indonesia,
 * makro ekonomi Indonesia, dan makro ekonomi global.
 * Cocokkan salah satu pola (OR).
 */
const RELEVANCE: RegExp[] = [
  // Pasar saham & emiten Indonesia
  /\b(saham|emiten|IHSG|JCI|pasar modal)\b/i,
  /\b(IDX|BEI|OJK)\b/,
  /\b(dividen|IPO|right\s*issue|buyback|stock\s*split|reksadana|warant|waran)\b/i,
  /\b(bursa|indeks)\s+(efek|saham|gabungan|harga)\b/i,
  /\b(laba|rugi)(\s+bersih)?\b/i,
  /\b(laporan keuangan)\b/i,
  /\b(obligasi negara|SUN)\b/i,
  // Makro Indonesia
  /\b(Bank Indonesia|BI[\s-]?(7|Rate))\b/i,
  /\b(suku bunga acuan)\b/i,
  /\b(inflasi)\b/i,
  /\b(rupiah)\b/i,
  /\b(APBN|APBD)\b/i,
  /\b(ekonomi Indonesia|neraca perdagangan|PDB|produk domestik bruto)\b/i,
  /\b(pertumbuhan ekonomi)(\s+(Indonesia|RI))?\b/i,
  /\b(ekspor|impor)\b/i,
  // Makro global / asing
  /\b(Fed|Federal Reserve|The Fed|Jerome Powell|Powell)\b/i,
  /\b(suku bunga AS|inflasi AS|resesi)\b/i,
  /\b(Wall Street|Dow Jones|NASDAQ|Nasdaq|S&P\s*500)\b/i,
  /\b(ECB|BOJ|Bank of England|IMF|World Bank|Bank Dunia)\b/i,
  /\b(Brent|WTI|OPEC|Migas|minyak mentah)\b/i,
  /\bharga (minyak|emas)\b/i,
  /\b(dolar AS|forex|valuta asing)\b/i,
  /\b(euro|yen|yuan)\b/i,
  /\b(ekonomi (global|dunia|AS|Amerika|Tiongkok|China|Eropa|Jepang))\b/i,
];

export function isRelevantIndonesiaMarketNewsTitle(title: string): boolean {
  return RELEVANCE.some((re) => re.test(title));
}

export function hasPotretInTitle(title: string): boolean {
  return /\bPOTRET\b/i.test(title);
}
