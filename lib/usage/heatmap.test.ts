import { describe, expect, it } from "vitest";
import { buildHeatmap, quartiles } from "./heatmap";
import { summarizeUsage } from "./metrics";
import { usageFixture } from "./__fixtures__/usage";
describe("buildHeatmap", () => {
  it("uses 53 Sunday-first weeks and four future cells on 2026-11-17", () => {
    const h = buildHeatmap(usageFixture(), { today: "2026-11-17", filter: "all" });
    expect(h.cells).toHaveLength(371);
    expect(h.from).toBe("2025-11-16"); expect(h.to).toBe("2026-11-21");
    expect(h.cells.filter(c => c.state === "future")).toHaveLength(4);
  });
  it("keeps unknown, partial, known zero and future distinct, including coverage gaps", () => {
    const u = usageFixture(); u.daily.push({ date: "2026-11-18", tokens: { codex: 100 } });
    delete u.daily[0].tokens["claude-code"];
    const h = buildHeatmap(u, { today: "2026-11-17", filter: "all" });
    const cell = (date: string) => h.cells.find(c => c.date === date)!;
    expect(cell("2026-11-11").state).toBe("unknown");
    expect(cell("2026-11-11").total).toBeNull();
    expect(cell("2026-11-10").state).toBe("partial");
    expect(cell("2026-11-17").state).toBe("zero");
    expect(cell("2026-11-18").total).toBeNull();
  });
  it("uses nearest rank and handles identical values and empty data", () => {
    expect(quartiles([0, 1, 2, 3, 4])).toEqual([1, 2, 3]);
    expect(quartiles([0, 0])).toEqual([]);
    const u = usageFixture();
    u.daily = [1, 2, 3, 4].map(n => ({ date: `2026-11-${n + 10}`, tokens: { codex: n, "claude-code": 0 } }));
    expect(buildHeatmap(u, { today: "2026-11-17", filter: "all" }).cells.filter(c => c.total).map(c => c.level)).toEqual([1, 2, 3, 4]);
    u.daily.forEach(d => { d.tokens.codex = 5; });
    expect(buildHeatmap(u, { today: "2026-11-17", filter: "all" }).cells.filter(c => c.total).every(c => c.level === 4)).toBe(true);
    u.daily = [];
    expect(buildHeatmap(u, { today: "2026-11-17", filter: "all" }).hasData).toBe(false);
  });
  it("filters only the chart and table; sums match and input stays intact", () => {
    const u = usageFixture(), before = JSON.stringify(u);
    const h = buildHeatmap(u, { today: "2026-11-17", filter: "codex" });
    expect(h.months.reduce((sum, m) => sum + (m.total ?? 0), 0)).toBe(24);
    expect(h.cells.reduce((sum, c) => sum + (c.total ?? 0), 0)).toBe(24);
    expect(summarizeUsage(u, "2026-11-17", new Date("2026-11-17T03:00:00Z")).totalTokens).toBe(34);
    expect(JSON.stringify(u)).toBe(before);
    expect(h.months[h.months.length - 1].to).toBe("2026-11-17");
  });
  it("breaks tool ties consistently and accepts Cursor when imported", () => {
    const u = usageFixture(); u.sources.cursor = { mode: "import", coverage: { from: "2026-11-10", to: "2026-11-17" } };
    u.daily[0].tokens = { codex: 3, "claude-code": 3, cursor: 3 };
    expect(buildHeatmap(u, { today: "2026-11-17", filter: "all" }).cells.find(c => c.date === "2026-11-10")?.dominant).toBe("codex");
    expect(buildHeatmap(u, { today: "2026-11-17", filter: "cursor" }).cells.find(c => c.date === "2026-11-10")?.total).toBe(3);
  });
});

