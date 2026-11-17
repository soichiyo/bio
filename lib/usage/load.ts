import "server-only";
import { unstable_cache } from "next/cache";
import fallback from "@/content/usage-fallback.json";
import { fetchValidatedUsage, resolveUsage } from "./load-core";

const readCached = unstable_cache(
  () => fetchValidatedUsage(),
  ["bio-usage-weekly-v1"],
  { revalidate: 3600, tags: ["bio-usage"] },
);

export function getUsage() {
  return resolveUsage(readCached, fallback);
}

