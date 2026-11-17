import { afterEach, describe, expect, it, vi } from "vitest";
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
describe("design variants", () => {
  it.each([
    [undefined, "telemetry"], ["telemetry","telemetry"], ["personal-os","telemetry"],
    ["legacy","legacy"], ["classic","legacy"], [["legacy","telemetry"],"legacy"], ["unknown","telemetry"],
  ])("resolves %j to %s", async (input, expected) => {
    vi.stubEnv("BIO_DESIGN_VARIANT", "telemetry"); vi.resetModules();
    expect((await import("./design-variant")).parseBioDesignVariant(input)).toBe(expected);
  });
  it("reads the deployment default at module load and keeps explicit variants", async () => {
    vi.stubEnv("BIO_DESIGN_VARIANT", "legacy"); vi.resetModules();
    const {parseBioDesignVariant:parse} = await import("./design-variant");
    expect(parse(undefined)).toBe("legacy"); expect(parse("unknown")).toBe("legacy");
    expect(parse("personal-os")).toBe("telemetry");
  });
});
