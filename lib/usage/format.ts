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
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
  return `${h ? h + "時間" : ""}${h || m ? m + "分" : ""}${s}秒`;
}
export function formatUpdatedAt(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value)) + " JST";
}

