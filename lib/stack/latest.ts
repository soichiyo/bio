import type { ToolEntry } from "@/content/logos";
export type Latest = { name: string; date: string; source: "added" | "reported" };
export function isCalendarDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + "T00:00:00Z")) &&
    new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}
export function selectLatest(entries: ToolEntry[], baseline: { name: string; asOf: string }, today: string): Latest {
  if (!isCalendarDate(today) || !isCalendarDate(baseline.asOf)) throw new Error("INVALID_DATE");
  let result: Latest = { name: baseline.name, date: baseline.asOf, source: "reported" };
  for (const entry of entries) {
    if (entry.addedAt !== undefined && !isCalendarDate(entry.addedAt)) throw new Error("INVALID_ADDED_AT");
    if (!entry.hidden && entry.addedAt && entry.addedAt > result.date && entry.addedAt <= today) {
      result = { name: entry.name, date: entry.addedAt, source: "added" };
    }
  }
  return result;
}
