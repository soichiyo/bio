import { logoByName, type ToolEntry } from "./logos";
export const stack: { role: string; tools: ToolEntry[] }[] = [
  { role: "Agents", tools: [
    { name: "Claude Code", logo: logoByName["Claude Code"] },
    { name: "Codex", logo: logoByName.Codex },
    { name: "Cursor", logo: logoByName.Cursor },
    { name: "Muse Code", logo: logoByName["Muse Code"] },
    { name: "Grok Bot", logo: logoByName["Grok Bot"] },
  ] },
  { role: "Harness", tools: [
    { name: "T3 Code", logo: logoByName["T3 Code"] },
    { name: "Herdr", logo: logoByName.Herdr },
  ] },
];
export const stackNotes = { delegation: "Grok → Claude" };
export const latestBaseline = { name: "Gemini 4.0", asOf: "2026-11-16" };
