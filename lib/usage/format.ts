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
export function durationParts(seconds: number | null): { value: string; unit: string }[] {
  if (seconds === null) return [{ value: "—", unit: "" }];
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return [{ value: String(minutes), unit: "m" }];
  return [
    { value: String(Math.floor(minutes / 60)), unit: "h" },
    { value: String(minutes % 60).padStart(2, "0"), unit: "m" },
  ];
}
export function formatDuration(seconds: number | null): string {
  return durationParts(seconds).map(part => part.value + part.unit).join("");
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
