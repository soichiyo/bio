import { describe, expect, it } from "vitest";
import { normalizeArticleUrl, parseFeed, parsePublishedAt } from "./parse";
import { feedFixture, itemFixture } from "./__fixtures__/feeds";
describe("parseFeed", () => {
  it.each(["zenn","note"] as const)("parses %s and keeps only public metadata", platform => {
    const result = parseFeed(feedFixture(platform), platform);
    expect(result.entries).toEqual([{title:"Example",url: platform==="zenn"?"https://zenn.dev/soichiyo/articles/example":"https://note.com/soichiro/n/n123", platform,publishedAt:"2026-11-17T00:00:00.000Z",displayMonth:"2026-11",datePrecision:"instant"}]);
    expect(JSON.stringify(result)).not.toContain("Private body");
  });
  it.each([
    ["A &amp; B &#65; &#x1F600;", "A & B A 😀"],
    ["<![CDATA[A &amp; B <b>text</b>]]>", "A &amp; B <b>text</b>"],
    ["&amp;#65;", "&#65;"], ["123","123"],
  ])("decodes %s once", (title, expected) => {
    expect(parseFeed(feedFixture("zenn",itemFixture("zenn",{title})),"zenn").entries[0].title).toBe(expected);
  });
  it("distinguishes valid empty feeds, multiple items and partial errors", () => {
    expect(parseFeed(feedFixture("zenn",""),"zenn")).toEqual({entries:[],rejectedItems:0});
    const result=parseFeed(feedFixture("zenn",itemFixture()+itemFixture()+itemFixture("zenn",{title:" "})),"zenn");
    expect(result.entries).toHaveLength(2);expect(result.rejectedItems).toBe(1);
    expect(()=>parseFeed(feedFixture("zenn",itemFixture("zenn",{title:" "})),"zenn")).toThrow("WRITING_INVALID_FEED");
  });
  it.each(["<html>login</html>","<rss>","<!DOCTYPE rss [<!ENTITY x 'bad'>]><rss/>",feedFixture().replace("soichiyo</link>","other</link>"),feedFixture().replace('version="2.0"','version="1.0"')])("rejects invalid feed structure", xml => {
    expect(()=>parseFeed(xml,"zenn")).toThrow("WRITING_INVALID_FEED");
  });
  it.each(["javascript:alert(1)","http://zenn.dev/soichiyo/articles/example","https://zenn.dev/other/articles/example","https://zenn.dev/soichiyo","https://user:pass@zenn.dev/soichiyo/articles/example","https://zenn.dev:444/soichiyo/articles/example","https://zenn.dev/soichiyo/articles/a\\b"])("rejects unsafe link %s", link => {
    expect(()=>parseFeed(feedFixture("zenn",itemFixture("zenn",{link})),"zenn")).toThrow();
  });
  it("normalizes tracking and trailing slash",()=>{
    expect(normalizeArticleUrl("https://zenn.dev/soichiyo/articles/example/?a=1#section","zenn")).toBe("https://zenn.dev/soichiyo/articles/example");
  });
  it.each(["", "not a date", "31 Feb 2026 00:00:00 GMT", "17 Nov 2026 24:00:00 GMT", "17 Nov 2026 00:00:00", "17 Nov 2026 00:00:00 +9999"])("rejects invalid dates %s",date=>{
    expect(()=>parsePublishedAt(date)).toThrow();
  });
  it("normalizes note timezone without inventing a date",()=>{
    expect(parsePublishedAt("Tue, 17 Nov 2026 09:00:00 +0900")).toBe("2026-11-17T00:00:00.000Z");
    expect(()=>parseFeed(feedFixture().replace(/<pubDate>.*?<\/pubDate>/,""),"zenn")).toThrow();
  });
});
