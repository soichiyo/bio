import type { UsageResult } from "@/lib/usage/types";
import { formatUpdatedDate } from "@/lib/usage/format";

export function UsageStatus({ result }: { result: UsageResult }) {
  if (!result.data) return null;
  return <p className="text-xs leading-relaxed text-muted-foreground">
    Updated <time dateTime={result.data.generatedAt}>{formatUpdatedDate(result.data.generatedAt)}</time>
  </p>;
}
