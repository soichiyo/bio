import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Check every segment, even on case-insensitive local filesystems.
export function assertPublicAsset(path: string, root = join(process.cwd(), "public")) {
  if (!path.startsWith("/assets/") || path.split("/").some(part => part === ".." || part === "." || part.includes("\\"))) throw new Error("INVALID_ASSET_PATH");
  let current = root;
  for (const part of path.slice(1).split("/")) {
    if (!part || !readdirSync(current).includes(part)) throw new Error("MISSING_ASSET");
    current = join(current, part);
  }
  if (!statSync(current).isFile()) throw new Error("MISSING_ASSET");
}
