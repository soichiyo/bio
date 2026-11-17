import type { Usage } from "../types";

export function usageFixture(): Usage {
  return {
    schemaVersion: 1,
    generatedAt: "2026-11-17T03:00:00Z",
    collectors: [
      { machine: "air", collectedAt: "2026-11-17T02:00:00Z" },
      { machine: "m1", collectedAt: "2026-11-17T02:00:00Z" },
    ],
    sources: {
      codex: { mode: "auto", coverage: { from: "2026-11-10", to: "2026-11-17" } },
      "claude-code": { mode: "auto", coverage: { from: "2026-11-10", to: "2026-11-17" } },
    },
    daily: [
      { date: "2026-11-10", tokens: { codex: 20, "claude-code": 10 } },
      { date: "2026-11-16", tokens: { codex: 4, "claude-code": 0 } },
      { date: "2026-11-17", tokens: { codex: 0, "claude-code": 0 } },
    ],
    longestRun: { seconds: 47175, tool: "codex", date: "2026-09-09", rule: "active" },
    snapshots: [{ key: "skillsTried", value: 1, asOf: "2026-11-16", source: "manual" }],
  };
}

