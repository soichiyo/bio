import { describe, expect, it } from "vitest";
import { buildChart, collectorsAreStale, dotsFor, summarizeUsage } from "./weekly";
import { usageFixture } from "./__fixtures__/usage";
import { addDays, tokyoDate } from "./dates";
const now=new Date("2026-11-17T03:00:00Z"),today="2026-11-17";
function range(from:string,to:string) {
 const u=usageFixture();u.coverage={from,to};u.weeks=[];
 for(let week=from;week<=to;week=addDays(week,7)) u.weeks.push({week,tokens:1});
 return u;
}
describe("weekly chart",()=>{
 it.each([[0,0],[1,1],[300000000,1],[500000000,1],[500000001,2],[1100000000,3],[3923689427,8]])("rounds %i to %i dots",(tokens,dots)=>expect(dotsFor(tokens)).toBe(dots));
 it("shows 26 ascending weeks ending this Sunday",()=>{
  const c=buildChart(range("2025-09-14","2026-11-15"),today);
  expect(c.columns).toHaveLength(26);expect(c.columns[0].week).toBe("2026-05-24");
  expect(c.columns[25]).toMatchObject({week:"2026-11-15",inProgress:true});expect(c.rows).toBe(8);
 });
 it("switches at Sunday midnight JST, including a year boundary",()=>{
  const u=usageFixture();
  for(const [stamp,week] of [["2026-11-14T14:59:59Z","2026-11-08"],["2026-11-14T15:00:00Z","2026-11-15"],["2025-12-31T15:00:00Z","2025-12-28"]])
   expect(buildChart(u,tokyoDate(new Date(stamp))).columns[25].week).toBe(week);
 });
 it("keeps uncollected weeks null, measured zeros zero, and extends above eight rows",()=>{
  const u=range("2026-01-04","2026-11-01"),c=buildChart(u,today);
  expect(c.columns[25]).toEqual({week:"2026-11-15",tokens:null,dots:0,inProgress:false});
  expect(c.columns[23].tokens).toBe(1);
  const v=usageFixture();v.weeks[1].tokens=4600000000;
  expect(buildChart(v,today).rows).toBe(10);
  v.weeks[1].tokens=0;expect(buildChart(v,today).columns[24].tokens).toBe(0);
 });
});
describe("weekly summary",()=>{
 it("uses all history, not just the chart window, without mutating input",()=>{
  const u=range("2025-09-14","2026-11-15"),before=JSON.stringify(u);u.weeks[0].tokens=100;
  const s=summarizeUsage(u,today,now);
  expect(s.totalTokens).toBe(161);expect(s.peak).toEqual({week:"2025-09-14",tokens:100});
  expect(s.longestStreak).toBe(62);expect(s.currentStreak).toBe(62);
  u.weeks[0].tokens=1;expect(JSON.stringify(u)).toBe(before);
 });
 it("calculates sums, peak and consecutive weeks",()=>{
  const s=summarizeUsage(usageFixture(),today,now);
  expect(s).toMatchObject({totalTokens:12,peak:{week:"2026-11-15",tokens:7},longestStreak:1,currentStreak:1,stale:false});
  expect(s.longestRun).toEqual(usageFixture().longestRun);
 });
 it("counts back from last week when this week is zero or missing",()=>{
  const u=usageFixture();u.weeks[1].tokens=3;u.weeks[2].tokens=0;
  expect(summarizeUsage(u,today,now).currentStreak).toBe(2);
  u.weeks.pop();u.coverage.to="2026-11-08";
  expect(summarizeUsage(u,today,now).currentStreak).toBe(2);
 });
 it("returns null when the final week is too old or any collector is stale/missing",()=>{
  expect(summarizeUsage(range("2026-01-04","2026-11-01"),today,now).currentStreak).toBeNull();
  const u=usageFixture();u.collectors.pop();
  expect(summarizeUsage(u,today,now).currentStreak).toBeNull();
  const v=usageFixture();v.collectors[0].collectedAt="2026-11-15T15:00:00Z";
  expect(collectorsAreStale(v,now)).toBe(true);
  v.collectors[0].collectedAt="2026-11-15T15:00:01Z";expect(collectorsAreStale(v,now)).toBe(false);
 });
 it("shows measured zero streaks and preserves the first week of tied peaks",()=>{
  const u=usageFixture();u.weeks.forEach(r=>r.tokens=0);delete u.longestRun;
  expect(summarizeUsage(u,today,now)).toMatchObject({totalTokens:0,longestStreak:0,currentStreak:0,longestRun:null,peak:{week:"2026-11-01",tokens:0}});
 });
 it("ignores future weeks and rejects overflowing sums",()=>{
  const u=usageFixture();u.weeks.push({week:"2026-11-22",tokens:999});u.coverage.to="2026-11-22";
  expect(summarizeUsage(u,today,now).totalTokens).toBe(12);
  u.weeks[0].tokens=Number.MAX_SAFE_INTEGER;expect(()=>summarizeUsage(u,today,now)).toThrow();
 });
});
