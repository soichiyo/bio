import type { UsageSummary } from "@/lib/usage/weekly";
import { compactTokens, formatCount, formatDuration, formatWeekMonth } from "@/lib/usage/format";

export function StatStrip({ summary }: { summary: UsageSummary | null }) {
  const items = [
    { label: "Total tokens", value: compactTokens(summary?.totalTokens ?? null), exact: formatCount(summary?.totalTokens ?? null) },
    { label: "Peak week", value: compactTokens(summary?.peak?.tokens ?? null), exact: formatCount(summary?.peak?.tokens ?? null), detail: summary?.peak ? formatWeekMonth(summary.peak.week) : null },
    { label: "Longest run", value: formatDuration(summary?.longestRun?.seconds ?? null), exact: formatDuration(summary?.longestRun?.seconds ?? null) },
    { label: "Longest streak", value: formatCount(summary?.longestStreak ?? null), exact: formatCount(summary?.longestStreak ?? null), detail: "weeks" },
    { label: "Current streak", value: formatCount(summary?.currentStreak ?? null), exact: formatCount(summary?.currentStreak ?? null), detail: "weeks" },
  ];
  return (
    <section aria-label="AI usage statistics" className="border-l border-t border-border">
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map(item => (
          <div key={item.label} className="flex min-w-0 flex-col border-b border-r border-border bg-card p-5">
            <dt className="order-2 mt-3 font-data text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{item.label}</dt>
            <dd className={`order-1 break-words text-foreground ${item.label === "Longest run" ? "font-data text-lg leading-relaxed sm:text-xl" : "font-display-dot text-3xl sm:text-4xl"}`} title={item.exact} aria-label={`${item.exact}${(item.label === "Total tokens" || item.label === "Peak week") ? " tokens" : ""}`}>
              {item.value}
            </dd>
            {item.detail && <dd className="order-3 mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

