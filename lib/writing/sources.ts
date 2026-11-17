import type { WritingPlatform } from "./types";
export const WRITING_PLATFORMS: readonly WritingPlatform[] = ["zenn", "note"];
export const WRITING_LIMIT = 6;
export const WRITING_REVALIDATE = 6 * 60 * 60;
export const WRITING_TIMEOUT_MS = 5_000;
export const WRITING_MAX_BYTES = 1024 * 1024;
export const WRITING_SOURCES = {
  zenn: { name: "Zenn", feedUrl: "https://zenn.dev/soichiyo/feed", profileUrl: "https://zenn.dev/soichiyo", hostname: "zenn.dev", articlePath: /^\/soichiyo\/articles\/[a-zA-Z0-9_-]+$/ },
  note: { name: "note", feedUrl: "https://note.com/soichiro/rss", profileUrl: "https://note.com/soichiro", hostname: "note.com", articlePath: /^\/soichiro\/n\/n[a-zA-Z0-9]+$/ },
} as const;
