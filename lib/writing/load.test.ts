import { afterEach, describe, expect, it, vi } from "vitest";
import { writings } from "@/content/writing";
import {fetchFeed,loadWriting,resolveFeed} from "./load-core";
import {parseFeed} from "./parse";
import {feedFixture} from "./__fixtures__/feeds";
import {WRITING_MAX_BYTES,WRITING_TIMEOUT_MS} from "./sources";
const now = new Date("2026-11-17T04:00:00Z");
const fail = async () => { throw new Error("private upstream response"); };
const cached = (platform:"zenn"|"note") => ({...parseFeed(feedFixture(platform),platform),fetchedAt:now.toISOString()});
afterEach(()=>vi.useRealTimers());
describe("RSS fetch",()=>{
  it("fetches the fixed URL and stamps only a validated successful response",async()=>{
    const fetcher=vi.fn<typeof fetch>(async()=>new Response(feedFixture()));
    const result=await fetchFeed("zenn",fetcher,()=>now);
    expect(result).toEqual(cached("zenn"));
    expect(fetcher).toHaveBeenCalledWith("https://zenn.dev/soichiyo/feed",expect.objectContaining({cache:"no-store",redirect:"error",signal:expect.any(AbortSignal)}));
  });
  it.each([new Response("secret",{status:500}),new Response("not XML"),new Response(feedFixture("note"))])("throws a fixed error for bad responses",async response=>{
    await expect(fetchFeed("zenn",async()=>response)).rejects.toThrow("WRITING_FETCH_FAILED");
  });
  it("rejects stream overflow regardless of Content-Length",async()=>{
    const body=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(WRITING_MAX_BYTES));controller.enqueue(new Uint8Array(1));controller.close();}});
    await expect(fetchFeed("zenn",async()=>new Response(body,{headers:{"content-length":"1"}}))).rejects.toThrow("WRITING_FETCH_FAILED");
  });
  it("rejects interrupted bodies",async()=>{
    const body=new ReadableStream({start(controller){controller.error(new Error("private body"));}});
    await expect(fetchFeed("zenn",async()=>new Response(body))).rejects.toThrow("WRITING_FETCH_FAILED");
  });
  it("times out before headers and while waiting for body; cancels the stream",async()=>{
    vi.useFakeTimers();
    const fetcher=vi.fn<typeof fetch>(()=>new Promise(()=>{}));
    const slowHeaders=fetchFeed("zenn",fetcher);
    const headerCheck=expect(slowHeaders).rejects.toThrow("WRITING_FETCH_FAILED");
    await vi.advanceTimersByTimeAsync(WRITING_TIMEOUT_MS);await headerCheck;
    expect(fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
    const cancel=vi.fn();
    const slowBody=fetchFeed("zenn",async()=>new Response(new ReadableStream({cancel})));
    const bodyCheck=expect(slowBody).rejects.toThrow("WRITING_FETCH_FAILED");
    await vi.advanceTimersByTimeAsync(WRITING_TIMEOUT_MS);await bodyCheck;expect(cancel).toHaveBeenCalled();
  });
});
describe("source fallback",()=>{
  it.each(["zenn","note"] as const)("isolates %s failure",async platform=>{
    const other=platform==="zenn"?"note":"zenn";
    const result=await loadWriting({[platform]:fail,[other]:async()=>cached(other)} as Parameters<typeof loadWriting>[0],writings,()=>now);
    expect(result.sources.find(s=>s.platform===platform)?.origin).toBe("bundled");
    expect(result.sources.find(s=>s.platform===other)?.origin).toBe("remote-cache");
    expect(result.sources.find(s=>s.platform===platform)?.fetchedAt).toBeNull();
  });
  it("resolves both failures without throwing or inventing fetchedAt",async()=>{
    const result=await loadWriting({zenn:fail,note:fail},writings,()=>now);
    expect(result.entries.map(e=>e.url)).toEqual(writings.map(e=>e.url));
    expect(result.sources.every(s=>s.fetchedAt===null && s.origin==="bundled")).toBe(true);
  });
  it("keeps valid empty success empty, replacing old articles without fallback",async()=>{
    const result=await resolveFeed("zenn",async()=>({entries:[],rejectedItems:0,fetchedAt:now.toISOString()}),writings);
    expect(result.origin).toBe("remote-cache");expect(result.entries).toEqual([]);
  });
  it("handles invalid or absent fallback per source",async()=>{
    const result=await resolveFeed("note",fail,[{platform:"note",title:"bad",url:"javascript:bad",date:"2026-11"}]);
    expect(result.origin).toBe("unavailable");expect(result.entries).toEqual([]);
    expect((await resolveFeed("note",fail,[])).origin).toBe("unavailable");
  });
  it("starts both sources before awaiting either",async()=>{
    let finish!: (value:ReturnType<typeof cached>)=>void;
    const zenn=vi.fn(()=>new Promise<ReturnType<typeof cached>>(resolve=>{finish=resolve;}));
    const note=vi.fn(async()=>cached("note"));
    const result=loadWriting({zenn,note},writings,()=>now);
    expect(zenn).toHaveBeenCalled();expect(note).toHaveBeenCalled();
    finish(cached("zenn"));await result;
  });
});
