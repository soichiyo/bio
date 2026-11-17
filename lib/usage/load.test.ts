import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchValidatedUsage, resolveUsage } from "./load-core";
import { usageFixture } from "./__fixtures__/usage";
import { USAGE_URL } from "./tools";
import bundled from "@/content/usage-fallback.json";
import { parseUsage } from "./schema";

afterEach(() => vi.restoreAllMocks());
describe("fetchValidatedUsage", () => {
  it("fetches the fixed URL without an inner cache and validates before resolving", async () => {
    const spy = vi.fn<typeof fetch>().mockResolvedValue(Response.json(usageFixture()));
    expect(await fetchValidatedUsage(spy)).toEqual(usageFixture());
    expect(spy).toHaveBeenCalledWith(USAGE_URL, { cache: "no-store", signal: expect.any(AbortSignal), headers: expect.any(Headers) });
  });
  it.each(["http", "json", "schema", "timeout"])("rejects %s instead of caching a substitute", async kind => {
    const response = kind === "http" ? new Response("", { status: 503 }) :
      kind === "json" ? new Response("{") : Response.json({ ...usageFixture(), schemaVersion: 2 });
    const fetcher = vi.fn<typeof fetch>();
    if (kind === "timeout") fetcher.mockRejectedValue(new DOMException("private upstream detail", "TimeoutError"));
    else fetcher.mockResolvedValue(response);
    await expect(fetchValidatedUsage(fetcher)).rejects.toThrow("USAGE_FETCH_FAILED");
  });
  it("sets the five-second abort deadline", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    await fetchValidatedUsage(vi.fn<typeof fetch>().mockResolvedValue(Response.json(usageFixture())));
    expect(timeout).toHaveBeenCalledWith(5000);
  });
});
describe("resolveUsage", () => {
  it("keeps valid remote data and uses fallback only outside the cache", async () => {
    const live = usageFixture();
    expect(await resolveUsage(async () => live, {})).toEqual({ data: live, origin: "remote-cache" });
    const fail = async () => { throw new Error("failure"); };
    const result = await resolveUsage(fail, live);
    expect(result).toEqual({ data: live, origin: "bundled" });
    expect(result.data?.generatedAt).toBe(live.generatedAt);
    expect(await resolveUsage(fail, {})).toEqual({ data: null, origin: "unavailable" });
  });
  it("does not mutate the bundled file", async () => {
    const fallback = usageFixture(), before = JSON.stringify(fallback);
    await resolveUsage(async () => { throw new Error(); }, fallback);
    expect(JSON.stringify(fallback)).toBe(before);
  });
});


it("bundled public data matches the upstream contract", () => {
  expect(parseUsage(bundled).generatedAt).toBe(bundled.generatedAt);
});

it("authenticates only the server request to the weekly endpoint", async () => {
  const spy=vi.fn<typeof fetch>().mockResolvedValue(Response.json(usageFixture()));
  await fetchValidatedUsage(spy,"synthetic-test-token");
  const [url,init]=spy.mock.calls[0];const headers=new Headers(init?.headers);
  expect(url).toBe("https://api.github.com/repos/soichiyo/ai-usage/contents/weekly.json");
  expect(headers.get("authorization")).toBe("Bearer synthetic-test-token");
  expect(headers.get("accept")).toBe("application/vnd.github.raw+json");
  expect(headers.get("x-github-api-version")).toBe("2022-11-28");
});
it.each(["", "   "])("omits authorization for an empty token", async token => {
  const spy=vi.fn<typeof fetch>().mockResolvedValue(Response.json(usageFixture()));
  await fetchValidatedUsage(spy,token);
  expect(new Headers(spy.mock.calls[0][1]?.headers).has("authorization")).toBe(false);
});
it.each([401,403,404])("sanitizes %i and returns a weekly fallback", async status => {
  const spy=vi.fn<typeof fetch>().mockResolvedValue(new Response("private response synthetic-test-token",{status}));
  const error=await fetchValidatedUsage(spy,"synthetic-test-token").catch(e=>e);
  expect(error.message).toBe("USAGE_FETCH_FAILED");
  expect(JSON.stringify(error,Object.getOwnPropertyNames(error))).not.toMatch(/synthetic-test-token|private response/);
  expect((await resolveUsage(()=>fetchValidatedUsage(spy,"synthetic-test-token"),bundled)).origin).toBe("bundled");
});
it("does not retain the upstream exception as a cause",async()=>{
  const spy=vi.fn<typeof fetch>().mockRejectedValue(new Error("synthetic-test-token"));
  const error=await fetchValidatedUsage(spy,"synthetic-test-token").catch(e=>e);
  expect(error.cause).toBeUndefined();expect(String(error)).toBe("Error: USAGE_FETCH_FAILED");
});
