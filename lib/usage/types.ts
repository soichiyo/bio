export type ToolId = "claude-code" | "codex" | "cursor";
export type MachineId = "air" | "m1";
export type SnapshotKey = "skillsTried" | "skillRuns" | "topReasoningShare" | "fastModeShare";
export type Coverage = { from: string; to: string };
export type Usage = {
  schemaVersion: 1;
  generatedAt: string;
  collectors: { machine: MachineId; collectedAt: string }[];
  sources: Partial<Record<ToolId, { mode: "auto" | "import"; coverage: Coverage }>>;
  daily: { date: string; tokens: Partial<Record<ToolId, number>> }[];
  longestRun?: { seconds: number; tool: "claude-code" | "codex"; date: string; rule: "active" | "raw" };
  snapshots: { key: SnapshotKey; value: number; asOf: string; source: "chatgpt-profile" | "manual" }[];
};
export type UsageResult =
  | { data: Usage; origin: "remote-cache" | "bundled" }
  | { data: null; origin: "unavailable" };

