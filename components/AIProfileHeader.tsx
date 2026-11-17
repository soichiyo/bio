import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { showcase, showcaseEnabled as enabledByDefault, visibleShowcase, type ShowcaseItem } from "@/content/showcase";
export function AIProfileHeader({ showcaseItems = showcase, showcaseEnabled = enabledByDefault }: { showcaseItems?: ShowcaseItem[]; showcaseEnabled?: boolean }) {
  return <header className="flex flex-wrap items-center justify-between gap-5 border-b border-border py-7 pr-12 font-data text-[10px] uppercase tracking-widest">
    <a href="#top" className="shrink-0">Soichiyo / Profile</a>
    <nav aria-label="メイン"><ul className="flex flex-wrap gap-x-6 gap-y-3">
      <li><a href="#ai">AI</a></li>{visibleShowcase(showcaseItems, showcaseEnabled).length > 0 && <li><a href="#showcase">Showcase</a></li>}
      <li><a href="#writing">Writing</a></li><li><a href="#beyond">Beyond AI</a></li><li><a href="#contact">Contact</a></li>
    </ul></nav><ThemeToggle />
  </header>;
}
