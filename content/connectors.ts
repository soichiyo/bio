import { logoByName, type ToolEntry } from "./logos";

export const connectors: ToolEntry[] = ["Composio", "Granola", "Figma", "Cloudflare"]
  .map(name => ({ name, logo: logoByName[name] }));
