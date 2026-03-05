import { beforeEach, describe, expect, it } from "vitest";
import {
  enforceRateLimit,
  getClientIp,
  resetRateLimitStoreForTests,
} from "@/lib/security/rate-limit";

describe("rate limit", () => {
  beforeEach(() => {
    resetRateLimitStoreForTests();
  });

  it("allows requests up to the configured limit", () => {
    expect(() =>
      enforceRateLimit({
        key: "k1",
        windowMs: 60_000,
        maxRequests: 2,
      })
    ).not.toThrow();

    expect(() =>
      enforceRateLimit({
        key: "k1",
        windowMs: 60_000,
        maxRequests: 2,
      })
    ).not.toThrow();
  });

  it("blocks requests above the configured limit", () => {
    enforceRateLimit({ key: "k2", windowMs: 60_000, maxRequests: 1 });

    expect(() =>
      enforceRateLimit({ key: "k2", windowMs: 60_000, maxRequests: 1 })
    ).toThrowError("Rate limit exceeded.");
  });

  it("extracts client IP in the expected priority", () => {
    const req = new Request("http://localhost/api/leads", {
      headers: {
        "x-forwarded-for": "1.1.1.1, 2.2.2.2",
        "x-real-ip": "3.3.3.3",
      },
    });

    expect(getClientIp(req)).toBe("1.1.1.1");
  });
});
