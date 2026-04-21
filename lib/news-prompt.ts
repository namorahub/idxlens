export function buildNewsAnalysisUserPrompt(
  ticker: string,
  opts?: { referenceDateISO?: string },
): string {
  const t = ticker.toUpperCase();
  const ref = opts?.referenceDateISO?.trim() || new Date().toISOString().slice(0, 10);
  return `Anda adalah analis pasar modal Indonesia untuk saham BEI/IDX.

Tanggal referensi kurasi: ${ref} (gunakan untuk menilai apakah berita masih dalam jendela waktu).

Tugas:
1) Gunakan web search untuk menemukan berita yang relevan untuk saham berkode "${t}" (emiten, grup, sektor).
2) HANYA sertakan berita BERFUNDAMENTAL untuk "${t}": kinerja/keuangan, dividen/aksi korporasi, pinjaman/plafon strategis, kontrak/proyek operasional, regulasi sektor yang mempengaruhi emiten, litigasi/perizinan material, manajemen/struktur grup, transaksi afiliasi material, dan narasi bisnis sejenis.
3) JANGAN sertakan: analisis teknikal, level support/resistance, chart/candlestick, sinyal beli/jual, rekomendasi broker/analis harga, target harga teknikal, "potensi rebound" semata, riset teknikal platform (mis. TradingView teknikal), atau headline yang intinya rekomendasi trading.
4) HANYA peristiwa yang dipublikasikan atau masih relevan dalam **90 hari terakhir** menjelang tanggal referensi di atas. Jangan masukkan berita yang jelas lebih tua (mis. headline bertanggal tahun lalu kecuali masih dalam 90 hari). Field "timeAgo" harus konsisten dengan usia berita (mis. "5 hari lalu", "2 minggu lalu", atau tanggal relatif yang masuk akal).
5) Kurasi 4–8 headline (atau lebih sedikit jika sumber memenuhi syarat terbatas) dari media Indonesia bila memungkinkan (Kontan, Bisnis, CNBC Indonesia, Investor.id, IDX Channel korporasi, dll.).
6) Untuk setiap berita, nilai sentimen terhadap prospek fundamental "${t}": POSITIVE, NEGATIVE, atau NEUTRAL — serta tingkat dampak (mis. "LOW IMPACT", "MEDIUM IMPACT", "HIGH IMPACT").
7) Berikan ringkasan AI yang menjelaskan narasi fundamental terbaru untuk saham tersebut (bukan sinyal trading).
8) Isi bagian "News vs Flow" sebagai ilustrasi penyelarasan narasi vs sinyal pasar (bahasa hati-hati; bukan saran investasi personal).
9) Estimasi "Source mix" sebagai persentase (0–100) yang jumlahnya mendekati 100 antar Tier 1 Global, Tier 1 Lokal, Tier 2 Lokal berdasarkan ragam sumber yang Anda gunakan.

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
      "category": "Korporasi | Keuangan | Dividen | Regulasi | Operasional | Makro relevan emiten (bukan Market News teknikal)",
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

Semua teks naratif dalam Bahasa Indonesia. Ringkasan ("narrative", "selectionRationale") harus merujuk hanya pada headline fundamental yang Anda masukkan. Jika pencarian tidak menemukan berita fundamental dalam 90 hari, kembalikan "headlines": [] dan jelaskan keterbatasan di "narrative".`;
}
