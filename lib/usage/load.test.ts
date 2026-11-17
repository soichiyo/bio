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
    expect(spy).toHaveBeenCalledWith(USAGE_URL, { cache: "no-store", signal: expect.any(AbortSignal) });
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
