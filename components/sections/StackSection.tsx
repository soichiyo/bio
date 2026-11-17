import { selectLatest } from "@/lib/stack/latest";
import { stack, stackNotes, latestBaseline } from "@/content/stack";
import { ToolNames } from "@/components/ToolNames";
export function StackSection({ today, groups = stack }: { today: string; groups?: typeof stack }) {
  const latest = selectLatest(groups.flatMap(group => group.tools), latestBaseline, today);
  return <section className="ai-panel"><h2 className="text-[22px] font-medium">Stack</h2>
    <div className="mt-6 space-y-6">{groups.filter(group => group.tools.some(tool => !tool.hidden)).map(group => <div key={group.role}><h3 className="mb-3 font-data text-[10px] uppercase tracking-widest text-muted-foreground">{group.role}</h3><ToolNames entries={group.tools} /></div>)}</div>
    <dl className="mt-7 space-y-3 border-t border-border pt-5 text-sm"><div className="flex gap-5"><dt className="w-24 shrink-0 text-muted-foreground">Delegation</dt><dd>{stackNotes.delegation}</dd></div><div className="flex flex-wrap gap-x-5 gap-y-1"><dt className="w-24 shrink-0 text-muted-foreground">Latest</dt><dd>{latest.name}<span className="ml-2 text-xs text-muted-foreground">{latest.source === "added" ? "追加日" : "本人申告"} · {latest.date}</span></dd></div></dl>
  </section>;
}
