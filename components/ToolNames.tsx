import Image from "next/image";
import { logos, type ToolEntry } from "@/content/logos";
export function ToolNames({ entries }: { entries: ToolEntry[] }) {
  return <ul className="flex flex-wrap gap-2">{entries.filter(entry => !entry.hidden).map(entry => {
    const logo = entry.logo ? logos[entry.logo] : undefined;
    return <li key={entry.name} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm">{logo && <Image src={logo.src} alt={logo.alt} width={20} height={20} />}{entry.name}</li>;
  })}</ul>;
}
