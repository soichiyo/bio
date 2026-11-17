import type { ToolId } from "./types";

export const TOOL_ORDER: readonly ToolId[] = ["claude-code", "codex", "cursor"];
export const USAGE_TOOLS: Record<ToolId, { name: string }> = {
  codex: { name: "Codex" },
  "claude-code": { name: "Claude Code" },
  cursor: { name: "Cursor" },
};
export const MACHINE_NAMES = { air: "手元Mac", m1: "M1" } as const;
export const USAGE_URL = "https://api.github.com/repos/soichiyo/ai-usage/contents/weekly.json";

