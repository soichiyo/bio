import { LogoTile } from "@/components/ui/LogoTile";
import { logoByName } from "@/content/logos";
import type { UsageResult } from "@/lib/usage/types";
import { summarizeUsage } from "@/lib/usage/weekly";
import { AIProfileHeader } from "@/components/AIProfileHeader";
import { AIHero } from "@/components/sections/AIHero";
import { StatStrip } from "@/components/sections/StatStrip";
import { UsageStatus } from "@/components/usage/UsageStatus";
import { UsageWeekly } from "@/components/sections/UsageWeekly";
import { StackSection } from "@/components/sections/StackSection";
import { PluginsSection } from "@/components/sections/PluginsSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { BeyondAISection } from "@/components/sections/BeyondAISection";
import { ChatButton } from "@/components/ui/ChatButton";
import { profileData } from "@/content/profile";
import type { WritingResult } from "@/lib/writing/types";
import { WritingSection } from "@/components/sections/WritingSection";
import { buildChart } from "@/lib/usage/weekly";

export function AIProfilePage({ result, writing, today, now }: { result: UsageResult; writing: WritingResult; today: string; now: Date }) {
  let summary = null;
  try {
    if (result.data) {
      summary = summarizeUsage(result.data, today, now);
      buildChart(result.data, today);
    }
  } catch { result = { data: null, origin: "unavailable" }; summary = null; }
  return <div id="top" className="ai-profile mx-auto max-w-[1144px] px-5 sm:px-8">
    <AIProfileHeader /><main><AIHero />
      <StatStrip summary={summary} />
      <div className="mb-8 mt-4"><UsageStatus result={result} /></div>
      <UsageWeekly usage={result.data} today={today} />
      <div className="mt-5 grid gap-5 md:grid-cols-2"><StackSection today={today} /><PluginsSection snapshots={result.data?.snapshots ?? []} /></div>
      <div className="mt-20"><ShowcaseSection /></div>
      <WritingSection result={writing} />
      <BeyondAISection />
      <section id="contact" className="ai-panel my-20 scroll-mt-8"><p className="font-data text-[10px] tracking-widest text-muted-foreground">OPEN CHANNEL</p><div className="mt-4 flex flex-wrap items-center justify-between gap-6"><div><h2 className="text-[28px] font-medium">仕事の相談はこちら</h2><p className="mt-3 text-sm text-muted-foreground">プロダクト・事業づくり、コーチングのご相談</p></div><div className="flex flex-wrap gap-3"><a href={`mailto:${profileData.email}`} className="ai-contact-link">メールを送る ↗</a><ChatButton variant="inline" label="そちゃんAIと話す" /></div></div>
        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-xs text-muted-foreground">{[...profileData.socialLinks, {name:"Zenn",url:"https://zenn.dev/soichiyo"}].map(link => <li key={link.name}><a href={link.url} target="_blank" rel="noopener noreferrer"><LogoTile name={link.name} logo={logoByName[link.name]} /> ↗</a></li>)}</ul>
      </section>
    </main><footer className="border-t border-border py-7 font-data text-[10px] text-muted-foreground">© {today.slice(0, 4)} {profileData.name}</footer>
  </div>;
}
