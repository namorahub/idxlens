"use client";

import { LIVE_STREAMS, embedSrc } from "@/data/live-streams";

export function LiveStreamsSection() {
  return (
    <section
      className="mt-16 border-t border-[var(--border-subtle)] pt-10"
      aria-labelledby="live-streams-heading"
    >
      <h2
        id="live-streams-heading"
        className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
      >
        Live streams
      </h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {LIVE_STREAMS.map((s) => (
          <div key={s.id} className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 shrink-0 rounded-full ${s.dotClass}`}
                aria-hidden
              />
              <span className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-200">
                {s.label}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-navy-700/50 bg-navy-950/80 shadow-glow-sm">
              <div className="relative aspect-video w-full">
                <iframe
                  title={`Pemutar YouTube — ${s.label}`}
                  src={embedSrc(s)}
                  className="absolute inset-0 size-full min-h-0 w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-slate-600">
        Pemutar dimuat otomatis (tanpa suara dulu — sesuai kebijakan browser). Buka suara lewat kontrol
        YouTube jika perlu. Jika tidak ada siaran live, pemutar dapat menampilkan pesan dari YouTube.
      </p>
    </section>
  );
}
