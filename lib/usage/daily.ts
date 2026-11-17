import type { ToolId, Usage } from "./types";
import { TOOL_ORDER } from "./tools";
export type DayState = "used" | "zero" | "partial" | "unknown" | "future";
export function safeAdd(a: number, b: number): number {
  const result = a + b;
  if (!Number.isSafeInteger(result) || result < 0) throw new Error("USAGE_OVERFLOW");
  return result;
}
export function availableTools(usage: Usage): ToolId[] {
  return TOOL_ORDER.filter(tool => usage.sources[tool] !== undefined);
}
export function dayValues(tokens: Partial<Record<ToolId, number>>, tools: readonly ToolId[]) {
  const known = tools.filter(tool => tokens[tool] !== undefined);
  const total = known.length ? known.reduce((sum, tool) => safeAdd(sum, tokens[tool]!), 0) : null;
  const state: DayState = !known.length ? "unknown" : known.length < tools.length ? "partial" : total === 0 ? "zero" : "used";
  let dominant: ToolId | null = null;
  for (const tool of known) if (tokens[tool]! > 0 && (dominant === null || tokens[tool]! > tokens[dominant]!)) dominant = tool;
  return { total, state, dominant, known };
}

