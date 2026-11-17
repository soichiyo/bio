import { parseUsage } from "./schema";
import { USAGE_URL } from "./tools";
import type { Usage, UsageResult } from "./types";

export async function fetchValidatedUsage(fetcher: typeof fetch = fetch): Promise<Usage> {
  try {
    const response = await fetcher(USAGE_URL, {
      cache: "no-store",
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

