import { validateEntries, type ToolEntry } from "./logos";
export type ShowcaseItem = { title: string; description: string; url: string; tools: ToolEntry[]; image?: string; hidden?: boolean };
export const showcaseEnabled = false;
export const showcase: ShowcaseItem[] = [];
export function visibleShowcase(items: ShowcaseItem[], enabled = showcaseEnabled) { return enabled ? items.filter(item => !item.hidden) : []; }
export function validateShowcase(items: ShowcaseItem[], assertAsset?: (path: string) => void) {
  const urls = new Set<string>();
  for (const item of items) {
    const url = new URL(item.url);
    if (!item.title.trim() || !item.description.trim() || url.protocol !== "https:" || !url.hostname || url.username || url.password || !item.tools.length) throw new Error("INVALID_SHOWCASE");
    if (urls.has(url.href)) throw new Error("DUPLICATE_SHOWCASE_URL");
    urls.add(url.href);
    validateEntries(item.tools);
    if (item.image !== undefined) {
      if (!item.image.startsWith("/assets/") || !assertAsset) throw new Error("INVALID_SHOWCASE_IMAGE");
      assertAsset(item.image);
    }
  }
}
