const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
});
export function tokyoDate(value: Date | number): string {
  const parts = formatter.formatToParts(value);
  const get = (type: string) => parts.find(part => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function addDays(date: string, days: number): string {
  return new Date(Date.parse(date + "T00:00:00Z") + days * 86400000).toISOString().slice(0, 10);
}
export function sundayOf(date: string): string {
  return addDays(date, -new Date(date + "T00:00:00Z").getUTCDay());
}

