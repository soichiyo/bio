import { plugins } from "@/content/plugins";
import { ToolNames } from "@/components/ToolNames";
import type { Usage } from "@/lib/usage/types";
import { formatCount } from "@/lib/usage/format";
const labels = {skillsTried:"Skills tried",skillRuns:"Skill runs",topReasoningShare:"Top reasoning level",fastModeShare:"Fast mode"};
export function PluginsSection({ snapshots }: { snapshots: Usage["snapshots"] }) {
  return <section className="ai-panel"><h2 className="text-[22px] font-medium">Plugins</h2>
    {plugins.some(item => !item.hidden) && <div className="mt-6"><ToolNames entries={plugins} /></div>}
    {snapshots.length > 0 && <dl className="mt-7 grid grid-cols-2 gap-6 border-t border-border pt-5">{snapshots.map(snapshot => <div key={snapshot.key}>
      <dt className="font-data text-[10px] uppercase text-muted-foreground">{labels[snapshot.key]}</dt><dd className="mt-2 font-display-dot text-4xl">{snapshot.key.endsWith("Share") ? `${snapshot.value * 100}%` : formatCount(snapshot.value)}</dd>
      <dd className="mt-2 text-xs text-muted-foreground">{snapshot.asOf} · {snapshot.source === "manual" ? "本人申告" : "ChatGPT profile"}</dd>
    </div>)}</dl>}
  </section>;
}
