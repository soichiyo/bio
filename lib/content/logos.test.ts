import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { assertLogoAsset } from "./assets";
import { validateLogoNames, validateEntries } from "@/content/logos";
const roots: string[]=[];
afterEach(()=>{for(const root of roots.splice(0)) rmSync(root,{recursive:true,force:true});});
function fixture(name:string,body:string|Buffer) {
  const root=mkdtempSync(join(tmpdir(),"bio-logo-test-"));roots.push(root);
  mkdirSync(join(root,"assets","logos"),{recursive:true});
  writeFileSync(join(root,"assets","logos",name),body);
  return root;
}
describe("logo registration",()=>{
  it("validates names used only by Writing or Contact and allows omitted mappings",()=>{
    expect(()=>validateLogoNames({})).not.toThrow();
    expect(()=>validateLogoNames({Zenn:"github"})).not.toThrow();
    for(const name of ["Zenn","LinkedIn"]) for(const key of ["","missing-logo","toString","constructor","__proto__"]) {
      expect(()=>validateLogoNames({[name]:key})).toThrow();
    }
    expect(()=>validateEntries([{name:"Unregistered product"}])).not.toThrow();
  });
  it("requires exact path casing, theme file presence and an allowed format",()=>{
    const root=fixture("brand.svg",'<svg xmlns="http://www.w3.org/2000/svg"/>');
    expect(()=>assertLogoAsset("/assets/logos/brand.svg",root)).not.toThrow();
    for(const path of ["/assets/logos/dark.svg","/assets/logos/Brand.svg","/assets/Logos/brand.svg","/assets/../logos/brand.svg"]) expect(()=>assertLogoAsset(path,root)).toThrow();
    const html=fixture("page.html","<html/>");
    expect(()=>assertLogoAsset("/assets/logos/page.html",html)).toThrow();
  });
  it("rejects HTML and active content disguised as SVG",()=>{
    for(const body of ['<html/>','<svg><script/></svg>','<svg onload="x"/>','<svg><image href="https://example.com/x"/></svg>']) {
      const root=fixture("brand.svg",body);
      expect(()=>assertLogoAsset("/assets/logos/brand.svg",root)).toThrow();
    }
  });
  it("checks PNG bytes without applying SVG text rules",()=>{
    const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=","base64");
    expect(()=>assertLogoAsset("/assets/logos/brand.png",fixture("brand.png",png))).not.toThrow();
    expect(()=>assertLogoAsset("/assets/logos/brand.png",fixture("brand.png","<html/>"))).toThrow();
  });
});
