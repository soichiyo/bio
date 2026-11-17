import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ShowcaseSection } from "./ShowcaseSection";
import { AIProfileHeader } from "@/components/AIProfileHeader";
import { showcaseEnabled, showcase, validateShowcase, type ShowcaseItem } from "@/content/showcase";
import { assertPublicAsset } from "@/lib/content/assets";
vi.mock("@/components/ui/ThemeToggle",()=>({ThemeToggle:()=>null}));
const item:ShowcaseItem={title:"Synthetic work",description:"Local fixture",url:"https://example.com/work",tools:[{name:"Example"}]};
describe("Showcase publication",()=>{
  it.each([{enabled:false,items:[item]}, {enabled:true,items:[]}, {enabled:true,items:[{...item,hidden:true}]}])("hides body and navigation together: %j",({enabled,items})=>{
    expect(renderToStaticMarkup(createElement(ShowcaseSection,{enabled,items}))).toBe("");
    expect(renderToStaticMarkup(createElement(AIProfileHeader,{showcaseEnabled:enabled,showcaseItems:items}))).not.toContain('href="#showcase"');
  });
  it("shows a valid card, tools and navigation without requiring an image",()=>{
    validateShowcase([item],assertPublicAsset);
    const html=renderToStaticMarkup(createElement(ShowcaseSection,{enabled:true,items:[item]}));
    expect(html).toContain(item.title);expect(html).toContain(item.description);
    expect(html).toContain('href="https://example.com/work"');expect(html).toContain("Example");expect(html).not.toContain("<img");
    expect(renderToStaticMarkup(createElement(AIProfileHeader,{showcaseEnabled:true,showcaseItems:[item]}))).toContain('href="#showcase"');
  });
  it("validates optional images, logos and URLs before publishing",()=>{
    for(const url of ["https://","https://user:pass@example.com","javascript:alert(1)","http://example.com"]) expect(()=>validateShowcase([{...item,url}],assertPublicAsset)).toThrow();
    for(const tools of [[],[{name:""}],[{name:"Example"},{name:"Example"}],[{name:"Example",logo:"missing"}]]) expect(()=>validateShowcase([{...item,tools}],assertPublicAsset)).toThrow();
    for(const image of ["/assets/showcase/missing.png","/assets/Profile-avatar.jpg",""]) expect(()=>validateShowcase([{...item,image}],assertPublicAsset)).toThrow();
    expect(()=>validateShowcase([{...item,image:"/assets/profile-avatar.jpg"}],assertPublicAsset)).not.toThrow();
  });
  it("keeps public content disabled and empty",()=>{
    expect(showcaseEnabled).toBe(false);expect(showcase).toEqual([]);
  });
});
