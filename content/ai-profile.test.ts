import { projects } from "./projects";
import { workExperiences } from "./career";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { assertPublicAsset } from "@/lib/content/assets";
import { readFileSync } from "node:fs";
import { stack } from "./stack";
import { plugins } from "./plugins";
import { logos, validateEntries } from "./logos";
import { showcase, validateShowcase, visibleShowcase } from "./showcase";
import { aiProfile, coachingCredentials, profileFamily, careerHighlights } from "./ai-profile";
describe("AI profile content", () => {
  it("uses only existing public project statements for matching career companies", () => {
    expect(careerHighlights.map(item => item.company)).toEqual(["Lovegraph Inc.", "LINE Corporation"]);
    for (const highlight of careerHighlights) {
      const project = projects.find(item => item.id === highlight.projectId)!;
      expect(highlight.text).toBe(project.appDescription);
      expect(highlight.url).toBe(project.url);
      expect(workExperiences.some(work => work.companies.some(company => company.name === highlight.company))).toBe(true);
    }
  });
  it("checks every logo path and rejects active SVG content", () => {
    for (const asset of Object.values(logos)) for (const path of [asset.src, asset.darkSrc].filter((path): path is string => !!path)) {
      expect(() => assertPublicAsset(path)).not.toThrow();
      const svg = readFileSync(join(process.cwd(), "public", path), "utf8");
      expect(svg).not.toMatch(/<(script|foreignObject|image|iframe|html)\b|\son\w+\s*=|@import|(?:href\s*=\s*["'](?!#))|url\(\s*["']?(?:https?:|\/\/|data:)/i);
    }
    for (const logo of ["", "missing", "toString"]) expect(() => validateEntries([{name:"Example",logo}])).toThrow();
  });
  it("validates published tools and rejects unknown logos", () => {
    expect(() => validateEntries([...stack.flatMap(group => group.tools), ...plugins])).not.toThrow();
    expect(() => validateEntries([{name: "Example", logo: "missing"}])).toThrow();
    expect(() => validateEntries([{name: ""}])).toThrow();
  });
  it("supports an additional tool without an image", () => {
    expect(() => validateEntries([...plugins, {name: "Example"}])).not.toThrow();
  });
  it("keeps showcase hidden until a real entry is added; images are optional", () => {
    expect(visibleShowcase(showcase)).toEqual([]);
    expect(() => validateShowcase(showcase, assertPublicAsset)).not.toThrow();
    const example = {title:"Example", description:"Synthetic example", url:"https://example.com", tools:[{name:"Example"}]};
    expect(() => validateShowcase([example])).not.toThrow();
    expect(visibleShowcase([example, {...example, hidden:true}], true)).toEqual([example]);
    expect(() => validateShowcase([{...example,url:"javascript:alert(1)"}])).toThrow();
  });
  it("preserves public credential evidence and family", () => {
    expect(coachingCredentials).toHaveLength(3);
    expect(coachingCredentials.every(item => item.proof?.url.startsWith("https://"))).toBe(true);
    expect(profileFamily).toHaveLength(5);
    for (const path of [aiProfile.coachingImage, ...profileFamily.map(item => item.image), ...Object.values(logos).map(item => item.src)]) expect(existsSync(join(process.cwd(), "public", path))).toBe(true);
  });
});
