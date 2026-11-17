import { XMLParser, XMLValidator } from "fast-xml-parser";
import { tokyoDate } from "@/lib/usage/dates";
import { WRITING_MAX_BYTES, WRITING_SOURCES } from "./sources";
import type { ParsedFeed, WritingPlatform } from "./types";

function invalid(): never { throw new Error("WRITING_INVALID_FEED"); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid();
  return value as Record<string, unknown>;
}
function string(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) invalid();
  return value.trim();
}
export function normalizeArticleUrl(value: unknown, platform: WritingPlatform): string {
  const raw = string(value);
  // URL() silently removes control characters; reject them before parsing.
  if (/[\u0000-\u0020\u007f\\]/.test(raw)) invalid();
  const url = new URL(raw);
  const source = WRITING_SOURCES[platform];
  const pathname = url.pathname.replace(/\/$/, "");
  if (url.protocol !== "https:" || url.hostname !== source.hostname ||
      url.username || url.password || url.port || !source.articlePath.test(pathname)) invalid();
  return `https://${source.hostname}${pathname}`;
}
export function parsePublishedAt(value: unknown): string {
  const raw = string(value);
  const match = /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*)?(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+(GMT|UTC|[+-]\d{4})$/.exec(raw);
  if (!match) invalid();
  const [, day, monthName, year, hour, minute, second, zone] = match;
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(monthName) + 1;
  const wall = `${year}-${String(month).padStart(2, "0")}-${day.padStart(2, "0")}T${hour}:${minute}:${second}.000Z`;
  const date = new Date(wall);
  if (!Number.isFinite(date.getTime()) || date.toISOString() !== wall) invalid();
  let offset = 0;
  if (zone !== "GMT" && zone !== "UTC") {
    const hours = Number(zone.slice(1, 3)), minutes = Number(zone.slice(3));
    if (hours > 23 || minutes > 59) invalid();
    offset = (hours * 60 + minutes) * (zone[0] === "+" ? 1 : -1);
  }
  return new Date(date.getTime() - offset * 60000).toISOString();
}
export function writingMonth(publishedAt: string): string {
  return tokyoDate(new Date(publishedAt)).slice(0, 7);
}
export function parseFeed(xml: string, platform: WritingPlatform): ParsedFeed {
  try {
    if (Buffer.byteLength(xml, "utf8") > WRITING_MAX_BYTES || /<!\s*(DOCTYPE|ENTITY)\b/i.test(xml) ||
        XMLValidator.validate(xml) !== true) invalid();
    const parser = new XMLParser({
      ignoreAttributes: false, parseTagValue: false, parseAttributeValue: false,
      trimValues: true, maxNestedTags: 64,
      // Numeric references require this option in FXP 5; declarations are rejected above.
      htmlEntities: true,
      isArray: (_name, path) => path === "rss.channel.item",
    });
    const root = object(parser.parse(xml));
    const rss = object(root.rss);
    if (rss["@_version"] !== "2.0") invalid();
    const channel = object(rss.channel);
    if (string(channel.link) !== WRITING_SOURCES[platform].profileUrl) invalid();
    const items = channel.item === undefined ? [] : channel.item;
    if (!Array.isArray(items)) invalid();
    const result: ParsedFeed = { entries: [], rejectedItems: 0 };
    for (const item of items) {
      try {
        const row = object(item);
        const title = string(row.title), url = normalizeArticleUrl(row.link, platform);
        const publishedAt = parsePublishedAt(row.pubDate);
        result.entries.push({ title, url, platform, publishedAt, displayMonth: writingMonth(publishedAt), datePrecision: "instant" });
      } catch { result.rejectedItems++; }
    }
    if (items.length && !result.entries.length) invalid();
    return result;
  } catch { throw new Error("WRITING_INVALID_FEED"); }
}
