import { expect, it } from "vitest";
import { compactTokens, formatCount, formatDuration, formatUpdatedAt } from "./format";
it("keeps missing and measured zero distinct", () => {
  expect(formatCount(null)).toBe("—"); expect(formatCount(0)).toBe("0");
  expect(compactTokens(null)).toBe("—"); expect(compactTokens(0)).toBe("0");
  expect(formatDuration(null)).toBe("—"); expect(formatDuration(0)).toBe("0秒");
});
it("keeps exact values alongside compact presentation", () => {
  expect(formatCount(556928616)).toBe("556,928,616");
  expect(compactTokens(556928616)).toBe("5.6億");
  expect(compactTokens(12800)).toBe("1.3万");
  expect(formatDuration(47175)).toBe("13時間6分15秒");
  expect(formatDuration(156565)).toBe("43時間29分25秒");
});
it("formats updates in JST", () => {
  expect(formatUpdatedAt("2026-11-16T15:00:00Z")).toBe("2026/11/17 00:00 JST");
});

