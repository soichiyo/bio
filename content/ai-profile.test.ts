import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { stack } from "./stack";
import { plugins } from "./plugins";
import { logos, validateEntries } from "./logos";
import { showcase, validateShowcase, visibleShowcase } from "./showcase";
import { aiProfile, coachingCredentials, profileFamily } from "./ai-profile";
describe("AI profile content", () => {
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
    const example = {title:"Example", description:"Synthetic example", url:"https://example.com"};
    expect(() => validateShowcase([example])).not.toThrow();
    expect(visibleShowcase([example, {...example, hidden:true}])).toEqual([example]);
    expect(() => validateShowcase([{...example,url:"javascript:alert(1)"}])).toThrow();
  });
  it("preserves public credential evidence and family", () => {
    expect(coachingCredentials).toHaveLength(3);
    expect(coachingCredentials.every(item => item.proof?.url.startsWith("https://"))).toBe(true);
    expect(profileFamily).toHaveLength(5);
    for (const path of [aiProfile.coachingImage, ...profileFamily.map(item => item.image), ...Object.values(logos).map(item => item.src)]) expect(existsSync(join(process.cwd(), "public", path))).toBe(true);
  });
});
