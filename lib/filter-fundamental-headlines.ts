import type { NewsDashboard, NewsHeadline } from "@/types/news-dashboard";

/** ~3 bulan */
const MAX_AGE_DAYS = 90;
const MS_PER_DAY = 86_400_000;

const TECH_OR_RECOMMENDATION: RegExp[] = [
  /analisis\s+teknikal/i,
  /technical\s+analysis/i,
  /\briset\s+teknikal\b/i,
  /tradingview/i,
  /sinyal\s+(beli|jual)/i,
  /rekomendasi\s+(beli|jual|tahan|akumulasi|reduce)/i,
  /\b(buy|sell)\s+signal\b/i,
  /target\s+(harga|naik|turun)\s+menuju/i,
  /menuju\s+rp\s*[\d.,\s]+[–-]\s*rp/i,
  /terobosan\s+area/i,
  /area\s+resist(ansi|ance)/i,
  /\bresistance\b/i,
  /\bsupport\s+(level|harga|area)/i,
  /\b(pivot|fibonacci|bollinger|candlestick)\b/i,
  /\b(rsi|macd)\b/i,
  /moving\s+average/i,
  /chart\s+(harian|mingguan|teknikal)/i,
  /potensi\s+rebound/i,
  /break\s*out\b|\bbreakout\b/i,
  /zona\s+overbought/i,
  /zona\s+oversold/i,
  /teknikal:\s*sinyal/i,
];

const ID_MONTH = new Map<string, number>([
  ["januari", 0],
  ["februari", 1],
  ["maret", 2],
  ["april", 3],
  ["mei", 4],
  ["juni", 5],
  ["juli", 6],
  ["agustus", 7],
  ["september", 8],
  ["oktober", 9],
  ["november", 10],
  ["desember", 11],
]);

function haystack(h: NewsHeadline): string {
  return `${h.source} ${h.category} ${h.headline}`;
}

export function isTechnicalOrRecommendationHeadline(h: NewsHeadline): boolean {
  const s = haystack(h);
  return TECH_OR_RECOMMENDATION.some((re) => re.test(s));
}

function parseIndonesianMonthYear(text: string): Date | null {
  const re =
    /(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/i;
  const m = text.match(re);
  if (!m) return null;
  const mi = ID_MONTH.get(m[1].toLowerCase());
  if (mi === undefined) return null;
  const y = Number.parseInt(m[2], 10);
  if (!Number.isFinite(y)) return null;
  return new Date(y, mi, 15);
}

function parseRelativeAgeDays(timeAgo: string): number | null {
  const a = timeAgo.trim().toLowerCase();
  if (/hari\s*ini|\bhr ini\b/.test(a)) return 0;
  if (/\bkemarin\b/.test(a)) return 1;
  let m: RegExpMatchArray | null;
  m = a.match(/(\d+)\s*jam lalu/);
  if (m) return Math.max(0, Number.parseInt(m[1], 10) / 24);
  m = a.match(/(\d+)\s*hari lalu/);
  if (m) return Number.parseInt(m[1], 10);
  m = a.match(/(\d+)\s*minggu lalu/);
  if (m) return Number.parseInt(m[1], 10) * 7;
  m = a.match(/(\d+)\s*bulan lalu/);
  if (m) return Number.parseInt(m[1], 10) * 30;
  m = a.match(/(\d+)\s*tahun lalu/);
  if (m) return Number.parseInt(m[1], 10) * 365;
  if (/beberapa\s+jam lalu/.test(a)) return 0.5;
  if (/sepekan lalu|seminggu yang lalu/.test(a)) return 7;
  return null;
}

function cutoffTime(ref: Date): number {
  return ref.getTime() - MAX_AGE_DAYS * MS_PER_DAY;
}

/** true = terlalu tua atau tidak memenuhi jendela (buang). */
export function isOutsideFundamentalRecencyWindow(h: NewsHeadline, ref: Date): boolean {
  const combined = `${h.timeAgo} ${h.headline}`;
  const t = h.timeAgo.toLowerCase();

  if (/historis|arsip|lampau|sudah\s+usang/i.test(t)) return true;
  if (/\bdata\s+real[-\s]?time\b/i.test(t)) return true;

  const rel = parseRelativeAgeDays(h.timeAgo);
  if (rel !== null && rel > MAX_AGE_DAYS) return true;

  const monthYear = parseIndonesianMonthYear(combined);
  if (monthYear) {
    return monthYear.getTime() < cutoffTime(ref);
  }

  const years: number[] = [];
  for (const m of combined.matchAll(/\b(20\d{2})\b/g)) {
    years.push(Number.parseInt(m[1], 10));
  }
  const refY = ref.getFullYear();
  for (const y of years) {
    if (y <= refY - 2) return true;
  }

  return false;
}

export function filterFundamentalRecentHeadlines(
  dashboard: NewsDashboard,
  reference: Date = new Date(),
): NewsDashboard {
  const headlines = dashboard.headlines.filter(
    (h) =>
      !isTechnicalOrRecommendationHeadline(h) && !isOutsideFundamentalRecencyWindow(h, reference),
  );
  return {
    ...dashboard,
    headlines,
    pageSubtitle:
      headlines.length > 0
        ? dashboard.pageSubtitle
        : "Tidak ada headline fundamental dalam ±90 hari terakhir yang lolos filter (teknikal/rekomendasi dikecualikan).",
  };
}
