import type { ToolId } from "./types";

export const TOOL_ORDER: readonly ToolId[] = ["claude-code", "codex", "cursor"];
export const USAGE_TOOLS: Record<ToolId, { name: string }> = {
  codex: { name: "Codex" },
  "claude-code": { name: "Claude Code" },
  cursor: { name: "Cursor" },
};
export const USAGE_URL = "https://api.github.com/repos/soichiyo/ai-usage/contents/weekly.json";

