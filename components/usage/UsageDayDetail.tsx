import type { HeatmapCell } from "@/lib/usage/heatmap";
import type { ToolId } from "@/lib/usage/types";
import { USAGE_TOOLS } from "@/lib/usage/tools";
import { formatCount } from "@/lib/usage/format";

export function UsageDayDetail({ cell, tools, onClose }: { cell: HeatmapCell; tools: ToolId[]; onClose: () => void }) {
  return <div id="usage-day-detail" className="mt-5 border border-border p-4 text-sm" aria-live="polite">
    <div className="flex items-center justify-between gap-3"><h3 className="font-data">{cell.date}</h3><button type="button" onClick={onClose} className="underline underline-offset-4">閉じる</button></div>
    <p className="mt-3">合計 {formatCount(cell.total)} tokens{cell.state === "partial" ? "（一部未取得）" : cell.state === "unknown" ? "（未取得）" : ""}</p>
    <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">{tools.map(tool => <li key={tool}>{USAGE_TOOLS[tool].name}: {cell.tokens[tool] === undefined ? "未取得" : `${formatCount(cell.tokens[tool]!)} tokens`}</li>)}</ul>
  </div>;
}

