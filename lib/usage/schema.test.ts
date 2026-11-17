import { describe, expect, it } from "vitest";
import { parseUsage, UsageValidationError } from "./schema";
import { usageFixture } from "./__fixtures__/usage";

describe("parseUsage", () => {
  it("accepts the contract without filling missing values", () => {
    const u = usageFixture(); delete u.longestRun; delete u.daily[0].tokens.codex;
    expect(parseUsage(u)).toEqual(u);
    expect(parseUsage(u).daily[0].tokens.codex).toBeUndefined();
    u.sources.cursor = { mode: "import", coverage: { from: "2026-11-10", to: "2026-11-17" } };
    u.daily[0].tokens.cursor = 0;
    expect(parseUsage(u)).toEqual(u);
    u.longestRun = { seconds: 0, date: "2026-11-10", tool: "codex", rule: "raw" };
    expect(parseUsage(u)).toEqual(u);
    expect(parseUsage({ ...u, sources: {}, daily: [], collectors: [], snapshots: [] }).daily).toEqual([]);
  });
  it.each(["root", "collector", "source", "coverage", "day", "tokens", "run", "snapshot"])("rejects unknown fields in %s without echoing data", level => {
    const u = usageFixture();
    const target = { root: u, collector: u.collectors[0], source: u.sources.codex, coverage: u.sources.codex?.coverage, day: u.daily[0], tokens: u.daily[0].tokens, run: u.longestRun, snapshot: u.snapshots[0] }[level]!;
    Object.assign(target, { privateField: "private-value" });
    expect(() => parseUsage(u)).toThrowError("INVALID_USAGE");
  });
  it.each([-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, "10"])("rejects invalid counts: %s", count => {
    const u = usageFixture(); Object.assign(u.daily[0].tokens, { codex: count });
    expect(() => parseUsage(u)).toThrow(UsageValidationError);
  });
  it.each(["2026-02-30", "11/10", "", "2026-11-10T00:00:00Z"])("rejects invalid date %s", date => {
    const u = usageFixture(); u.daily[0].date = date;
    expect(() => parseUsage(u)).toThrow(UsageValidationError);
  });
  it("rejects missing keys, duplicate dates, reversed order and out-of-coverage dates", () => {
    const u = usageFixture();
    const { daily: omitted, ...missing } = u; expect(omitted.length).toBeGreaterThan(0);
    expect(() => parseUsage(missing)).toThrow();
    expect(() => parseUsage({ ...u, daily: [u.daily[0], u.daily[0]] })).toThrow();
    expect(() => parseUsage({ ...u, daily: [...u.daily].reverse() })).toThrow();
    u.sources.codex!.coverage.from = "2026-11-11";
    expect(() => parseUsage(u)).toThrow();
  });
  it("rejects unknown version, enum, duplicate collectors and invalid timestamp", () => {
    expect(() => parseUsage({ ...usageFixture(), schemaVersion: 2 })).toThrow();
    const u = usageFixture(); Object.assign(u.snapshots[0], { key: "unknown" }); expect(() => parseUsage(u)).toThrow();
    const v = usageFixture(); v.collectors.push(v.collectors[0]); expect(() => parseUsage(v)).toThrow();
    expect(() => parseUsage({ ...usageFixture(), generatedAt: "2026-11-17" })).toThrow();
  });
});

