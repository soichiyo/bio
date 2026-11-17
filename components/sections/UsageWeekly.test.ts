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
 it("uses week-based metrics and month-only run context",()=>{
  const summary=summarizeUsage(usageFixture(),today,now);
  const html=renderToStaticMarkup(createElement(StatStrip,{summary}));
  for(const text of ["Peak week","週 · 取得した全履歴","週 · 今週または先週まで","Codex · 2026-09"]) expect(html).toContain(text);
  expect(html).not.toContain("2026-09-06");
  expect(renderToStaticMarkup(createElement(StatStrip,{summary:{...summary,currentStreak:null}}))).toContain("更新待ち");
 });
 it("shows combined provenance without per-tool ranges or a data link",()=>{
  const u=usageFixture(),summary=summarizeUsage(u,today,now);
  const html=renderToStaticMarkup(createElement(UsageStatus,{result:{data:u,origin:"bundled"},summary,today}));
  expect(html).toContain("Claude Code・Codexの合算です");
  expect(html).toContain("今週分は途中の値です");
  expect(html).toContain("保存データを表示しています");
  expect(html).toContain("週の最大");expect(html).not.toContain("公開データを見る");
  expect(html).not.toContain("api.github.com");expect(html).not.toContain("当日分");
 });
});
