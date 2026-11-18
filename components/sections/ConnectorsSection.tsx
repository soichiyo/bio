import { connectors } from "@/content/connectors";
import { skillTools, skillCounts } from "@/content/skill-tools";
import { ToolNames } from "@/components/ToolNames";
import { formatCount } from "@/lib/usage/format";

export function ConnectorsSection() {
  return <section className="ai-panel">
    <h2 className="text-[22px] font-medium">Connectors</h2>
    <div className="mt-4"><ToolNames tiles entries={connectors} /></div>
    <div className="mt-6 border-t border-border pt-5">
      <h2 className="text-[22px] font-medium">Skills</h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {skillTools.map(name => <li key={name}>{name}</li>)}
      </ul>
    </div>
    <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-5">
      {[{ label: "Skills tried", value: skillCounts.tried }, { label: "Custom skills", value: skillCounts.custom }].map(item => <div key={item.label} className="flex flex-col">
        <dt className="order-2 mt-2 font-data text-[10px] uppercase text-muted-foreground">{item.label}</dt>
        <dd className="order-1 font-data text-[22px] leading-none">{formatCount(item.value)}</dd>
      </div>)}
    </dl>
  </section>;
}
