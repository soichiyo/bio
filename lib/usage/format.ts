const number = new Intl.NumberFormat("ja-JP");
export function formatCount(value: number | null): string {
  return value === null ? "—" : number.format(value);
}
export function compactTokens(value: number | null): string {
  if (value === null) return "—";
  if (value >= 100000000) return (value / 100000000).toLocaleString("ja-JP", { maximumFractionDigits: 1 }) + "億";
  if (value >= 10000) return (value / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 }) + "万";
  return formatCount(value);
}
export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  return seconds >= 3600 ? `${Math.round(seconds / 3600)}h` : `${Math.round(seconds / 60)}m`;
}
export function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value)) + " JST";
}

export function formatUpdatedDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo", month: "numeric", day: "numeric",
  }).format(new Date(value));
}
export function formatWeekMonth(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo", month: "short", year: "numeric",
  }).format(new Date(`${value}T00:00:00+09:00`));
}
