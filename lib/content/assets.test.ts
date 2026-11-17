import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { assertPublicAsset } from "./assets";
it("rejects missing files, traversal and wrong case in any path segment", () => {
  const root = mkdtempSync(join(tmpdir(), "bio-assets-"));
  try {
    mkdirSync(join(root,"assets","logos"), {recursive:true});
    writeFileSync(join(root,"assets","logos","Mark.svg"), "<svg/>");
    expect(() => assertPublicAsset("/assets/logos/Mark.svg",root)).not.toThrow();
    for (const path of ["/assets/logos/missing.svg","/assets/logos/mark.svg","/assets/Logos/Mark.svg","/assets/../Mark.svg","/assets/logos"]) {
      expect(() => assertPublicAsset(path,root)).toThrow();
    }
  } finally { rmSync(root,{recursive:true,force:true}); }
});
