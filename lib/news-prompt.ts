export function buildNewsAnalysisUserPrompt(ticker: string): string {
  const t = ticker.toUpperCase();
  return `Anda adalah analis pasar modal Indonesia untuk saham BEI/IDX.

Tugas:
1) Gunakan web search untuk menemukan berita terbaru yang relevan untuk saham berkode "${t}" (PT terkait, grup, sektor) — fokus pada berita yang masih segar (beberapa hari terakhir hingga hari ini).
2) Kurasi 4–8 headline berita yang paling relevan dari sumber berita Indonesia (mis. Kontan, Bisnis, CNBC Indonesia, Investor.id, dll.) bila memungkinkan.
3) Untuk setiap berita, nilai sentimen terhadap prospek harga saham "${t}": POSITIVE, NEGATIVE, atau NEUTRAL — serta tingkat dampak (mis. "LOW IMPACT", "MEDIUM IMPACT", "HIGH IMPACT").
4) Berikan ringkasan AI yang menjelaskan apakah narasi berita secara keseluruhan mendukung atau menekan saham tersebut, dan mengapa.
5) Isi bagian "News vs Flow" sebagai ilustrasi penyelarasan narasi vs sinyal pasar (gunakan bahasa hati-hati; tidak ada saran investasi personal).
6) Estimasi "Source mix" sebagai persentase (0–100) yang jumlahnya mendekati 100 antar Tier 1 Global, Tier 1 Lokal, Tier 2 Lokal berdasarkan ragam sumber yang Anda gunakan.

PENTING: Respons Anda HANYA satu objek JSON valid (tanpa markdown, tanpa backtick, tanpa teks di luar JSON). Skema persis:

{
  "ticker": "${t}",
  "companyName": "nama emiten jika diketahui",
  "pageTitle": "judul halaman singkat",
  "pageSubtitle": "subjudul deskriptif satu kalimat",
  "headlines": [
    {
      "source": "domain atau nama media",
      "timeAgo": "mis. 2 jam lalu / 1 hari lalu",
      "category": "Market News | Korporasi | Regulasi | Makro | dll",
      "headline": "judul berita",
      "sentiment": "POSITIVE|NEGATIVE|NEUTRAL",
      "impact": "LOW IMPACT|MEDIUM IMPACT|HIGH IMPACT",
      "url": "opsional URL jika tersedia"
    }
  ],
  "aiSummary": {
    "status": "SYNTHESIS READY",
    "narrative": "2–4 paragraf Bahasa Indonesia: kesimpulan apakah berita terbaru netral positif/negatif untuk saham, dengan alasannya.",
    "selectionRationale": "1 paragraf singkat: mengapa satu atau dua berita dianggap paling mendorong kesimpulan."
  },
  "metrics": {
    "sentimentScore": "mis. +2.1 Bullish bias (format bebas singkat)",
    "confidence": "mis. Medium — 3 sumber selaras",
    "narrativeHeat": "mis. 32 — Moderate attention",
    "materiality": "mis. Medium — perlu konfirmasi harga"
  },
  "newsVsFlow": {
    "signalAlignment": "satu baris ringkas, mis. Positive News + perlu konfirmasi aliran",
    "analysis": "2–3 kalimat penyelarasan narasi berita dengan kemungkinan perilaku investor institusi/asing (bukan fakta transaksi real-time).",
    "indicators": {
      "newsBias": "Positive | Negative | Mixed",
      "bigPlayerFlow": "Unknown | Supportive | Headwind | Neutral",
      "priceConfirmation": "Pending | Confirmed | Weak",
      "riskFlag": "Low | Medium | High"
    }
  },
  "sourceMix": {
    "tier1Global": 0,
    "tier1Local": 0,
    "tier2Local": 0
  }
}

Semua teks naratif dalam Bahasa Indonesia. Jika pencarian tidak menemukan berita cukup, tetap kembalikan JSON dengan headline terbaik yang ada dan jelaskan keterbatasan di "narrative".`;
}
