import { isCalendarDate } from "@/lib/stack/latest";
export type LogoAsset = { src: string; darkSrc?: string; size?: 20 | 40; neutralTile?: boolean };
export const logos: Record<string, LogoAsset> = {
  composio: { src: "/assets/logos/composio-light.svg", darkSrc: "/assets/logos/composio-dark.svg" },
  granola: { src: "/assets/logos/granola.svg" },
  figma: { src: "/assets/logos/figma.svg", size: 40 },
  cloudflare: { src: "/assets/logos/cloudflare.png", size: 40, neutralTile: true },
  meta: { src: "/assets/logos/meta.svg" },
  claude: { src: "/assets/logos/claude.svg" },
  openai: { src: "/assets/logos/openai.png" },
  grok: { src: "/assets/logos/grok.png" },
  t3code: { src: "/assets/logos/t3-code.svg" },
  herdr: { src: "/assets/logos/herdr.svg" },
  notion: { src: "/assets/logos/notion.png", neutralTile: true },
  gmail: { src: "/assets/logos/gmail.svg" },
  slack: { src: "/assets/logos/slack.svg" },
  drive: { src: "/assets/logos/drive.svg" },
  calendar: { src: "/assets/logos/calendar.svg" },
  zenn: { src: "/assets/logos/zenn.svg" },
  note: { src: "/assets/logos/note.svg", size: 40 },
  github: { src: "/assets/logos/github-light.svg", darkSrc: "/assets/logos/github-dark.svg" },
  cursor: { src: "/assets/logos/cursor-light.svg", darkSrc: "/assets/logos/cursor-dark.svg" },
  todoist: { src: "/assets/logos/todoist-light.svg", darkSrc: "/assets/logos/todoist-dark.svg" },
};
export const logoByName: Record<string, string> = { GitHub: "github", Cursor: "cursor", Todoist: "todoist", Zenn: "zenn", note: "note",
  Composio: "composio", Granola: "granola", Figma: "figma", Cloudflare: "cloudflare",
  "Claude Code": "claude", Codex: "openai", "Muse Code": "meta", "Grok Bot": "grok", "T3 Code": "t3code", Herdr: "herdr",
  Notion: "notion", Gmail: "gmail", Slack: "slack", Drive: "drive", Calendar: "calendar",
};
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
