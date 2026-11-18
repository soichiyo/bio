// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UsageWeekly } from "./UsageWeekly";
import { StatStrip } from "./StatStrip";
import { UsageStatus } from "@/components/usage/UsageStatus";
import { usageFixture } from "@/lib/usage/__fixtures__/usage";
import { summarizeUsage } from "@/lib/usage/weekly";
const today="2026-11-17",now=new Date("2026-11-17T03:00:00Z");
function render(usage=usageFixture()) {
 const html=renderToStaticMarkup(createElement(UsageWeekly,{usage,today}));
 return {html,doc:new DOMParser().parseFromString(html,"text/html")};
}
describe("weekly usage presentation",()=>{
 it("shows 26 columns, rounded dots, a readable table and only this week's muted column",()=>{
  const u=usageFixture();u.weeks[0].tokens=3923689427;u.weeks[2].tokens=500000001;
  const {doc,html}=render(u);
  expect(doc.querySelectorAll("[data-week]")).toHaveLength(26);
  expect(doc.querySelectorAll(".weekly-token-dot")).toHaveLength(10);
  expect(doc.querySelectorAll(".weekly-in-progress")).toHaveLength(1);
  expect(doc.querySelector(".weekly-in-progress")?.getAttribute("data-week")).toBe("2026-11-15");
  expect(doc.querySelectorAll("tbody tr")).toHaveLength(26);
  expect(doc.querySelector('[role="img"]')?.getAttribute("aria-label")).toContain("3,923,689,427");
  expect(doc.querySelector('[data-week="2026-11-01"]')?.getAttribute("title")).toBe("2026-11-01の週: 3,923,689,427 tokens");
  expect(html).toContain("週別の表");expect(doc.body.textContent).toContain("● = 5億 tokens");
  expect(html).not.toContain("2026-11-17");expect(html).not.toContain("claude-code");
  expect(doc.querySelector("button")).toBeNull();
  expect(doc.querySelector("table")?.parentElement?.className).toBe("sr-only");
  expect(doc.querySelector("table")?.closest("details")).toBeNull();
  expect(html).not.toContain("（切り上げ）");
  expect(html).not.toContain("● 集計中");
 });
 it("extends a column to ten dots",()=>{
  const u=usageFixture();u.weeks[1].tokens=4600000000;
  const {doc}=render(u);
  expect(doc.querySelector('[data-week="2026-11-08"]')?.querySelectorAll(".weekly-token-dot")).toHaveLength(10);
  expect(doc.querySelector("[data-rows]")?.getAttribute("data-rows")).toBe("10");
 });
 it("distinguishes uncollected weeks from measured zero and does not mark an absent current week in progress",()=>{
  const u=usageFixture();u.weeks.pop();u.coverage.to="2026-11-08";
  const {doc}=render(u);
  expect(doc.querySelector(".weekly-in-progress")).toBeNull();
  const rows=Array.from(doc.querySelectorAll("tbody tr"));
  expect(rows.find(r=>r.textContent?.includes("2026-11-15"))?.textContent).toContain("未取得");
  expect(rows.find(r=>r.textContent?.includes("2026-11-08"))?.textContent).toBe("2026-11-0800");
 });
 it("shows just the unavailable message when no data is available",()=>{
  expect(renderToStaticMarkup(createElement(UsageWeekly,{usage:null,today}))).toBe('<p role="status" class="text-sm text-muted-foreground">利用データを取得できません。</p>');
 });
 it("shows numbers with inline units and no detail rows",()=>{
  const summary=summarizeUsage(usageFixture(),today,now);
  summary.peak={week:"2026-09-06",tokens:7};
  const html=renderToStaticMarkup(createElement(StatStrip,{summary}));
  const doc=new DOMParser().parseFromString(html,"text/html");
  for(const text of ["Peak week","13h06m"]) expect(html).toContain(text);
  expect(doc.querySelectorAll("dd.order-3")).toHaveLength(0);
  expect(doc.querySelectorAll("dd")).toHaveLength(5);
  expect(doc.querySelectorAll("dd")[2].textContent).toBe("13h06m");
  expect(doc.querySelectorAll("dd")[3].textContent).toMatch(/\d+weeks/);
  expect(html).not.toContain("Sep 2026");
  expect(html).not.toContain("Codex");
  expect(html).not.toContain("2026-09-06");
  const missing=renderToStaticMarkup(createElement(StatStrip,{summary:null}));
  expect(missing).toContain("—");expect(missing).not.toContain("更新待ち");
 });
 it("shows only the actual update date, even with bundled or stale data",()=>{
  const u=usageFixture();u.collectors[0].collectedAt="2026-10-01T00:00:00Z";
  const html=renderToStaticMarkup(createElement(UsageStatus,{result:{data:u,origin:"bundled"}}));
  const doc=new DOMParser().parseFromString(html,"text/html");
  expect(doc.body.textContent).toBe("Updated 11/17");
  expect(doc.querySelector("time")?.getAttribute("datetime")).toBe(u.generatedAt);
  expect(renderToStaticMarkup(createElement(UsageStatus,{result:{data:null,origin:"unavailable"}}))).toBe("");
 });
});
