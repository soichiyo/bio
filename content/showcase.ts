export type ShowcaseItem = { title: string; description: string; url: string; image?: string; hidden?: boolean };
export const showcase: ShowcaseItem[] = [];
export function visibleShowcase(items: ShowcaseItem[]) { return items.filter(item => !item.hidden); }
export function validateShowcase(items: ShowcaseItem[]) {
  for (const item of items) {
    if (!item.title.trim() || !item.description.trim() || !item.url.startsWith("https://") || (item.image && !item.image.startsWith("/assets/"))) throw new Error("INVALID_SHOWCASE");
  }
}
