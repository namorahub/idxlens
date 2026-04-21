"use client";

import { useEffect, useMemo, useState } from "react";

import type { MarketNewsItem } from "@/lib/fetch-indonesia-news";

type ApiResponse = {
  items: MarketNewsItem[];
  fetchedAt?: string;
  error?: string;
};

function formatDate(isoOrPub: string | null): string {
  if (!isoOrPub) return "—";
  const t = Date.parse(isoOrPub);
  if (!Number.isFinite(t)) return isoOrPub;
  return new Date(t).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAGE_SIZE = 9;

export function IndonesiaNewsSection() {
  const [items, setItems] = useState<MarketNewsItem[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = (await res.json()) as ApiResponse;
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Gagal memuat berita");
          setItems(data.items ?? []);
          return;
        }
        setItems(data.items ?? []);
        setFetchedAt(data.fetchedAt ?? null);
      } catch {
        if (!cancelled) setError("Tidak dapat menghubungi server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  return (
    <section
      className="mt-16 border-t border-[var(--border-subtle)] pt-10"
      aria-labelledby="indo-news-heading"
    >
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="indo-news-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Berita pasar & ekonomi Indonesia
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kumpulan headline terbaru dari media besar (RSS publik — tanpa API key).
          </p>
        </div>
        {fetchedAt ? (
          <p className="text-[11px] text-slate-600">
            Diperbarui:{" "}
            <span className="font-mono text-slate-500">
              {new Date(fetchedAt).toLocaleString("id-ID")}
            </span>
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-navy-800/80 bg-navy-950/40"
            />
          ))}
        </div>
      ) : null}

      {error && !loading ? (
        <p className="rounded-xl border border-amber-500/25 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
          {error}
        </p>
      ) : null}

      {!loading && items.length > 0 ? (
        <div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item, idx) => (
              <li key={`${item.link}-${(page - 1) * PAGE_SIZE + idx}`}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-navy-900/35 p-4 transition hover:border-teal-500/25 hover:bg-navy-900/60"
                >
                  <span className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-teal-500/90">
                    {item.source}
                  </span>
                  <span className="mb-3 flex-1 text-[15px] font-medium leading-snug text-slate-100 group-hover:text-white">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-500">{formatDate(item.pubDate)}</span>
                </a>
              </li>
            ))}
          </ul>
          {totalPages > 1 ? (
            <nav
              className="mt-4 flex flex-wrap items-center justify-start gap-2"
              aria-label="Halaman berita"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[var(--border-subtle)] bg-navy-900/40 px-3 py-1.5 text-xs text-slate-200 transition hover:border-teal-500/30 hover:bg-navy-900/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <div className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={n === page ? "page" : undefined}
                    className={
                      n === page
                        ? "min-w-[2rem] rounded-lg border border-teal-500/40 bg-teal-950/40 px-2.5 py-1.5 text-xs font-medium text-teal-100"
                        : "min-w-[2rem] rounded-lg border border-transparent px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-[var(--border-subtle)] hover:bg-navy-900/50 hover:text-slate-200"
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-[var(--border-subtle)] bg-navy-900/40 px-3 py-1.5 text-xs text-slate-200 transition hover:border-teal-500/30 hover:bg-navy-900/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </nav>
          ) : null}
        </div>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada berita yang bisa ditampilkan.</p>
      ) : null}

      <p className="mt-6 text-[11px] leading-relaxed text-slate-600">
        Sumber: RSS resmi / agregasi publik. Tautan membuka situs penerbit. Isi berita menjadi tanggung
        jawab masing-masing media.
      </p>
    </section>
  );
}
