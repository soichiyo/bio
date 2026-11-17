import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const {load, writingLoad} = vi.hoisted(() => ({load: vi.fn(async () => ({data:null,origin:"unavailable"})),writingLoad:vi.fn(async()=>({entries:[],sources:[]}))}));
vi.mock("@/lib/writing/load",()=>({getWriting:writingLoad}));
vi.mock("@/lib/usage/load", () => ({ getUsage:load }));
vi.mock("@/components/pages/AIProfilePage", () => ({AIProfilePage:()=>null}));
vi.mock("@/components/pages/LegacyBioPage", () => ({LegacyBioPage:()=>null}));
beforeEach(() => {vi.stubEnv("BIO_DESIGN_VARIANT","telemetry");vi.resetModules();load.mockClear();writingLoad.mockClear();});
afterEach(()=>{vi.unstubAllEnvs();});
describe("profile entry",()=>{
  it.each([{design:"legacy"},{view:"classic"},{design:["legacy","telemetry"]},{design:"legacy",view:"telemetry"}])("does not load usage for %j",async params=>{
    const Page=(await import("./page")).default;
    const result=await Page({searchParams:Promise.resolve(params)});
    expect(result.type.name).toBe("LegacyBioPage");expect(load).not.toHaveBeenCalled();expect(writingLoad).not.toHaveBeenCalled();
  });
  it.each([{}, {design:"telemetry"}, {view:"personal-os"},{design:"telemetry",view:"legacy"}])("loads usage for %j",async params=>{
    const Page=(await import("./page")).default;
    const result=await Page({searchParams:Promise.resolve(params)});
    expect(result.type.name).toBe("AIProfilePage");expect(load).toHaveBeenCalledTimes(1);expect(writingLoad).toHaveBeenCalledTimes(1);
    expect(result.props.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("skips both loaders when the deployment defaults to legacy",async()=>{
    vi.stubEnv("BIO_DESIGN_VARIANT","legacy");vi.resetModules();
    await (await import("./page")).default({});
    expect(load).not.toHaveBeenCalled();expect(writingLoad).not.toHaveBeenCalled();
  });
  it("starts writing while usage is pending",async()=>{
    let finish!: (value:{data:null;origin:string})=>void;
    load.mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve;}));
    const Page=(await import("./page")).default;
    const result=Page({searchParams:Promise.resolve({})});
    await Promise.resolve();
    expect(writingLoad).toHaveBeenCalledTimes(1);
    finish({data:null,origin:"unavailable"});await result;
  });
});
