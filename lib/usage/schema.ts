import { TOOL_ORDER } from "./tools";
import type { Usage } from "./types";

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
export function parseUsage(value: unknown): Usage {
  const root = keys(value, ["schemaVersion", "generatedAt", "collectors", "sources", "daily", "snapshots"], ["longestRun"]);
  if (root.schemaVersion !== 1) invalid();
  timestamp(root.generatedAt);
  const seen = new Set<string>();
  for (const item of array(root.collectors)) {
    const row = keys(item, ["machine", "collectedAt"]);
    oneOf(row.machine, ["air", "m1"]); timestamp(row.collectedAt);
    if (seen.has(row.machine)) invalid();
    seen.add(row.machine);
  }
  const sources = object(root.sources);
  for (const [tool, item] of Object.entries(sources)) {
    oneOf(tool, TOOL_ORDER);
    const row = keys(item, ["mode", "coverage"]);
    oneOf(row.mode, ["auto", "import"]);
    const range = keys(row.coverage, ["from", "to"]);
    date(range.from); date(range.to);
    if (range.from > range.to) invalid();
  }
  let previous = "";
  for (const item of array(root.daily)) {
    const row = keys(item, ["date", "tokens"]); date(row.date);
    if (row.date <= previous) invalid();
    previous = row.date;
    for (const [tool, count] of Object.entries(object(row.tokens))) {
      oneOf(tool, TOOL_ORDER); integer(count);
      const coverage = object(object(sources[tool]).coverage);
      if (row.date < (coverage.from as string) || row.date > (coverage.to as string)) invalid();
    }
  }
  if (Object.prototype.hasOwnProperty.call(root, "longestRun")) {
    const run = keys(root.longestRun, ["seconds", "tool", "date", "rule"]);
    integer(run.seconds); date(run.date);
    oneOf(run.tool, ["claude-code", "codex"]); oneOf(run.rule, ["active", "raw"]);
  }
  for (const item of array(root.snapshots)) {
    const row = keys(item, ["key", "value", "asOf", "source"]);
    oneOf(row.key, ["skillsTried", "skillRuns", "topReasoningShare", "fastModeShare"]);
    if (typeof row.value !== "number" || !Number.isFinite(row.value) || row.value < 0) invalid();
    date(row.asOf); oneOf(row.source, ["chatgpt-profile", "manual"]);
  }
  return value as Usage;
}

