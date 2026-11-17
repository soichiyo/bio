import { expect, it } from "vitest";
import { compactTokens, formatCount, formatDuration, formatUpdatedAt, formatUpdatedDate, formatWeekMonth } from "./format";
it("keeps missing and measured zero distinct", () => {
  expect(formatCount(null)).toBe("—"); expect(formatCount(0)).toBe("0");
  expect(compactTokens(null)).toBe("—"); expect(compactTokens(0)).toBe("0");
  expect(formatDuration(null)).toBe("—"); expect(formatDuration(0)).toBe("0m");
});
it("keeps exact values alongside compact presentation", () => {
  expect(formatCount(556928616)).toBe("556,928,616");
  expect(compactTokens(556928616)).toBe("5.6億");
  expect(compactTokens(12800)).toBe("1.3万");
  expect(formatDuration(47175)).toBe("13h");
  expect(formatDuration(156565)).toBe("43h");
});
it("formats updates in JST", () => {
  expect(formatUpdatedAt("2026-11-16T15:00:00Z")).toBe("2026/11/17 00:00 JST");
});

it("rounds runs to hours, or minutes for runs shorter than an hour", () => {
  expect(formatDuration(2700)).toBe("45m");
  expect(formatDuration(2730)).toBe("46m");
  expect(formatDuration(3599)).toBe("60m");
  expect(formatDuration(3600)).toBe("1h");
  expect(formatDuration(48600)).toBe("14h");
});
it("keeps short update dates and peak months in JST", () => {
  expect(formatUpdatedDate("2026-11-16T14:59:59Z")).toBe("11/16");
  expect(formatUpdatedDate("2026-11-16T15:00:00Z")).toBe("11/17");
  expect(formatUpdatedDate("2026-01-01T00:00:00Z")).toBe("1/1");
  expect(formatWeekMonth("2026-09-06")).toBe("Sep 2026");
  expect(formatWeekMonth("2026-11-01")).toBe("Nov 2026");
});
