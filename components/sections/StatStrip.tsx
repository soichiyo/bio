import type { UsageSummary } from "@/lib/usage/weekly";
import { compactTokens, formatCount, formatDuration, durationParts } from "@/lib/usage/format";

function tokenParts(value: number | null) {
  const formatted = compactTokens(value);
  const unit = formatted.match(/[億万]$/)?.[0] ?? "";
  return [{ value: unit ? formatted.slice(0, -1) : formatted, unit }];
}

export function StatStrip({ summary }: { summary: UsageSummary | null }) {
  const items = [
    { label: "Total tokens", parts: tokenParts(summary?.totalTokens ?? null), exact: `${formatCount(summary?.totalTokens ?? null)} tokens` },
    { label: "Peak week", parts: tokenParts(summary?.peak?.tokens ?? null), exact: `${formatCount(summary?.peak?.tokens ?? null)} tokens` },
    { label: "Longest run", parts: durationParts(summary?.longestRun?.seconds ?? null), exact: formatDuration(summary?.longestRun?.seconds ?? null) },
    { label: "Longest streak", parts: [{ value: formatCount(summary?.longestStreak ?? null), unit: "weeks" }], exact: `${formatCount(summary?.longestStreak ?? null)} weeks` },
    { label: "Current streak", parts: [{ value: formatCount(summary?.currentStreak ?? null), unit: "weeks" }], exact: `${formatCount(summary?.currentStreak ?? null)} weeks` },
  ];
  return <section aria-label="AI usage statistics" className="-mx-5 border-l border-t border-border min-[420px]:mx-0">
    <dl className="grid grid-cols-2 sm:grid-cols-6 xl:grid-cols-5">
      {items.map((item, index) => <div key={item.label} className={`flex min-w-0 flex-col border-b border-r border-border bg-card px-5 py-6 ${index === 4 ? "col-span-2" : "col-span-1"} ${index < 3 ? "sm:col-span-2" : "sm:col-span-3"} xl:col-span-1`}>
        <dt className="order-2 mt-3 font-data text-xs uppercase tracking-[0.08em] text-muted-foreground">{item.label}</dt>
        <dd className="order-1 flex items-baseline whitespace-nowrap leading-none text-foreground" title={item.exact} aria-label={item.exact}>
          {item.parts.map((part, index) => <span key={index} className="inline-flex items-baseline">
            <span className="font-display-dot text-[44px] font-extrabold leading-none tracking-[-0.02em] min-[420px]:tracking-normal">{part.value}</span>
            {part.unit && <span className="ml-0.5 font-data text-lg font-normal leading-none text-muted-foreground">{part.unit}</span>}
          </span>)}
        </dd>
      </div>)}
    </dl>
  </section>;
}
