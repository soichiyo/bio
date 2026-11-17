"use client";

import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Usage } from "@/lib/usage/types";
import { buildHeatmap, type UsageFilter } from "@/lib/usage/heatmap";
import { availableTools } from "@/lib/usage/daily";
import { USAGE_TOOLS } from "@/lib/usage/tools";
import { formatCount } from "@/lib/usage/format";
import { UsageDayDetail } from "@/components/usage/UsageDayDetail";
import { UsageMonthTable } from "@/components/usage/UsageMonthTable";

export function UsageHeatmap({ usage, today }: { usage: Usage | null; today: string }) {
  const [filter, setFilter] = useState<UsageFilter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const model = useMemo(() => usage ? buildHeatmap(usage, { today, filter }) : null, [usage, today, filter]);
  const tools = usage ? availableTools(usage) : [];
  const todayIndex = model?.cells.findIndex(cell => cell.date === today) ?? 0;
  const currentFocus = focusIndex ?? todayIndex;
  const selectedCell = model?.cells.find(cell => cell.date === selected);
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, number> = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 };
    let next = index;
    if (event.key in offsets) next += offsets[event.key];
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = todayIndex;
    else return;
    event.preventDefault();
    next = Math.min(Math.max(next, 0), todayIndex);
    setFocusIndex(next);
    buttons.current[next]?.focus();
  }
  function closeDetail() { setSelected(null); buttons.current[currentFocus]?.focus(); }
  return <section id="usage" aria-labelledby="usage-heading" className="ai-panel min-w-0 scroll-mt-6" onKeyDown={event => { if (event.key === "Escape" && selected) { event.preventDefault(); closeDetail(); } }}>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="usage-heading" className="text-[22px] font-medium">Token usage</h2>
      <div className="flex flex-wrap gap-1" aria-label="利用ツールの絞り込み">
        {(["all", ...tools] as UsageFilter[]).map(tool => <button key={tool} type="button" aria-pressed={filter === tool} onClick={() => setFilter(tool)} className="usage-filter">
          {tool === "all" ? "All" : USAGE_TOOLS[tool].name}
        </button>)}
      </div>
    </div>
    {!model?.hasData ? <p className="mt-8 text-sm text-muted-foreground">この期間の利用データは未取得です。</p> : <>
      <div className="usage-scroll mt-7" role="group" aria-label="日別トークン数。矢印キーで移動、Enterで詳細">
        <div className="usage-chart">
          <div className="usage-weekdays" aria-hidden="true">{["日", "月", "火", "水", "木", "金", "土"].map(day => <span key={day}>{day}</span>)}</div>
          <div className="usage-dots">{model.cells.map((cell, index) => cell.state === "future" ? <span key={cell.date} className="usage-cell" aria-hidden="true" /> : <button
            type="button" key={cell.date} ref={element => { buttons.current[index] = element; }} className="usage-cell"
            tabIndex={index === currentFocus ? 0 : -1} aria-pressed={selected === cell.date}
            aria-controls={selected === cell.date ? "usage-day-detail" : undefined}
            aria-label={`${cell.date}: ${cell.total === null ? "未取得" : formatCount(cell.total) + " tokens"}${cell.state === "partial" ? "、一部未取得" : ""}`}
            onFocus={() => setFocusIndex(index)} onKeyDown={event => move(event, index)}
            onClick={() => { setFocusIndex(index); setSelected(cell.date); }}
            title={`${cell.date}: ${formatCount(cell.total)}`}
          ><span className="usage-dot" data-state={cell.state} data-level={cell.level} style={{ "--dot-color": cell.dominant ? USAGE_TOOLS[cell.dominant].color : undefined } as CSSProperties} /></button>)}</div>
          <div className="usage-months" aria-hidden="true">{model.cells.map((cell, index) => index % 7 === 0 && (index === 0 || cell.date.slice(0, 7) !== model.cells[Math.max(index - 7, 0)].date.slice(0, 7)) ? <span key={cell.date} style={{ gridColumn: Math.floor(index / 7) + 1 }}>{Number(cell.date.slice(5, 7))}月</span> : null)}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-4 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap gap-x-4 gap-y-2">{tools.map(tool => <span key={tool} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: USAGE_TOOLS[tool].color }} />{USAGE_TOOLS[tool].name}</span>)}{!tools.includes("cursor") && <span>Cursor 未取得</span>}</div>
        <div className="flex items-center gap-2"><span>少</span>{[1, 2, 3, 4].map(level => <span key={level} className="usage-dot" data-level={level} />)}<span>多</span><span className="usage-dot" data-state="zero" />0<span className="usage-dot" data-state="unknown" />未取得<span className="usage-dot" data-state="partial" data-level="2" />一部未取得</div>
      </div>
      {selectedCell && selectedCell.state !== "future" && <UsageDayDetail cell={selectedCell} tools={model.tools} onClose={closeDetail} />}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>{model.from}〜{today} · JST</span><button type="button" aria-expanded={table} aria-controls="usage-month-table" onClick={() => setTable(!table)} className="min-h-6 underline underline-offset-4">{table ? "月別表を閉じる" : "月別表を見る"}</button></div>
      {table && <div id="usage-month-table"><UsageMonthTable months={model.months} /></div>}
    </>}
  </section>;
}

