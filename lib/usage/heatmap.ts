import type { ToolId, Usage } from "./types";
import { addDays, sundayOf } from "./dates";
import { availableTools, dayValues, safeAdd, type DayState } from "./daily";
export type UsageFilter = "all" | ToolId;
export type HeatmapCell = {
  date: string; total: number | null; state: DayState;
  dominant: ToolId | null; level: number | null;
  tokens: Partial<Record<ToolId, number>>;
};
export type UsageMonth = {
  month: string; from: string; to: string; total: number | null;
  observedDays: number; days: number; incomplete: boolean;
};
export function quartiles(values: number[]): number[] {
  const positive = values.filter(n => n > 0).sort((a, b) => a - b);
  return positive.length ? [0.25, 0.5, 0.75].map(q => positive[Math.ceil(positive.length * q) - 1]) : [];
}
export function buildHeatmap(usage: Usage, { today, filter }: { today: string; filter: UsageFilter }) {
  const tools = filter === "all" ? availableTools(usage) : [filter];
  const from = addDays(sundayOf(today), -52 * 7), to = addDays(from, 370);
  const byDate = new Map(usage.daily.map(row => [row.date, row.tokens]));
  const cells: HeatmapCell[] = [];
  for (let i = 0; i < 371; i++) {
    const date = addDays(from, i), original = byDate.get(date) ?? {};
    const tokens: Partial<Record<ToolId, number>> = {};
    for (const tool of tools) if (original[tool] !== undefined) tokens[tool] = original[tool];
    const values = dayValues(tokens, tools);
    cells.push({ date, tokens, total: date > today ? null : values.total,
      state: date > today ? "future" : values.state,
      dominant: date > today ? null : values.dominant, level: null });
  }
  const positive = cells.filter(c => c.total !== null && c.total > 0).map(c => c.total!);
  const thresholds = quartiles(positive);
  const equal = positive.length > 0 && positive.every(n => n === positive[0]);
  const months: UsageMonth[] = [];
  for (const cell of cells) {
    cell.level = cell.total === null ? null : cell.total === 0 ? 0 :
      equal ? 4 : cell.total <= thresholds[0] ? 1 : cell.total <= thresholds[1] ? 2 : cell.total <= thresholds[2] ? 3 : 4;
    if (cell.state === "future") continue;
    const key = cell.date.slice(0, 7);
    let month = months[months.length - 1];
    if (!month || month.month !== key) {
      month = { month: key, from: cell.date, to: cell.date, total: null, observedDays: 0, days: 0, incomplete: false };
      months.push(month);
    }
    month.to = cell.date; month.days++;
    if (cell.total !== null) { month.total = safeAdd(month.total ?? 0, cell.total); month.observedDays++; }
    if (cell.state === "partial" || cell.state === "unknown") month.incomplete = true;
  }
  return { cells, months, thresholds, tools, from, to, hasData: cells.some(c => c.total !== null) };
}

