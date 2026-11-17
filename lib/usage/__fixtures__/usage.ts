import type { WeeklyUsage } from "../types";
export function usageFixture(): WeeklyUsage {
  return {
    schemaVersion: 1,
    generatedAt: "2026-11-17T03:00:00Z",
    collectors: [{ machine:"air",collectedAt:"2026-11-17T02:00:00Z" },{ machine:"m1",collectedAt:"2026-11-17T02:00:00Z" }],
    tools: ["claude-code","codex"],
    coverage: { from:"2026-11-01",to:"2026-11-15" },
    weeks: [{week:"2026-11-01",tokens:5},{week:"2026-11-08",tokens:0},{week:"2026-11-15",tokens:7}],
    longestRun: {seconds:47175,tool:"codex",week:"2026-09-06"},
    snapshots: [{key:"skillsTried",value:1,asOf:"2026-11-16",source:"manual"}],
  };
}
