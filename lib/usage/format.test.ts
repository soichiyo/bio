import { expect, it } from "vitest";
import { compactTokens, formatCount, formatDuration, formatUpdatedAt, formatUpdatedDate } from "./format";
it("keeps missing and measured zero distinct", () => {
  expect(formatCount(null)).toBe("—"); expect(formatCount(0)).toBe("0");
  expect(compactTokens(null)).toBe("—"); expect(compactTokens(0)).toBe("0");
  expect(formatDuration(null)).toBe("—"); expect(formatDuration(0)).toBe("0m");
});
it("keeps exact values alongside compact presentation", () => {
  expect(formatCount(556928616)).toBe("556,928,616");
  expect(compactTokens(556928616)).toBe("5.6億");
  expect(compactTokens(12800)).toBe("1.3万");
  expect(formatDuration(47175)).toBe("13h06m");
  expect(formatDuration(156565)).toBe("43h29m");
});
it("formats updates in JST", () => {
  expect(formatUpdatedAt("2026-11-16T15:00:00Z")).toBe("2026/11/17 00:00 JST");
});

it("shows complete minutes, with zero-padded minutes after hours", () => {
  expect(formatDuration(2700)).toBe("45m");
  expect(formatDuration(2730)).toBe("45m");
  expect(formatDuration(3599)).toBe("59m");
  expect(formatDuration(3600)).toBe("1h00m");
  expect(formatDuration(48600)).toBe("13h30m");
});
it("keeps short update dates in JST", () => {
  expect(formatUpdatedDate("2026-11-16T14:59:59Z")).toBe("11/16");
  expect(formatUpdatedDate("2026-11-16T15:00:00Z")).toBe("11/17");
  expect(formatUpdatedDate("2026-01-01T00:00:00Z")).toBe("1/1");
});
