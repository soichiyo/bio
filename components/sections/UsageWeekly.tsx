import type { CSSProperties } from "react";
import type { WeeklyUsage } from "@/lib/usage/types";
import { buildChart } from "@/lib/usage/weekly";
import { formatCount } from "@/lib/usage/format";

export function UsageWeekly({ usage, today }: { usage: WeeklyUsage | null; today: string }) {
  if (!usage) return <p role="status" className="text-sm text-muted-foreground">利用データを取得できません。</p>;
  const { columns, rows } = buildChart(usage, today);
  const peak = columns.reduce<typeof columns[number] | null>((best, column) =>
    column.tokens !== null && (best?.tokens == null || column.tokens > best.tokens) ? column : best, null);
  const description = `${columns[0].week}の週から${columns[25].week}の週まで、全ツール合算。${peak ? `最大は${peak.week}の週、${formatCount(peak.tokens)} tokens。` : "利用データは未取得です。"}`;
  return <section className="ai-panel min-w-0" aria-labelledby="weekly-usage-heading">
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
      <h2 id="weekly-usage-heading" className="text-[22px] font-medium">Token usage</h2>
      <p className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">Last 26 weeks · Weekly · All tools</p>
    </div>
    <div className="weekly-scroll" tabIndex={0} role="region" aria-label="週別グラフ（横スクロール）">
      <div role="img" aria-label={description} className="weekly-chart" data-rows={rows} style={{ "--weekly-rows": rows } as CSSProperties}>
        {columns.map((column, index) => <div key={column.week} data-week={column.week}
          title={`${column.week}の週: ${column.tokens === null ? "未取得" : `${formatCount(column.tokens)} tokens`}`}
          className={`weekly-column${column.inProgress ? " weekly-in-progress" : ""}`}>
          <div className="weekly-stack" aria-hidden="true">
            {Array.from({ length: column.dots }, (_, dot) => <span key={dot} className="weekly-token-dot" style={{ gridRow: rows - dot }} />)}
          </div>
          <span className="weekly-month" aria-hidden="true">{index === 0 || column.week.slice(0,7) !== columns[index-1].week.slice(0,7) ? `${Number(column.week.slice(5,7))}月` : ""}</span>
        </div>)}
      </div>
    </div>
    <div className="mt-6 flex flex-wrap justify-end gap-x-6 gap-y-2 font-data text-[10px] text-muted-foreground">
      <span><span className="text-foreground">●</span> = 5億 tokens<span className="ml-1">（切り上げ）</span></span>
      <span>● 集計中</span>
    </div>
    <details className="mt-5 text-xs">
      <summary className="w-fit cursor-pointer text-muted-foreground">週別の表</summary>
      <table className="mt-4 w-full text-left">
        <caption className="sr-only">直近26週の全ツール合算トークン数</caption>
        <thead><tr className="border-b border-border"><th scope="col" className="py-2">週の開始日</th><th scope="col" className="py-2 text-right">Tokens</th><th scope="col" className="py-2 text-right">丸の数</th></tr></thead>
        <tbody>{columns.map(column => <tr key={column.week} className="border-b border-border">
          <th scope="row" className="py-2 font-normal"><time dateTime={column.week}>{column.week}</time>{column.inProgress && <span className="ml-2 inline-block text-muted-foreground">集計中</span>}</th>
          <td className="py-2 text-right tabular-nums">{column.tokens === null ? "未取得" : formatCount(column.tokens)}</td>
          <td className="py-2 text-right tabular-nums">{column.tokens === null ? "—" : column.dots}</td>
        </tr>)}</tbody>
      </table>
    </details>
  </section>;
}
