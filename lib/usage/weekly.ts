import type { WeeklyUsage } from "./types";
import { addDays, sundayOf } from "./dates";

export const DOT_TOKENS = 500_000_000;
export const CHART_WEEKS = 26;
export const MIN_ROWS = 8;

export function dotsFor(tokens: number): number {
  if (!Number.isSafeInteger(tokens) || tokens < 0) throw new Error("INVALID_TOKEN_COUNT");
  return tokens === 0 ? 0 : Math.ceil(tokens / DOT_TOKENS);
}
export function buildChart(usage: WeeklyUsage, today: string) {
  const currentWeek = sundayOf(today);
  const byWeek = new Map(usage.weeks.map(row => [row.week, row.tokens]));
  const columns = Array.from({ length: CHART_WEEKS }, (_, index) => {
    const week = addDays(currentWeek, (index - CHART_WEEKS + 1) * 7);
    const tokens = byWeek.get(week) ?? null;
    return { week, tokens, dots: tokens === null ? 0 : dotsFor(tokens), inProgress: week === currentWeek && tokens !== null };
  });
  return { columns, rows: Math.max(MIN_ROWS, ...columns.map(column => column.dots)) };
}
export function collectorsAreStale(usage: WeeklyUsage, now: Date): boolean {
  return (["air", "m1"] as const).some(machine => {
    const collector = usage.collectors.find(row => row.machine === machine);
    return !collector || now.getTime() - Date.parse(collector.collectedAt) >= 36 * 3600000;
  });
}
export function summarizeUsage(usage: WeeklyUsage, today: string, now: Date) {
  const currentWeek = sundayOf(today), previousWeek = addDays(currentWeek, -7);
  const weeks = usage.weeks.filter(row => row.week <= currentWeek);
  let totalTokens = 0, longestStreak = 0, streak = 0, previous = "";
  let peak: { week: string; tokens: number } | null = null;
  for (const row of weeks) {
    totalTokens += row.tokens;
    if (!Number.isSafeInteger(totalTokens)) throw new Error("USAGE_OVERFLOW");
    if (!peak || row.tokens > peak.tokens) peak = { ...row };
    streak = row.tokens > 0 ? (previous && addDays(previous, 7) === row.week ? streak + 1 : 1) : 0;
    longestStreak = Math.max(longestStreak, streak);
    previous = row.week;
  }
  const stale = collectorsAreStale(usage, now);
  const byWeek = new Map(weeks.map(row => [row.week, row.tokens]));
  let currentStreak: number | null = null;
  if (!stale && weeks.length && weeks[weeks.length - 1].week >= previousWeek) {
    currentStreak = 0;
    const end = (byWeek.get(currentWeek) ?? 0) > 0 ? currentWeek : previousWeek;
    for (let week = end; (byWeek.get(week) ?? 0) > 0; week = addDays(week, -7)) currentStreak++;
  }
  return { totalTokens, peak, longestRun: usage.longestRun ?? null, longestStreak, currentStreak, stale };
}
export type UsageSummary = ReturnType<typeof summarizeUsage>;
