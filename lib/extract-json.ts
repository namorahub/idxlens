/**
 * Ambil objek JSON pertama dari teks (termasuk jika dibungkus ```json ... ```).
 */
export function extractJsonObject(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(trimmed);
  const inner = fence ? fence[1].trim() : trimmed;
  const start = inner.indexOf("{");
  const end = inner.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Tidak menemukan objek JSON dalam respons.");
  }
  const parsed: unknown = JSON.parse(inner.slice(start, end + 1));
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("JSON bukan objek.");
  }
  return parsed as Record<string, unknown>;
}
