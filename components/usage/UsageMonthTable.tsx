import type { UsageMonth } from "@/lib/usage/heatmap";
import { formatCount } from "@/lib/usage/format";

export function UsageMonthTable({ months }: { months: UsageMonth[] }) {
  return <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-xs sm:text-sm">
    <caption className="mb-3 text-left text-muted-foreground">月別合計（表示期間内・取得分）</caption>
    <thead><tr className="border-b border-border"><th scope="col" className="py-3">月</th><th scope="col">Tokens</th><th scope="col">取得日数</th><th scope="col">状態</th></tr></thead>
    <tbody>{months.map(month => <tr key={month.month} className="border-b border-border">
      <th scope="row" className="py-3 font-normal" title={`${month.from}〜${month.to}`}>{month.month}</th>
      <td className="font-data">{formatCount(month.total)}</td><td>{month.observedDays} / {month.days}日</td><td>{month.total === null ? "未取得" : month.incomplete ? "一部未取得" : "取得済み"}</td>
    </tr>)}</tbody>
  </table></div>;
}

