// Official image assets can be registered here when their use is confirmed.
// Without an image, render the tool's readable name.
export const logos: Record<string, { src: string; alt: string }> = {};
export type ToolEntry = { name: string; logo?: string; hidden?: boolean };
export function validateEntries(entries: ToolEntry[]) {
  for (const entry of entries) {
    if (!entry.name.trim() || (entry.logo && !Object.prototype.hasOwnProperty.call(logos, entry.logo))) throw new Error("INVALID_PROFILE_ENTRY");
  }
  if (new Set(entries.map(entry => entry.name)).size !== entries.length) throw new Error("DUPLICATE_PROFILE_ENTRY");
}
