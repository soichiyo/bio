import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const {load} = vi.hoisted(() => ({load: vi.fn(async () => ({data:null,origin:"unavailable"}))}));
vi.mock("@/lib/usage/load", () => ({ getUsage:load }));
vi.mock("@/components/pages/AIProfilePage", () => ({AIProfilePage:()=>null}));
vi.mock("@/components/pages/LegacyBioPage", () => ({LegacyBioPage:()=>null}));
beforeEach(() => {vi.stubEnv("BIO_DESIGN_VARIANT","telemetry");vi.resetModules();load.mockClear();});
afterEach(()=>{vi.unstubAllEnvs();});
describe("profile entry",()=>{
  it.each([{design:"legacy"},{view:"classic"},{design:["legacy","telemetry"]},{design:"legacy",view:"telemetry"}])("does not load usage for %j",async params=>{
    const Page=(await import("./page")).default;
    const result=await Page({searchParams:Promise.resolve(params)});
    expect(result.type.name).toBe("LegacyBioPage");expect(load).not.toHaveBeenCalled();
  });
  it.each([{}, {design:"telemetry"}, {view:"personal-os"},{design:"telemetry",view:"legacy"}])("loads usage for %j",async params=>{
    const Page=(await import("./page")).default;
    const result=await Page({searchParams:Promise.resolve(params)});
    expect(result.type.name).toBe("AIProfilePage");expect(load).toHaveBeenCalledTimes(1);
    expect(result.props.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
