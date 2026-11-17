import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WritingSection } from "./WritingSection";
import { parseFeed } from "@/lib/writing/parse";
import { feedFixture } from "@/lib/writing/__fixtures__/feeds";
import type { WritingResult, WritingSourceResult } from "@/lib/writing/types";
const now = new Date("2026-11-17T04:00:00Z");
function source(overrides:Partial<WritingSourceResult>={}):WritingSourceResult {
  return {...parseFeed(feedFixture(),"zenn"),platform:"zenn",origin:"remote-cache",fetchedAt:now.toISOString(),...overrides};
}
function render(result:WritingResult) { return renderToStaticMarkup(createElement(WritingSection,{result})); }
describe("WritingSection",()=>{
  it("shows no more than six rows and renders titles as escaped text",()=>{
    const entries=Array.from({length:7},(_,i)=>({...source().entries[0],title:"<script>alert(1)</script>",url:`https://zenn.dev/soichiyo/articles/a${i}`}));
    const html=render({entries,sources:[source()]});
    expect((html.match(/<h3/g)||[])).toHaveLength(6);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('dateTime="2026-11-17T00:00:00.000Z"');
    expect(html).toContain('href="https://zenn.dev/soichiyo"');
    expect(html).toContain('href="https://note.com/soichiro"');
  });
  it("shows fallback without fabricated publication or fetch timestamps",()=>{
    const row={...source().entries[0],publishedAt:null,datePrecision:"month" as const,displayMonth:"2026-04"};
    const html=render({entries:[row],sources:[source({origin:"bundled",fetchedAt:null})]});
    expect(html).not.toContain("保存している記事を表示しています。");
    expect(html).toContain("2026-04");expect(html).not.toContain("<time");
  });
  it("keeps publication dates without fetch status or rejection notes",()=>{
    const row={...source().entries[0],publishedAt:"2024-07-16T00:00:00.000Z",displayMonth:"2024-07"};
    const html=render({entries:[row],sources:[source({fetchedAt:"2026-11-16T04:00:00Z",rejectedItems:1})]});
    expect(html).toContain("2024-07");
    for (const text of ["記事の取得状況","取得確認","読み込めなかった記事","2026-11-16"]) expect(html).not.toContain(text);
  });
  it("distinguishes empty successful feeds and unavailable sources",()=>{
    expect(render({entries:[],sources:[source({entries:[]})]})).toContain("表示できる公開記事はありません。");
    expect(render({entries:[],sources:[source({origin:"unavailable",entries:[],fetchedAt:null})]})).toContain("記事を取得できません。");
  });
  it("preserves healthy articles without partial fallback or unavailable notes",()=>{
    const sources=[source(),source({platform:"note",origin:"bundled",fetchedAt:null})];
    expect(render({entries:source().entries,sources})).not.toContain("一部の記事は保存分です。");
    sources[1].origin="unavailable";
    const html=render({entries:source().entries,sources});
    expect(html).not.toContain("一部の媒体の記事を取得できません。");
    expect(html).toContain(source().entries[0].title);
  });
});
