import { parseFeed } from "./parse";
import { fallbackEntries, selectWriting } from "./select";
import { WRITING_MAX_BYTES, WRITING_PLATFORMS, WRITING_SOURCES, WRITING_TIMEOUT_MS } from "./sources";
import type { CachedFeed, WritingPlatform, WritingResult, WritingSourceResult } from "./types";

export async function fetchFeed(
  platform: WritingPlatform,
  fetcher: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<CachedFeed> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error("WRITING_FETCH_FAILED")); }, WRITING_TIMEOUT_MS);
  });
  async function read() {
    const response = await fetcher(WRITING_SOURCES[platform].feedUrl, {
      cache: "no-store", redirect: "error", signal: controller.signal,
    });
    if (!response.ok || response.redirected || !response.body) throw new Error("WRITING_FETCH_FAILED");
    const reader = response.body.getReader();
    const cancel = () => { void reader.cancel().catch(() => {}); };
    controller.signal.addEventListener("abort", cancel, {once:true});
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > WRITING_MAX_BYTES) { cancel(); throw new Error("WRITING_FETCH_FAILED"); }
        chunks.push(value);
      }
      controller.signal.throwIfAborted();
      const xml = new TextDecoder("utf-8", {fatal:true}).decode(Buffer.concat(chunks));
      return {...parseFeed(xml,platform),fetchedAt:now().toISOString()};
    } finally {
      controller.signal.removeEventListener("abort",cancel);
      reader.releaseLock();
    }
  }
  try { return await Promise.race([read(),deadline]); }
  catch { throw new Error("WRITING_FETCH_FAILED"); }
  finally { clearTimeout(timer); }
}

export async function resolveFeed(
  platform: WritingPlatform,
  readCached: () => Promise<CachedFeed>,
  fallback: unknown,
): Promise<WritingSourceResult> {
  try {
    const cached = await readCached();
    return {...cached,platform,origin:"remote-cache"};
  } catch {
    try {
      const entries = fallbackEntries(fallback,platform);
      if (!entries.length) throw new Error("WRITING_NO_FALLBACK");
      return {entries,rejectedItems:0,platform,origin:"bundled",fetchedAt:null};
    } catch { return {entries:[],rejectedItems:0,platform,origin:"unavailable",fetchedAt:null}; }
  }
}
export async function loadWriting(
  readers: Record<WritingPlatform, () => Promise<CachedFeed>>,
  fallback: unknown,
  now: () => Date = () => new Date(),
): Promise<WritingResult> {
  const sources = await Promise.all(WRITING_PLATFORMS.map(platform => resolveFeed(platform,readers[platform],fallback)));
  return {entries:selectWriting(sources.flatMap(source=>source.entries),now()),sources};
}
