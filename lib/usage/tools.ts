import type { ToolId } from "./types";

export const TOOL_ORDER: readonly ToolId[] = ["codex", "claude-code", "cursor"];
export const USAGE_TOOLS: Record<ToolId, { name: string; color: string }> = {
  codex: { name: "Codex", color: "var(--usage-codex, #ededed)" },
  "claude-code": { name: "Claude Code", color: "var(--usage-claude, #ff8a3d)" },
  cursor: { name: "Cursor", color: "var(--usage-cursor, #5b7cff)" },
};
export const MACHINE_NAMES = { air: "手元Mac", m1: "M1" } as const;
export const USAGE_URL = "https://raw.githubusercontent.com/soichiyo/ai-usage/main/usage.json";

