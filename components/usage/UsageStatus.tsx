import type { UsageResult } from "@/lib/usage/types";
import type { UsageSummary } from "@/lib/usage/weekly";
import { sundayOf } from "@/lib/usage/dates";
import { formatCount, formatUpdatedAt } from "@/lib/usage/format";
import { MACHINE_NAMES, USAGE_TOOLS } from "@/lib/usage/tools";

export function UsageStatus({ result, summary, today }: { result: UsageResult; summary: UsageSummary | null; today: string }) {
  if (!result.data) return <p role="status" className="text-sm text-muted-foreground">利用データを取得できません。</p>;
  const data = result.data;
  return <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      <p>更新 <time dateTime={data.generatedAt}>{formatUpdatedAt(data.generatedAt)}</time></p>
      {data.weeks.some(row => row.week === sundayOf(today)) && <p>今週分は途中の値です。</p>}
      {result.origin === "bundled" && <p role="status">保存データを表示しています。</p>}
      {summary?.stale && <p role="status">一部の集計が更新されていません。</p>}
    </div>
    <details>
      <summary className="w-fit cursor-pointer underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">数字の内訳と出典</summary>
      <div className="mt-3 space-y-3 border-l border-border pl-4">
        <p>{data.tools.map(tool => USAGE_TOOLS[tool].name).join("・")}の合算です。入力・出力・キャッシュを含みます。クラウド実行分の網羅性は未確認です。</p>
        <p>累計 {formatCount(summary?.totalTokens ?? null)} tokens。週の最大 {formatCount(summary?.peak?.tokens ?? null)} tokens。数字の帯は全履歴、図と表は直近26週の値です。</p>
        <p>Longest runは、同じログの記録の間に30分を超える空白がない指示の最大経過時間です。待ち時間を完全に除いた処理時間ではありません。</p>
        <p>取得期間: {data.coverage.from}の週〜{data.coverage.to}の週。取得期間内の記録がない分は0として合算しています。</p>
        <ul className="space-y-1">{data.collectors.map(c => <li key={c.machine}>{MACHINE_NAMES[c.machine]}の最終集計: <time dateTime={c.collectedAt}>{formatUpdatedAt(c.collectedAt)}</time></li>)}</ul>
      </div>
    </details>
  </div>;
}
