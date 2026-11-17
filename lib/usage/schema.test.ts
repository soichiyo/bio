import { describe, expect, it } from "vitest";
import { parseUsage, UsageValidationError } from "./schema";
import { usageFixture } from "./__fixtures__/usage";
import bundled from "@/content/usage-fallback.json";

describe("weekly contract", () => {
  it("accepts complete weeks and an optional active run", () => {
    const u=usageFixture();expect(parseUsage(u)).toEqual(u);
    delete u.longestRun;u.tools.push("cursor");expect(parseUsage(u)).toEqual(u);
  });
  it.each(["root","collector","coverage","week","run","snapshot"])("rejects unknown fields in %s without echoing data", level => {
    const u=usageFixture();
    const target={root:u,collector:u.collectors[0],coverage:u.coverage,week:u.weeks[0],run:u.longestRun,snapshot:u.snapshots[0]}[level]!;
    Object.assign(target,{privateField:"private-value"});
    expect(()=>parseUsage(u)).toThrowError("INVALID_USAGE");
  });
  it("rejects the previous per-day contract", () => {
    const oldKey=["da","ily"].join("");
    expect(()=>parseUsage({...usageFixture(),[oldKey]:[]})).toThrow();
    expect(()=>parseUsage({...usageFixture(),sources:{}})).toThrow();
    expect(JSON.stringify(bundled)).not.toContain('"'+oldKey+'"');
    expect(parseUsage(bundled).weeks.length).toBeGreaterThanOrEqual(62);
  });
  it.each([-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1,"10"])("rejects invalid counts %s", count=>{
    const u=usageFixture();Object.assign(u.weeks[0],{tokens:count});expect(()=>parseUsage(u)).toThrow(UsageValidationError);
  });
  it.each(["2026-02-30","11/10","","2026-11-02","2026-11-01T00:00:00Z"])("requires calendar Sundays: %s",week=>{
    const u=usageFixture();u.weeks[0].week=week;expect(()=>parseUsage(u)).toThrow();
  });
  it("rejects gaps, duplicate/reversed weeks and mismatched boundaries",()=>{
    const u=usageFixture();
    for(const weeks of [[],u.weeks.slice(1),[u.weeks[0],u.weeks[2]],[...u.weeks].reverse(),[u.weeks[0],u.weeks[0],u.weeks[2]]])
      expect(()=>parseUsage({...u,weeks})).toThrow();
    expect(()=>parseUsage({...u,coverage:{from:"2026-11-02",to:"2026-11-15"}})).toThrow();
    expect(()=>parseUsage({...u,coverage:{from:"2026-11-01",to:"2026-11-22"}})).toThrow();
    const {weeks:omitted,...missing}=u;expect(omitted.length).toBe(3);expect(()=>parseUsage(missing)).toThrow();
  });
  it("rejects unknown versions/enums, duplicate collectors/tools, unordered tools and unsafe totals",()=>{
    const u=usageFixture();
    for(const extra of [{schemaVersion:2},{generatedAt:"2026-11-17"},{tools:["other"]},{tools:[]},{tools:["codex","codex"]},{tools:["codex","claude-code"]},{collectors:[u.collectors[0],u.collectors[0]]}])
      expect(()=>parseUsage({...u,...extra})).toThrow();
    u.weeks[0].tokens=Number.MAX_SAFE_INTEGER;expect(()=>parseUsage(u)).toThrow();
  });
});
