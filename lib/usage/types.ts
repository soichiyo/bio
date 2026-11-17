export type ToolId = "claude-code" | "codex" | "cursor";
export type MachineId = "air" | "m1";
export type SnapshotKey = "skillsTried" | "skillRuns" | "topReasoningShare" | "fastModeShare";
export type Coverage = { from: string; to: string };
export type WeeklyUsage = {
  schemaVersion: 1;
  generatedAt: string;
  collectors: { machine: MachineId; collectedAt: string }[];
  tools: ToolId[];
  coverage: Coverage;
  weeks: { week: string; tokens: number }[];
  longestRun?: { seconds: number; tool: "claude-code" | "codex"; week: string };
  snapshots: { key: SnapshotKey; value: number; asOf: string; source: "chatgpt-profile" | "manual" }[];
};
export type Usage = WeeklyUsage;
export type UsageResult =
  | { data: Usage; origin: "remote-cache" | "bundled" }
  | { data: null; origin: "unavailable" };

