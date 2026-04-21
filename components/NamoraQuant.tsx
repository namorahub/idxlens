'use client';

import { useCallback, useMemo, useState } from 'react';

import { IndonesiaNewsSection } from '@/components/IndonesiaNewsSection';
import { LiveStreamsSection } from '@/components/LiveStreamsSection';
import type { NewsDashboard, NewsHeadline, SentimentLabel } from '@/types/news-dashboard';

type ApiOk = { dashboard: NewsDashboard };
type ApiErr = { error: string };

function sentimentStyles(s: SentimentLabel): string {
  switch (s) {
    case 'POSITIVE':
      return 'border-emerald-500/35 bg-emerald-500/15 text-emerald-300';
    case 'NEGATIVE':
      return 'border-rose-500/35 bg-rose-500/15 text-rose-300';
    default:
      return 'border-slate-500/35 bg-slate-500/15 text-slate-300';
  }
}

function normalizeMix(m: NewsDashboard['sourceMix']) {
  const sum = m.tier1Global + m.tier1Local + m.tier2Local;
  if (sum <= 0) {
    return { g: 34, l1: 33, l2: 33 };
  }
  return {
    g: (m.tier1Global / sum) * 100,
    l1: (m.tier1Local / sum) * 100,
    l2: (m.tier2Local / sum) * 100,
  };
}

function HeadlineRow({ item }: { item: NewsHeadline }) {
  return (
    <article className="border-b border-[var(--border-subtle)] py-4 last:border-b-0">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="font-medium text-slate-400">{item.source}</span>
        <span aria-hidden>·</span>
        <span>{item.timeAgo}</span>
        <span aria-hidden>·</span>
        <span>{item.category}</span>
      </div>
      <h3 className="mb-3 text-[15px] font-semibold leading-snug tracking-tight text-slate-100">
        {item.headline}
      </h3>
      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sentimentStyles(item.sentiment)}`}
        >
          {item.sentiment}
        </span>
        <span className="rounded-md border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200">
          {item.impact}
        </span>
      </div>
    </article>
  );
}

export function NamoraQuant() {
  const [input, setInput] = useState('');
  const [dashboard, setDashboard] = useState<NewsDashboard | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mix = useMemo(
    () => (dashboard ? normalizeMix(dashboard.sourceMix) : null),
    [dashboard],
  );

  const runSearch = useCallback(async () => {
    const ticker = input.trim().toUpperCase();
    if (!ticker) {
      setError('Masukkan kode saham.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const data = (await res.json()) as ApiOk & ApiErr;
      if (!res.ok) {
        setError(data.error || `Permintaan gagal (${res.status})`);
        setDashboard(null);
        return;
      }
      setDashboard(data.dashboard);
      setLastRun(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Jaringan atau server error.');
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const lastUpdatedLabel = lastRun
    ? lastRun.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="relative mx-auto min-h-dvh max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"
      />

      {/* Top bar */}
      <header className="mb-8 flex flex-col gap-6 border-b border-[var(--border-subtle)] pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-400/90">
            NamoraQuant
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            <span className="text-teal-400">NEWS</span>{' '}
            <span className="font-semibold text-slate-200">INTELLIGENCE</span>
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            Berita saham Indonesia terkurasi + sintesis AI — sentimen, dampak, dan konteks narasi.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p className="font-medium text-slate-400">Terakhir diperbarui</p>
          <p className="font-mono text-[13px] text-slate-300">{lastUpdatedLabel}</p>
        </div>
      </header>

      {/* Search */}
      <div className="mb-10 space-y-4">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            aria-hidden
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-4.35-4.35M10 18a8 8 0 110-16 8 8 0 010 16z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void runSearch();
            }}
            placeholder="Cari saham Indonesia (mis. BBCA, TLKM, BMRI)…"
            className="w-full rounded-2xl border border-navy-700/60 bg-navy-900/50 py-3.5 pl-12 pr-4 text-[15px] text-slate-100 placeholder:text-slate-600 outline-none ring-0 transition focus:border-teal-500/40 focus:bg-navy-900/80"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runSearch()}
            disabled={loading || !input.trim()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-b from-teal-400 to-teal-600 px-8 text-sm font-semibold text-navy-950 shadow-lg shadow-teal-950/30 transition hover:from-teal-300 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                Menganalisis…
              </span>
            ) : (
              'Analisa berita'
            )}
          </button>
          <button
            type="button"
            onClick={() => void runSearch()}
            disabled={loading || !dashboard}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-navy-800/50 px-5 text-sm font-medium text-slate-300 transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mb-8 rounded-xl border border-rose-500/30 bg-rose-950/35 px-4 py-3 text-sm text-rose-100"
        >
          {error}
        </p>
      ) : null}

      {!dashboard && !loading && !error ? (
        <div className="rounded-2xl border border-dashed border-navy-700/80 bg-navy-900/20 px-6 py-16 text-center">
          <p className="text-sm text-slate-500">
            Masukkan kode saham dan tekan <strong className="text-slate-400">Analisa berita</strong>{' '}
            untuk memuat headline terbaru dan ringkasan AI.
          </p>
        </div>
      ) : null}

      {dashboard ? (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              {dashboard.pageTitle ?? `${dashboard.ticker} — Berita & konteks AI`}
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              {dashboard.pageSubtitle}
              {dashboard.companyName ? (
                <span className="block pt-1 text-slate-400">{dashboard.companyName}</span>
              ) : null}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            {/* Left */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-glow-sm backdrop-blur-md">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Headline terpilih
                </h3>
                <p className="mb-4 text-xs text-slate-600">
                  Berita fundamental terkait emiten, ±90 hari terakhir (analisis teknikal & rekomendasi
                  broker dikecualikan).
                </p>
                <div className="divide-y-0">
                  {dashboard.headlines.length ? (
                    dashboard.headlines.map((h, i) => <HeadlineRow key={i} item={h} />)
                  ) : (
                    <p className="text-sm text-slate-500">Tidak ada headline dalam respons.</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-glow-sm backdrop-blur-md">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">Ringkasan AI</h3>
                  <span className="rounded-md border border-teal-500/35 bg-teal-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-200">
                    {dashboard.aiSummary.status}
                  </span>
                </div>
                <p className="text-[15px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {dashboard.aiSummary.narrative || '—'}
                </p>
                {dashboard.aiSummary.selectionRationale ? (
                  <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Alasan pemilihan fokus
                    </p>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {dashboard.aiSummary.selectionRationale}
                    </p>
                  </div>
                ) : null}
              </section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {(
                  [
                    ['Skor sentimen', dashboard.metrics.sentimentScore],
                    ['Keyakinan sintesis', dashboard.metrics.confidence],
                    ['Naratif heat', dashboard.metrics.narrativeHeat],
                    ['Materialitas', dashboard.metrics.materiality],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[var(--border-subtle)] bg-navy-900/50 p-4"
                  >
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    <p className="text-sm font-medium leading-snug text-slate-200">{value}</p>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 backdrop-blur-md">
                <h3 className="mb-3 text-sm font-semibold text-teal-300/95">
                  {dashboard.newsVsFlow.signalAlignment}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-400">
                  {dashboard.newsVsFlow.analysis}
                </p>
                <ul className="space-y-2 text-sm">
                  {(
                    [
                      ['Bias berita', dashboard.newsVsFlow.indicators.newsBias],
                      ['Aliran big player', dashboard.newsVsFlow.indicators.bigPlayerFlow],
                      ['Konfirmasi harga', dashboard.newsVsFlow.indicators.priceConfirmation],
                      ['Risiko', dashboard.newsVsFlow.indicators.riskFlag],
                    ] as const
                  ).map(([k, v]) => (
                    <li
                      key={k}
                      className="flex justify-between gap-4 border-b border-[var(--border-subtle)] border-opacity-50 py-2 last:border-0"
                    >
                      <span className="text-slate-500">{k}</span>
                      <span className="text-right font-medium text-slate-200">{v}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-navy-900/40 p-6">
                <h3 className="mb-4 text-sm font-semibold text-slate-300">Komposisi sumber</h3>
                {mix ? (
                  <div className="space-y-3">
                    {(
                      [
                        ['Tier 1 Global', mix.g, 'bg-sky-500/80'],
                        ['Tier 1 Lokal', mix.l1, 'bg-teal-500/80'],
                        ['Tier 2 Lokal', mix.l2, 'bg-slate-500/70'],
                      ] as const
                    ).map(([label, pct, bar]) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>{label}</span>
                          <span className="font-mono text-slate-400">{pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-navy-950">
                          <div
                            className={`h-full rounded-full ${bar}`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
                  Estimasi proporsi sumber berdasarkan sintesis model; bukan angka transaksi resmi.
                </p>
              </section>
            </div>
          </div>
        </>
      ) : null}

      <LiveStreamsSection />
      <IndonesiaNewsSection />
    </div>
  );
}
