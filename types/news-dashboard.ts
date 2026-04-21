export type SentimentLabel = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export type NewsHeadline = {
  source: string;
  timeAgo: string;
  category: string;
  headline: string;
  sentiment: SentimentLabel;
  /** Contoh: "HIGH IMPACT", "MEDIUM IMPACT" */
  impact: string;
  url?: string;
};

export type NewsDashboard = {
  ticker: string;
  companyName?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  headlines: NewsHeadline[];
  aiSummary: {
    status: string;
    narrative: string;
    selectionRationale?: string;
  };
  metrics: {
    sentimentScore: string;
    confidence: string;
    narrativeHeat: string;
    materiality: string;
  };
  newsVsFlow: {
    signalAlignment: string;
    analysis: string;
    indicators: {
      newsBias: string;
      bigPlayerFlow: string;
      priceConfirmation: string;
      riskFlag: string;
    };
  };
  sourceMix: {
    tier1Global: number;
    tier1Local: number;
    tier2Local: number;
  };
};

export function isSentimentLabel(s: string): s is SentimentLabel {
  return s === "POSITIVE" || s === "NEGATIVE" || s === "NEUTRAL";
}
