import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/components/ui/ThemeToggle",()=>({ThemeToggle:()=>null}));
afterEach(()=>{
  vi.doUnmock("@/content/showcase");
  vi.doUnmock("@/content/stack");
  vi.resetModules();
});
it("reads a valid added work through the default content module in both navigation and body",async()=>{
  vi.resetModules();
  vi.doMock("@/content/showcase",async(importOriginal)=>({
    ...await importOriginal<typeof import("@/content/showcase")>(),
    showcaseEnabled:true,
    showcase:[{title:"Synthetic work",description:"Fixture",url:"https://example.com/work",tools:[{name:"Example"}]}],
  }));
  const {ShowcaseSection}=await import("./ShowcaseSection");
  const {AIProfileHeader}=await import("@/components/AIProfileHeader");
  expect(renderToStaticMarkup(createElement(ShowcaseSection))).toContain("Synthetic work");
  expect(renderToStaticMarkup(createElement(AIProfileHeader))).toContain('href="#showcase"');
});
it("selects a newly dated tool through the default Stack module without showing its date",async()=>{
  vi.resetModules();
  vi.doMock("@/content/stack",()=>({
    stack:[{role:"Synthetic role",tools:[{name:"Synthetic new tool",addedAt:"2026-11-18"}]}],
    latestBaseline:{name:"Baseline",asOf:"2026-11-16"},
    stackNotes:{delegation:"Fixture"},
  }));
  const {StackSection}=await import("./StackSection");
  const html=renderToStaticMarkup(createElement(StackSection,{today:"2026-11-18"}));
  expect(html).toContain("<dd>Synthetic new tool</dd>");
  expect(html).not.toContain("2026-11-18");
});
