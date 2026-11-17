import type { WritingPlatform } from "../types";
import { WRITING_SOURCES } from "../sources";
export function feedFixture(platform: WritingPlatform = "zenn", items = itemFixture(platform)) {
  return `<?xml version="1.0"?><rss version="2.0"><channel><title>Example</title><link>${WRITING_SOURCES[platform].profileUrl}</link>${items}</channel></rss>`;
}
export function itemFixture(platform: WritingPlatform = "zenn", overrides: { title?: string; link?: string; date?: string } = {}) {
  const link = overrides.link ?? (platform === "zenn" ? "https://zenn.dev/soichiyo/articles/example" : "https://note.com/soichiro/n/n123");
  return `<item><title>${overrides.title ?? "Example"}</title><link>${link}</link><pubDate>${overrides.date ?? "Tue, 17 Nov 2026 00:00:00 GMT"}</pubDate><description><![CDATA[Private body is ignored]]></description><guid>not-a-link</guid></item>`;
}
