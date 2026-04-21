/**
 * Embed YouTube: video tunggal (/embed/VIDEO_ID) atau live per channel (live_stream?channel=).
 */
export type LiveStreamConfig = {
  id: string;
  label: string;
  dotClass: string;
  /** Prioritas: embed video spesifik */
  videoId?: string;
  /** Query string tambahan untuk video (mis. si) */
  videoParams?: Record<string, string>;
  /** Tanpa videoId: embed live stream channel */
  channelId?: string;
};

export const LIVE_STREAMS: LiveStreamConfig[] = [
  {
    id: "idx",
    label: "IDX CHANNEL",
    dotClass: "bg-red-500",
    videoId: "ftuihGt1zuw",
    videoParams: { si: "9s5Jn9fmDnsLcgRK" },
  },
  {
    id: "bloomberg",
    label: "BLOOMBERG",
    dotClass: "bg-sky-500",
    channelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
  },
  {
    id: "yahoo",
    label: "YAHOO FINANCE",
    dotClass: "bg-violet-500",
    videoId: "aMHHTsFT9Iw",
    videoParams: { si: "jRJvKMh5W682um7C" },
  },
  {
    id: "cnn-id",
    label: "CNN",
    dotClass: "bg-orange-500",
    videoId: "2dJcAXTBthk",
    videoParams: { si: "qw795EESPXBpaKyF" },
  },
  {
    id: "aljazeera",
    label: "AL JAZEERA",
    dotClass: "bg-amber-400",
    channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
  },
];

/** mute=1 wajib agar autoplay diizinkan browser (Chrome, Safari, dll.) */
function liveStreamEmbedSrc(channelId: string): string {
  const params = new URLSearchParams({
    channel: channelId,
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
  });
  return `https://www.youtube.com/embed/live_stream?${params.toString()}`;
}

function videoEmbedSrc(videoId: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    ...(extra ?? {}),
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function embedSrc(s: LiveStreamConfig): string {
  if (s.videoId) {
    return videoEmbedSrc(s.videoId, s.videoParams);
  }
  if (s.channelId) {
    return liveStreamEmbedSrc(s.channelId);
  }
  return "";
}
