import type { UsageResult } from "@/lib/usage/types";
import { summarizeUsage } from "@/lib/usage/metrics";
import { AIProfileHeader } from "@/components/AIProfileHeader";
import { AIHero } from "@/components/sections/AIHero";
import { StatStrip } from "@/components/sections/StatStrip";
import { UsageStatus } from "@/components/usage/UsageStatus";
import { UsageHeatmap } from "@/components/sections/UsageHeatmap";
import { StackSection } from "@/components/sections/StackSection";
import { PluginsSection } from "@/components/sections/PluginsSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { BeyondAISection } from "@/components/sections/BeyondAISection";
import { ChatButton } from "@/components/ui/ChatButton";
import { profileData } from "@/content/profile";
import { writings } from "@/content/writing";
import { buildHeatmap } from "@/lib/usage/heatmap";

export function AIProfilePage({ result, today, now }: { result: UsageResult; today: string; now: Date }) {
  let summary = null;
  try {
    if (result.data) {
      summary = summarizeUsage(result.data, today, now);
      buildHeatmap(result.data, { today, filter: "all" });
    }
  } catch { result = { data: null, origin: "unavailable" }; summary = null; }
  return <div id="top" className="ai-profile mx-auto max-w-[1144px] px-5 sm:px-8">
    <AIProfileHeader /><main><AIHero />
      <StatStrip summary={summary} />
      <div className="mb-8 mt-4"><UsageStatus result={result} summary={summary} today={today} /></div>
      <UsageHeatmap usage={result.data} today={today} />
      <div className="mt-5 grid gap-5 md:grid-cols-2"><StackSection /><PluginsSection snapshots={result.data?.snapshots ?? []} /></div>
      <div className="mt-20"><ShowcaseSection /></div>
      <section id="writing" className="mb-20 scroll-mt-8"><h2 className="mb-6 text-[28px] font-medium">Writing</h2>
        <div className="border-t border-border">{writings.map(writing => <a key={writing.url} href={writing.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 border-b border-border py-6 hover:bg-accent sm:gap-8">
          <span className="w-10 shrink-0 font-data text-[10px] uppercase text-muted-foreground">{writing.platform}</span><h3 className="min-w-0 flex-1 text-sm font-medium sm:text-base">{writing.title}</h3><span className="shrink-0 font-data text-[10px] text-muted-foreground">{writing.date} ↗</span>
        </a>)}</div><p className="mt-5 flex gap-6 text-xs text-muted-foreground"><a href="https://zenn.dev/soichiyo" target="_blank" rel="noopener noreferrer">More on Zenn ↗</a><a href="https://note.com/soichiro" target="_blank" rel="noopener noreferrer">More on note ↗</a></p>
      </section>
      <BeyondAISection />
      <section id="contact" className="ai-panel my-20 scroll-mt-8"><p className="font-data text-[10px] tracking-widest text-muted-foreground">OPEN CHANNEL</p><div className="mt-4 flex flex-wrap items-center justify-between gap-6"><div><h2 className="text-[28px] font-medium">仕事の相談はこちら</h2><p className="mt-3 text-sm text-muted-foreground">プロダクト・事業づくり、コーチングのご相談</p></div><div className="flex flex-wrap gap-3"><a href={`mailto:${profileData.email}`} className="ai-contact-link">メールを送る ↗</a><ChatButton variant="inline" /></div></div>
        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-xs text-muted-foreground">{[...profileData.socialLinks, {name:"Zenn",url:"https://zenn.dev/soichiyo"}].map(link => <li key={link.name}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.name} ↗</a></li>)}</ul>
      </section>
    </main><footer className="border-t border-border py-7 font-data text-[10px] text-muted-foreground">© {today.slice(0, 4)} {profileData.name}</footer>
  </div>;
}
