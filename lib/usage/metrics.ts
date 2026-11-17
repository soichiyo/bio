import type { Usage } from "./types";
import { addDays } from "./dates";
import { availableTools, dayValues, safeAdd } from "./daily";

export function collectorsAreStale(usage: Usage, now: Date): boolean {
  return (["air", "m1"] as const).some(machine => {
    const collector = usage.collectors.find(row => row.machine === machine);
    return !collector || now.getTime() - Date.parse(collector.collectedAt) >= 36 * 3600000;
  });
}
export function summarizeUsage(usage: Usage, today: string, now: Date) {
  const tools = availableTools(usage);
  const rows = usage.daily.filter(row => row.date <= today);
  const days = rows.map(row => ({ date: row.date, ...dayValues(row.tokens, tools) }));
  const observed = days.filter(day => day.total !== null);
  let totalTokens: number | null = null;
  let peak: { date: string; tokens: number } | null = null;
  let longestStreak = 0, streak = 0, previous = "";
  for (const day of days) {
    if (day.total !== null) {
      totalTokens = safeAdd(totalTokens ?? 0, day.total);
      if (!peak || day.total > peak.tokens) peak = { date: day.date, tokens: day.total };
    }
    streak = day.total !== null && day.total > 0
      ? (previous && addDays(previous, 1) === day.date ? streak + 1 : 1) : 0;
    longestStreak = Math.max(longestStreak, streak);
    previous = day.date;
  }
  const stale = collectorsAreStale(usage, now);
  const byDate = new Map(days.map(day => [day.date, day]));
  const latest = byDate.get(today);
  let currentStreak: number | null = null;
  if (!stale && observed.length) {
    const end = latest?.total && latest.total > 0 ? today : addDays(today, -1);
    const last = byDate.get(end);
    if (last && (last.total !== null && last.total > 0 || last.state === "zero")) {
      currentStreak = 0;
      for (let date = end; ; date = addDays(date, -1)) {
        const count = byDate.get(date)?.total;
        if (count === null || count === undefined || count === 0) break;
        currentStreak++;
      }
    }
  }
  return {
    totalTokens, peak,
    longestRun: usage.longestRun?.rule === "active" ? usage.longestRun : null,
    longestStreak: observed.length ? longestStreak : null,
    currentStreak,
    stale,
    partial: days.some(day => day.state === "partial" || day.state === "unknown"),
    range: observed.length ? { from: observed[0].date, to: observed[observed.length - 1].date } : null,
  };
}
export type UsageSummary = ReturnType<typeof summarizeUsage>;

