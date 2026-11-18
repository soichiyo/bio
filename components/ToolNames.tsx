import type { ToolEntry } from "@/content/logos";
import { LogoTile } from "@/components/ui/LogoTile";
export function ToolNames({ entries, tiles = false }: { entries: ToolEntry[]; tiles?: boolean }) {
  return <ul className={tiles ? "flex flex-wrap items-start gap-x-2 gap-y-3" : "flex flex-wrap items-center gap-3"}>{entries.filter(entry => !entry.hidden).map(entry =>
    <li key={entry.name} className={tiles ? "w-[72px]" : "inline-flex min-h-10 items-center text-sm"}><LogoTile name={entry.name} logo={entry.logo} variant={tiles ? "tool" : "inline"} /></li>
  )}</ul>;
}
