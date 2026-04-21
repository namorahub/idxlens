import { NextRequest, NextResponse } from "next/server";

import { buildNewsAnalysisUserPrompt } from "@/lib/news-prompt";
import { parseNewsDashboardFromText } from "@/lib/parse-dashboard";

type AnthropicContentBlock = { type?: string; text?: string };

const SYSTEM =
  "Anda membantu membangun dashboard analisis berita saham Indonesia. Output akhir HANYA objek JSON valid sesuai permintaan pengguna — tanpa markdown, tanpa blok kode, tanpa teks pembuka atau penutup.";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { ticker?: unknown };

  const allowed = process.env.ALLOWED_ORIGIN?.trim() ?? "";
  const cors = corsHeaders(allowed);

  const rawTicker = typeof body.ticker === "string" ? body.ticker.trim() : "";
  const ticker = rawTicker.toUpperCase().replace(/\s+/g, "");

  if (!ticker || !/^[A-Z]{2,5}$/.test(ticker)) {
    return NextResponse.json(
      { error: "Masukkan kode saham IDX yang valid (contoh: BBCA, TLKM)." },
      { status: 400, headers: cors },
    );
  }

  const origin = req.headers.get("origin") ?? "";
  const originOk =
    !allowed || allowed === "*" || origin === allowed;
  if (!originOk) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403, headers: cors },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY belum dikonfigurasi" },
      { status: 500, headers: cors },
    );
  }

  const userContent = buildNewsAnalysisUserPrompt(ticker);

  const payload: Record<string, unknown> = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    system: SYSTEM,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{ role: "user", content: userContent }],
  };

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghubungi layanan AI" },
      { status: 502, headers: cors },
    );
  }

  const data = (await res.json()) as {
    model?: string;
    content?: AnthropicContentBlock[];
    error?: { message?: string };
    message?: string;
  };

  if (!res.ok) {
    const msg =
      data.error?.message ?? data.message ?? "Permintaan ke Anthropic gagal";
    return NextResponse.json(
      { error: msg },
      {
        status: res.status >= 400 && res.status < 600 ? res.status : 502,
        headers: cors,
      },
    );
  }

  let text = "";
  if (Array.isArray(data.content)) {
    for (const block of data.content) {
      if (block?.type === "text" && typeof block.text === "string") {
        text += block.text;
      }
    }
  }

  if (!text.trim()) {
    return NextResponse.json(
      {
        error:
          "Model tidak mengembalikan teks (mungkin perlu percobaan ulang atau cek quota).",
      },
      { status: 502, headers: cors },
    );
  }

  try {
    const dashboard = parseNewsDashboardFromText(text, ticker);
    return NextResponse.json(
      { dashboard, model: data.model },
      { headers: cors },
    );
  } catch (e) {
    const hint =
      e instanceof Error ? e.message : "Format respons AI tidak dikenali.";
    return NextResponse.json(
      {
        error: `Gagal memproses respons AI menjadi data dashboard. ${hint}`,
      },
      { status: 422, headers: cors },
    );
  }
}

function corsHeaders(allowed: string): Record<string, string> {
  const origin = allowed || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export async function OPTIONS() {
  const allowed = process.env.ALLOWED_ORIGIN?.trim() || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
