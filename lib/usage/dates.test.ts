import { expect, it } from "vitest";
import { tokyoDate, addDays, sundayOf } from "./dates";
it("uses JST independently of the host timezone", () => {
  expect(tokyoDate(new Date("2026-11-16T14:59:59Z"))).toBe("2026-11-16");
  expect(tokyoDate(new Date("2026-11-16T15:00:00Z"))).toBe("2026-11-17");
});
it("walks calendar dates across years and leap days", () => {
  expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
  expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  expect(sundayOf("2026-11-17")).toBe("2026-11-15");
});

