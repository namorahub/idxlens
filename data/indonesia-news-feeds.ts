/** Sumber RSS publik (gratis, tanpa API key). URL dapat berubah sewaktu-waktu oleh penerbit. */
export type NewsFeedSource = {
  id: string;
  /** Nama singkat untuk label di UI */
  name: string;
  url: string;
};

export const INDONESIA_MARKET_NEWS_FEEDS: NewsFeedSource[] = [
  {
    id: "cnbc-market",
    name: "CNBC Indonesia",
    url: "https://www.cnbcindonesia.com/market/rss/",
  },
  {
    id: "cnbc-news",
    name: "CNBC Indonesia",
    url: "https://www.cnbcindonesia.com/news/rss/",
  },
  {
    id: "detik-finance",
    name: "detikFinance",
    url: "https://finance.detik.com/rss",
  },
  {
    id: "google-saham-ekonomi",
    name: "Agregasi (Google News)",
    url:
      "https://news.google.com/rss/search?q=saham+Indonesia+OR+IHSG+OR+BEI+OR+ekonomi+Indonesia+OR+bursa+efek&hl=id&gl=ID&ceid=ID:id",
  },
];
