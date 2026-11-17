import { parseUsage } from "./schema";
import { USAGE_URL } from "./tools";
import type { Usage, UsageResult } from "./types";

export async function fetchValidatedUsage(fetcher: typeof fetch = fetch, token = process.env.AI_USAGE_TOKEN): Promise<Usage> {
  try {
    const headers = new Headers({ Accept: "application/vnd.github.raw+json", "X-GitHub-Api-Version": "2022-11-28" });
    if (token?.trim()) headers.set("Authorization", `Bearer ${token.trim()}`);
    const response = await fetcher(USAGE_URL, {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("USAGE_HTTP");
    return parseUsage(await response.json());
  } catch {
    // Do not retain response bodies, upstream messages or private fields in errors.
    throw new Error("USAGE_FETCH_FAILED");
  }
}

export async function resolveUsage(
  readCached: () => Promise<Usage>,
  fallback: unknown,
): Promise<UsageResult> {
  try {
    return { data: parseUsage(await readCached()), origin: "remote-cache" };
  } catch {
    try {
      return { data: parseUsage(fallback), origin: "bundled" };
    } catch {
      return { data: null, origin: "unavailable" };
    }
  }
}

