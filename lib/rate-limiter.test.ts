import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit } from "./rate-limiter";

describe("checkRateLimit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows 20 requests per IP per day, then blocks", () => {
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit("1.1.1.1")).toEqual({ allowed: true, remaining: 19 - i });
    }
    expect(checkRateLimit("1.1.1.1")).toEqual({ allowed: false, remaining: 0 });
  });
  it("counts each IP separately", () => {
    for (let i = 0; i < 20; i++) checkRateLimit("2.2.2.2");
    expect(checkRateLimit("3.3.3.3")).toEqual({ allowed: true, remaining: 19 });
  });
  it("resets 24 hours after the first request", () => {
    for (let i = 0; i < 21; i++) checkRateLimit("4.4.4.4");
    vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(checkRateLimit("4.4.4.4")).toEqual({ allowed: true, remaining: 19 });
  });
});
