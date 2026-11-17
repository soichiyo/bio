import { logoByName, type ToolEntry } from "./logos";
export const stack: { role: string; tools: ToolEntry[] }[] = [
  { role: "Agents", tools: ["Claude Code", "Codex", "Cursor", "Muse Code", "Grok Bot"].map(name => ({ name, logo: logoByName[name] })) },
  { role: "Harness", tools: ["T3 Code", "Herdr"].map(name => ({ name, logo: logoByName[name] })) },
];
export const stackNotes = { delegation: "Grok → Claude", latest: "Gemini 4.0", asOf: "2026-11-16" };
