import { NextResponse } from "next/server";

import { fetchIndonesiaMarketNews } from "@/lib/fetch-indonesia-news";

export async function GET() {
  try {
    const items = await fetchIndonesiaMarketNews();
    return NextResponse.json(
      {
        items,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
        },
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal memuat berita RSS", detail: msg, items: [] },
      { status: 502 },
    );
  }
}
