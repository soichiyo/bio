import type { ToolEntry } from "@/content/logos";
import { LogoTile } from "@/components/ui/LogoTile";
export function ToolNames({ entries }: { entries: ToolEntry[] }) {
  return <ul className="flex flex-wrap items-center gap-3">{entries.filter(entry => !entry.hidden).map(entry =>
    <li key={entry.name} className="inline-flex min-h-10 items-center text-sm"><LogoTile name={entry.name} logo={entry.logo} /></li>
  )}</ul>;
}
