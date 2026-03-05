import { describe, expect, it } from "vitest";
import { fail } from "@/lib/http/response";
import { badRequest } from "@/lib/http/errors";

describe("http response helpers", () => {
  it("keeps client-safe message for 4xx errors", async () => {
    const res = fail(badRequest("Invalid payload"), 400);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.message).toBe("Invalid payload");
  });

  it("hides internal error details for 5xx", async () => {
    const res = fail(new Error("Database password leaked"), 500);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.message).toBe("Internal Server Error");
  });
});
