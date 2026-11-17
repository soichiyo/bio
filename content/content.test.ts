import { readdirSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import * as content from "@/content";

// macOS は大文字小文字を区別しないので、existsSync ではなくディレクトリの一覧と突き合わせる
function existsExactCase(publicPath: string): boolean {
  const full = join(process.cwd(), "public", publicPath);
  try {
    return readdirSync(dirname(full)).includes(basename(full));
  } catch {
    return false;
  }
}

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

describe("content", () => {
  it("exports exactly what lib/data.ts exported", () => {
    expect(Object.keys(content).sort()).toEqual([
      "certifications", "education", "expertise", "hobbies", "myFamily",
      "personalCharacteristics", "photoGallery", "profileData", "projects",
      "skills", "workExperiences", "writings",
    ]);
  });
  it("keeps every value unchanged by the move", () => {
    expect({ ...content }).toMatchSnapshot();
  });
  it("references only local assets that exist with the exact same letter case", () => {
    const assets = collectStrings(content).filter((s) => s.startsWith("/assets/"));
    expect(assets.length).toBeGreaterThan(0);
    expect(assets.filter((p) => !existsExactCase(p))).toEqual([]);
  });
  it("uses https for every external link", () => {
    const links = collectStrings(content).filter((s) => /^http/.test(s));
    expect(links.filter((u) => !u.startsWith("https://"))).toEqual([]);
  });
  it("has unique ids within projects and family", () => {
    for (const list of [content.projects, content.myFamily]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it("describes every photo instead of using placeholder alt text", () => {
    expect(content.photoGallery.filter((p) => /^Description of photo/.test(p.alt))).toEqual([]);
  });
  it("points the avatar at a .jpg file", () => {
    expect(content.profileData.avatar).toBe("/assets/profile-avatar.jpg");
  });
});
