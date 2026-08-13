import streamers from "@/data/streamers.json";

export type Streamer = {
  slug: string;
  displayName: string;
  address: string;
  minXlm: number;
};

export function getStreamer(slug: string): Streamer | undefined {
  return (streamers as Streamer[]).find((s) => s.slug === slug.toLowerCase());
}
