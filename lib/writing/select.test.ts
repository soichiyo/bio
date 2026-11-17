import {describe,expect,it} from "vitest";
import {writings} from "@/content/writing";
import {fallbackEntries,selectWriting} from "./select";
import {writingMonth} from "./parse";
import type {WritingEntry,WritingPlatform} from "./types";
const now = new Date("2026-11-17T04:00:00Z");
function entry(id:string,publishedAt="2026-04-23T04:00:00.000Z",platform:WritingPlatform="zenn"):WritingEntry {
  return {title:"Example",url:platform==="zenn" ? `https://zenn.dev/soichiyo/articles/${id}` : `https://note.com/soichiro/n/n${id}`,
    platform,publishedAt,displayMonth:writingMonth(publishedAt),datePrecision:"instant"};
}
describe("selectWriting",()=>{
  it("takes latest six across sources without reserving a note slot or mutating input",()=>{
    const input=[entry("note","2024-07-16T00:00:00.000Z","note"),...[1,2,3,4,5,6,7].map(n=>entry(String(n),`2026-08-${String(n).padStart(2,"0")}T00:00:00.000Z`))];
    const before=JSON.stringify(input),result=selectWriting(input,now);
    expect(result.map(e=>e.url.split("/").pop())).toEqual(["7","6","5","4","3","2"]);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("deduplicates normalized URLs and prefers RSS then newer dates then first item",()=>{
    const fallback=fallbackEntries(writings,"zenn")[0];
    const rss={...entry("b2a0ba2814acf6"),title:"RSS title"};
    const older={...rss,title:"Older",publishedAt:"2026-04-22T04:00:00.000Z"};
    const duplicate={...rss,url:rss.url+"/?ref=feed#top",title:"Duplicate"};
    expect(selectWriting([fallback,older,rss,duplicate],now)).toEqual([rss]);
  });
  it("keeps different URLs with the same title; ties use platform then URL",()=>{
    expect(selectWriting([entry("b"),entry("a","2026-04-23T04:00:00.000Z","note"),entry("a")],now).map(e=>e.url.split("/").pop())).toEqual(["a","b","na"]);
  });
  it("preserves all three fallback titles, order and month precision",()=>{
    const fallback=[...fallbackEntries(writings,"zenn"),...fallbackEntries(writings,"note")];
    expect(selectWriting(fallback,now).map(e=>[e.title,e.url,e.displayMonth])).toEqual(writings.map(e=>[e.title,e.url,e.date]));
    expect(fallback.every(e=>e.publishedAt===null && e.datePrecision==="month")).toBe(true);
    expect(selectWriting([],now)).toEqual([]);
  });
  it("places month-only fallback after known dates in that month",()=>{
    const fallback=fallbackEntries(writings,"zenn");
    expect(selectWriting([...fallback,entry("known","2026-04-01T00:00:00.000Z")],now)[0].url).toContain("known");
  });
  it("excludes future articles until their publication time without re-fetching",()=>{
    const future=entry("future","2026-11-17T05:00:00.000Z");
    expect(selectWriting([future],now)).toEqual([]);
    expect(selectWriting([future],new Date(future.publishedAt!))).toEqual([future]);
  });
  it("uses JST at the month boundary",()=>{
    expect(writingMonth("2026-10-31T14:59:59Z")).toBe("2026-10");
    expect(writingMonth("2026-10-31T15:00:00Z")).toBe("2026-11");
  });
  it("rejects invalid fallback without inventing dates",()=>{
    expect(()=>fallbackEntries([{platform:"zenn",title:"test",url:entry("x").url,date:"2026-13"}],"zenn")).toThrow();
    expect(()=>fallbackEntries(null,"zenn")).toThrow();
  });
});
