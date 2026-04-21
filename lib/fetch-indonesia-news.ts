import Parser from "rss-parser";

import { INDONESIA_MARKET_NEWS_FEEDS } from "@/data/indonesia-news-feeds";
import {
  hasPotretInTitle,
  isRelevantIndonesiaMarketNewsTitle,
} from "@/lib/indonesia-news-relevance";

export type MarketNewsItem = {
  title: string;
  link: string;
  pubDate: string | null;
  source: string;
  /** Untuk sort */
  timestamp: number;
};

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; NamoraQuant/1.0; +https://www.google.com) RSS reader",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

function parseTime(isoDate?: string, pubDate?: string): number {
  const raw = isoDate || pubDate;
  if (!raw) return 0;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : 0;
}

function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/** CNBC Indonesia menandai konten video dengan prefiks "VIDEO :" di judul RSS. */
function isCnbcVideoHeadline(item: MarketNewsItem): boolean {
  if (item.source !== "CNBC Indonesia") return false;
  return /\bVIDEO\s*:/i.test(item.title);
}

function shouldIncludeNewsItem(item: MarketNewsItem): boolean {
  if (isCnbcVideoHeadline(item)) return false;
  if (hasPotretInTitle(item.title)) return false;
  return isRelevantIndonesiaMarketNewsTitle(item.title);
}

export async function fetchIndonesiaMarketNews(): Promise<MarketNewsItem[]> {
  const settled = await Promise.allSettled(
    INDONESIA_MARKET_NEWS_FEEDS.map(async (feed) => {
      const data = await parser.parseURL(feed.url);
      const name = feed.name;
      return (data.items ?? []).map((item) => {
        const title = (item.title ?? "").trim() || "Tanpa judul";
        const link = (item.link ?? "").trim() || "#";
        const iso = item.isoDate;
        const pub = item.pubDate;
        return {
          title,
          link,
          pubDate: iso || pub || null,
          source: name,
          timestamp: parseTime(iso, pub),
        } satisfies MarketNewsItem;
      });
    }),
  );

  const merged: MarketNewsItem[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") {
      merged.push(...r.value);
    }
  }

  const seen = new Set<string>();
  const unique: MarketNewsItem[] = [];
  for (const item of merged) {
    if (!shouldIncludeNewsItem(item)) continue;
    const key = `${item.link}|${normalizeTitle(item.title)}`;
    if (seen.has(key)) continue;
    if (item.link === "#" && item.title === "Tanpa judul") continue;
    seen.add(key);
    unique.push(item);
  }

  unique.sort((a, b) => b.timestamp - a.timestamp);

  /** Setelah filter relevansi, ambil cukup banyak agar paginasi (~9/hal) tetap terisi. */
  return unique.slice(0, 45);
}
