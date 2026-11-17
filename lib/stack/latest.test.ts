import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { selectLatest } from "./latest";
import { validateEntries } from "@/content/logos";
import { stack, latestBaseline } from "@/content/stack";
import { StackSection } from "@/components/sections/StackSection";
const today = "2026-11-20";
describe("Latest", () => {
  it("keeps the reported baseline until a dated tool is added", () => {
    expect(selectLatest(stack.flatMap(group => group.tools), latestBaseline, today)).toEqual({name:"Gemini 4.0",date:"2026-11-16",source:"reported"});
    expect(selectLatest([{name:"New",addedAt:"2026-11-17"}],latestBaseline,today)).toEqual({name:"New",date:"2026-11-17",source:"added"});
  });
  it("excludes hidden, future, undated and baseline-day entries", () => {
    const entries = [{name:"Hidden",addedAt:today,hidden:true},{name:"Future",addedAt:"2026-11-21"},{name:"Undated"},{name:"Same",addedAt:"2026-11-16"}];
    expect(selectLatest(entries,latestBaseline,today).source).toBe("reported");
  });
  it("selects the newest date with stable array order for ties", () => {
    expect(selectLatest([{name:"Old",addedAt:"2026-11-17"},{name:"First",addedAt:today},{name:"Second",addedAt:today}],latestBaseline,today).name).toBe("First");
  });
  it("rejects impossible and malformed dates in content", () => {
    for (const addedAt of ["2026-02-29","2026-13-01","2026-11-31","2026-1-01",""]) {
      expect(() => validateEntries([{name:"Bad",addedAt}])).toThrow();
      expect(() => selectLatest([{name:"Bad",addedAt}],latestBaseline,today)).toThrow();
    }
    expect(() => validateEntries([{name:"Leap",addedAt:"2024-02-29"}])).not.toThrow();
  });
  it("omits empty roles and shows Latest without date or source", () => {
    const html=renderToStaticMarkup(createElement(StackSection,{today,groups:[{role:"Hidden role",tools:[{name:"Hidden",hidden:true}]},{role:"Visible role",tools:[{name:"New",addedAt:today}]}]}));
    expect(html).not.toContain("Hidden role");
    expect(html).toContain("Visible role");
    expect(html).toContain("New");
    expect(html).not.toContain("追加日");
    expect(html).not.toContain("本人申告");
    expect(html).not.toContain(today);
  });
});
