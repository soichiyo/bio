import { readdirSync, readFileSync, statSync } from "node:fs";
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

// Build-time validation only; never import this module from browser components.
export function assertLogoAsset(path: string, root = join(process.cwd(), "public")) {
  assertPublicAsset(path, root);
  const bytes = readFileSync(join(root, path));
  if (path.endsWith(".svg")) {
    const svg = bytes.toString("utf8");
    if (!/<svg\b/i.test(svg) || /<(script|foreignObject|image|iframe|html)\b|\son\w+\s*=|@import|(?:href\s*=\s*["'](?!#))|url\(\s*["']?(?:https?:|\/\/|data:)/i.test(svg)) throw new Error("INVALID_LOGO_SVG");
  } else if (path.endsWith(".png")) {
    if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || bytes.toString("ascii", 12, 16) !== "IHDR") throw new Error("INVALID_LOGO_PNG");
  } else throw new Error("UNSUPPORTED_LOGO_FORMAT");
}
