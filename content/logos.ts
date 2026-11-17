import { isCalendarDate } from "@/lib/stack/latest";
export type LogoAsset = { src: string; darkSrc?: string; size?: 20 | 40 };
export const logos: Record<string, LogoAsset> = {
  zenn: { src: "/assets/logos/zenn.svg" },
  note: { src: "/assets/logos/note.svg", size: 40 },
  github: { src: "/assets/logos/github-light.svg", darkSrc: "/assets/logos/github-dark.svg" },
  cursor: { src: "/assets/logos/cursor-light.svg", darkSrc: "/assets/logos/cursor-dark.svg" },
  todoist: { src: "/assets/logos/todoist-light.svg", darkSrc: "/assets/logos/todoist-dark.svg" },
};
export const logoByName: Record<string, string> = { GitHub: "github", Cursor: "cursor", Todoist: "todoist", Zenn: "zenn", note: "note" };
export type ToolEntry = { name: string; logo?: string; hidden?: boolean; addedAt?: string };
export function validateEntries(entries: ToolEntry[]) {
  for (const entry of entries) {
    if (entry.addedAt !== undefined && !isCalendarDate(entry.addedAt)) throw new Error("INVALID_ADDED_AT");
    if (!entry.name.trim() || (entry.logo !== undefined && !Object.prototype.hasOwnProperty.call(logos, entry.logo))) throw new Error("INVALID_PROFILE_ENTRY");
  }
  if (new Set(entries.map(entry => entry.name.trim())).size !== entries.length) throw new Error("DUPLICATE_PROFILE_ENTRY");
}

export function validateLogoNames(names: Record<string, string> = logoByName) {
  for (const key of Object.values(names)) {
    if (!key || !Object.prototype.hasOwnProperty.call(logos, key)) throw new Error("INVALID_LOGO_MAPPING");
  }
}
