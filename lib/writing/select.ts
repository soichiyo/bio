import { normalizeArticleUrl } from "./parse";
import { WRITING_LIMIT, WRITING_PLATFORMS } from "./sources";
import type { WritingEntry, WritingPlatform } from "./types";

export function fallbackEntries(value: unknown, platform: WritingPlatform): WritingEntry[] {
  if (!Array.isArray(value)) throw new Error("WRITING_INVALID_FALLBACK");
  return value.filter(row => row && row.platform === platform).map(row => {
    if (typeof row.title !== "string" || !row.title.trim() ||
        typeof row.date !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(row.date)) throw new Error("WRITING_INVALID_FALLBACK");
    return {title:row.title.trim(),url:normalizeArticleUrl(row.url,platform),platform,
      publishedAt:null,displayMonth:row.date,datePrecision:"month"};
  });
}
export function selectWriting(entries: readonly WritingEntry[], now: Date): WritingEntry[] {
  const unique = new Map<string, WritingEntry>();
  for (const original of entries) {
    const entry = {...original,url:normalizeArticleUrl(original.url,original.platform)};
    if (entry.publishedAt && Date.parse(entry.publishedAt) > now.getTime()) continue;
    const previous = unique.get(entry.url);
    if (!previous || (entry.publishedAt && (!previous.publishedAt || entry.publishedAt > previous.publishedAt))) unique.set(entry.url,entry);
  }
  return [...unique.values()].sort((a,b)=>{
    const month = b.displayMonth.localeCompare(a.displayMonth);
    if (month) return month;
    if (a.publishedAt && b.publishedAt) {
      return b.publishedAt.localeCompare(a.publishedAt) ||
        WRITING_PLATFORMS.indexOf(a.platform)-WRITING_PLATFORMS.indexOf(b.platform) ||
        a.url.localeCompare(b.url);
    }
    if (a.publishedAt) return -1;
    if (b.publishedAt) return 1;
    // Stable sorting preserves the original hand-picked order for month-only entries.
    return 0;
  }).slice(0,WRITING_LIMIT);
}
