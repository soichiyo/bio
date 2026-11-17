export type WritingPlatform = "zenn" | "note";
export type WritingEntry = {
  title: string;
  url: string;
  platform: WritingPlatform;
  publishedAt: string | null;
  displayMonth: string;
  datePrecision: "instant" | "month";
};
export type ParsedFeed = { entries: WritingEntry[]; rejectedItems: number };
export type CachedFeed = ParsedFeed & { fetchedAt: string };
export type WritingSourceResult = ParsedFeed & {
  platform: WritingPlatform;
  origin: "remote-cache" | "bundled" | "unavailable";
  fetchedAt: string | null;
};
export type WritingResult = { entries: WritingEntry[]; sources: WritingSourceResult[] };
