import { TOOL_ORDER } from "./tools";
import { addDays } from "./dates";
import type { WeeklyUsage } from "./types";

export class UsageValidationError extends Error {
  constructor() { super("INVALID_USAGE"); this.name = "UsageValidationError"; }
}
function invalid(): never { throw new UsageValidationError(); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid();
  return value as Record<string, unknown>;
}
function keys(value: unknown, required: string[], optional: string[] = []) {
  const row = object(value);
  if (Object.keys(row).some(k => !required.includes(k) && !optional.includes(k))) invalid();
  if (required.some(k => !Object.prototype.hasOwnProperty.call(row, k))) invalid();
  return row;
}
function oneOf(value: unknown, allowed: readonly string[]): asserts value is string {
  if (typeof value !== "string" || !allowed.includes(value)) invalid();
}
function integer(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) invalid();
}
function date(value: unknown): asserts value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) invalid();
}
function timestamp(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value) ||
    !Number.isFinite(Date.parse(value))) invalid();
  date(value.slice(0, 10));
}
function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) invalid();
  return value;
}
function sunday(value: unknown): asserts value is string {
  date(value);
  if (new Date(value + "T00:00:00Z").getUTCDay() !== 0) invalid();
}
export function parseUsage(value: unknown): WeeklyUsage {
  const root = keys(value, ["schemaVersion", "generatedAt", "collectors", "tools", "coverage", "weeks", "snapshots"], ["longestRun"]);
  if (root.schemaVersion !== 1) invalid();
  timestamp(root.generatedAt);
  const seen = new Set<string>();
  for (const item of array(root.collectors)) {
    const row = keys(item, ["machine", "collectedAt"]);
    oneOf(row.machine, ["air", "m1"]); timestamp(row.collectedAt);
    if (seen.has(row.machine)) invalid();
    seen.add(row.machine);
  }
  const tools = array(root.tools);
  let previousTool = -1;
  if (!tools.length) invalid();
  for (const tool of tools) {
    oneOf(tool, TOOL_ORDER);
    const index = (TOOL_ORDER as readonly string[]).indexOf(tool);
    if (index <= previousTool) invalid();
    previousTool = index;
  }
  const coverage = keys(root.coverage, ["from", "to"]);
  sunday(coverage.from); sunday(coverage.to);
  if (coverage.from > coverage.to) invalid();
  const weeks = array(root.weeks);
  let expected = coverage.from, total = 0, last = "";
  for (const item of weeks) {
    const row = keys(item, ["week", "tokens"]);
    sunday(row.week); integer(row.tokens);
    if (row.week !== expected) invalid();
    last = row.week; expected = addDays(row.week, 7);
    total += row.tokens; integer(total);
  }
  if (!weeks.length || last !== coverage.to) invalid();
  if (Object.prototype.hasOwnProperty.call(root, "longestRun")) {
    const run = keys(root.longestRun, ["seconds", "tool", "week"]);
    integer(run.seconds); sunday(run.week); oneOf(run.tool, ["claude-code", "codex"]);
  }
  for (const item of array(root.snapshots)) {
    const row = keys(item, ["key", "value", "asOf", "source"]);
    oneOf(row.key, ["skillsTried", "skillRuns", "topReasoningShare", "fastModeShare"]);
    if (typeof row.value !== "number" || !Number.isFinite(row.value) || row.value < 0) invalid();
    date(row.asOf); oneOf(row.source, ["chatgpt-profile", "manual"]);
  }
  return value as WeeklyUsage;
}
