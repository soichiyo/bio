import { describe, expect, it } from "vitest";
import { usageFixture } from "./__fixtures__/usage";
import { summarizeUsage } from "./metrics";
const now = new Date("2026-11-17T03:00:00Z");
const summary = (days: Record<string, number>) => {
  const u = usageFixture();
  u.daily = Object.entries(days).map(([date, n]) => ({ date, tokens: { codex: n, "claude-code": 0 } }));
  return summarizeUsage(u, "2026-11-17", now);
};
describe("summarizeUsage", () => {
  it("splits streaks at missing dates and zero", () => {
    const s = summary({ "2026-11-10": 1, "2026-11-11": 1, "2026-11-12": 1, "2026-11-14": 1, "2026-11-15": 1, "2026-11-16": 0, "2026-11-17": 0 });
    expect(s.longestStreak).toBe(3); expect(s.currentStreak).toBe(0);
  });
  it("uses yesterday when today is zero or not yet collected", () => {
    expect(summary({ "2026-11-15": 1, "2026-11-16": 1, "2026-11-17": 0 }).currentStreak).toBe(2);
    expect(summary({ "2026-11-15": 1, "2026-11-16": 1 }).currentStreak).toBe(2);
    expect(summary({ "2026-11-15": 1 }).currentStreak).toBeNull();
  });
  it("treats a positive partial day as active but partial zero as unknown", () => {
    const u = usageFixture(); u.daily = [{ date: "2026-11-17", tokens: { codex: 1 } }];
    expect(summarizeUsage(u, "2026-11-17", now).currentStreak).toBe(1);
    u.daily = [{ date: "2026-11-16", tokens: { codex: 0 } }];
    expect(summarizeUsage(u, "2026-11-17", now).currentStreak).toBeNull();
  });
  it("uses all history, skips future values and picks earliest tied peak", () => {
    const u = usageFixture();
    u.daily = [
      { date: "2025-09-17", tokens: { codex: 50 } },
      { date: "2026-11-10", tokens: { codex: 50 } },
      { date: "2026-11-18", tokens: { codex: 1000 } },
    ];
    const s = summarizeUsage(u, "2026-11-17", now);
    expect(s.totalTokens).toBe(100); expect(s.peak).toEqual({ date: "2025-09-17", tokens: 50 });
  });
  it("matches the reconciled day and preserves input", () => {
    const u = usageFixture(); u.daily = [{ date: "2026-11-10", tokens: { "claude-code": 465255201, codex: 91673415 } }];
    const before = JSON.stringify(u);
    expect(summarizeUsage(u, "2026-11-17", now).totalTokens).toBe(556928616);
    expect(JSON.stringify(u)).toBe(before);
  });
  it("shows active only, never substitutes raw", () => {
    const u = usageFixture();
    expect(summarizeUsage(u, "2026-11-17", now).longestRun?.seconds).toBe(47175);
    u.longestRun!.rule = "raw"; expect(summarizeUsage(u, "2026-11-17", now).longestRun).toBeNull();
    delete u.longestRun; expect(summarizeUsage(u, "2026-11-17", now).longestRun).toBeNull();
  });
  it("marks stale or missing collectors and hides current streak", () => {
    for (const missing of [false, true]) {
      const u = usageFixture();
      if (missing) u.collectors.pop(); else u.collectors[0].collectedAt = "2026-11-15T15:00:00Z";
      const s = summarizeUsage(u, "2026-11-17", now);
      expect(s.stale).toBe(true); expect(s.currentStreak).toBeNull();
      expect(s.totalTokens).toBe(34);
    }
  });
  it("distinguishes no observations and known zero", () => {
    const u = usageFixture(); u.daily = [];
    expect(summarizeUsage(u, "2026-11-17", now).totalTokens).toBeNull();
    expect(summary({ "2026-11-16": 0 }).totalTokens).toBe(0);
  });
  it("refuses aggregate overflow", () => {
    expect(() => summary({ "2026-11-16": Number.MAX_SAFE_INTEGER, "2026-11-17": 1 })).toThrow("USAGE_OVERFLOW");
  });
});

