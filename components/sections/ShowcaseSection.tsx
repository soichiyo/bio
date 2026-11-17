import { ToolNames } from "@/components/ToolNames";
import Image from "next/image";
import { showcase, showcaseEnabled, visibleShowcase, type ShowcaseItem } from "@/content/showcase";
export function ShowcaseSection({ items = showcase, enabled = showcaseEnabled }: { items?: ShowcaseItem[]; enabled?: boolean }) {
  const visible = visibleShowcase(items, enabled);
  if (!visible.length) return null;
  return <section id="showcase"><h2 className="mb-6 text-[28px] font-medium">Showcase</h2><div className="grid gap-5 sm:grid-cols-2">{visible.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="ai-panel">
    {item.image && <Image src={item.image} alt="" width={600} height={300} className="mb-4 h-auto w-full" />}<h3>{item.title}</h3><p className="mt-3 text-sm text-muted-foreground">{item.description}</p><div className="mt-4"><ToolNames entries={item.tools} /></div>
  </a>)}</div></section>;
}
