import type { NewsDashboard, NewsHeadline, SentimentLabel } from "@/types/news-dashboard";
import { isSentimentLabel } from "@/types/news-dashboard";
import { extractJsonObject } from "@/lib/extract-json";

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function parseHeadline(x: unknown): NewsHeadline | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as Record<string, unknown>;
  const sentimentRaw = str(o.sentiment, "NEUTRAL").toUpperCase();
  const sentiment: SentimentLabel = isSentimentLabel(sentimentRaw)
    ? sentimentRaw
    : "NEUTRAL";
  return {
    source: str(o.source, "—"),
    timeAgo: str(o.timeAgo, "—"),
    category: str(o.category, "Berita"),
    headline: str(o.headline, ""),
    sentiment,
    impact: str(o.impact, "—"),
    url: typeof o.url === "string" ? o.url : undefined,
  };
}

export function parseNewsDashboardFromText(text: string, tickerFallback: string): NewsDashboard {
  const root = extractJsonObject(text);

  const rawHeadlines = Array.isArray(root.headlines) ? root.headlines : [];
  const headlines = (rawHeadlines.map(parseHeadline).filter(Boolean) as NewsHeadline[]).filter(
    (h) => h.headline.trim().length > 0,
  );

  const ai = typeof root.aiSummary === "object" && root.aiSummary !== null ? root.aiSummary : {};
  const a = ai as Record<string, unknown>;

  const metricsRoot =
    typeof root.metrics === "object" && root.metrics !== null ? root.metrics : {};
  const m = metricsRoot as Record<string, unknown>;

  const nvRoot =
    typeof root.newsVsFlow === "object" && root.newsVsFlow !== null ? root.newsVsFlow : {};
  const nv = nvRoot as Record<string, unknown>;
  const indRoot =
    typeof nv.indicators === "object" && nv.indicators !== null ? nv.indicators : {};
  const ind = indRoot as Record<string, unknown>;

  const smRoot =
    typeof root.sourceMix === "object" && root.sourceMix !== null ? root.sourceMix : {};
  const sm = smRoot as Record<string, unknown>;

  const t = str(root.ticker, tickerFallback).toUpperCase();

  return {
    ticker: t,
    companyName: str(root.companyName, ""),
    pageTitle: str(root.pageTitle, `${t} — Berita kurasi & konteks AI`),
    pageSubtitle: str(
      root.pageSubtitle,
      "Ringkasan sentimen dan materialitas berdasarkan berita publik terkini.",
    ),
    headlines,
    aiSummary: {
      status: str(a.status, "SYNTHESIS READY"),
      narrative: str(a.narrative, ""),
      selectionRationale:
        typeof a.selectionRationale === "string" ? a.selectionRationale : undefined,
    },
    metrics: {
      sentimentScore: str(m.sentimentScore, "—"),
      confidence: str(m.confidence, "—"),
      narrativeHeat: str(m.narrativeHeat, "—"),
      materiality: str(m.materiality, "—"),
    },
    newsVsFlow: {
      signalAlignment: str(nv.signalAlignment, "—"),
      analysis: str(nv.analysis, ""),
      indicators: {
        newsBias: str(ind.newsBias, "—"),
        bigPlayerFlow: str(ind.bigPlayerFlow, "—"),
        priceConfirmation: str(ind.priceConfirmation, "—"),
        riskFlag: str(ind.riskFlag, "—"),
      },
    },
    sourceMix: {
      tier1Global: num(sm.tier1Global, 0),
      tier1Local: num(sm.tier1Local, 0),
      tier2Local: num(sm.tier2Local, 0),
    },
  };
}
