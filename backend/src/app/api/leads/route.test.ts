import { beforeEach, describe, expect, it, vi } from "vitest";
import { unauthorized } from "@/lib/http/errors";
import { resetRateLimitStoreForTests } from "@/lib/security/rate-limit";

const mocks = vi.hoisted(() => ({
  createLead: vi.fn(),
  listLeads: vi.fn(),
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/services/leads.service", () => ({
  createLead: mocks.createLead,
  listLeads: mocks.listLeads,
}));

vi.mock("@/lib/auth/require-admin", () => ({
  requireAdmin: mocks.requireAdmin,
}));

import { GET, POST } from "@/app/api/leads/route";

function buildPostRequest(ip = "127.0.0.1") {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({
      name: "Test User",
      phone: "11999999999",
    }),
  });
}

describe("api/leads route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitStoreForTests();
    mocks.requireAdmin.mockResolvedValue({ user: { id: "admin" } });
    mocks.createLead.mockResolvedValue({ id: "lead-1" });
    mocks.listLeads.mockResolvedValue([]);
  });

  it("creates a lead with 201", async () => {
    const res = await POST(buildPostRequest());
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(mocks.createLead).toHaveBeenCalledTimes(1);
  });

  it("returns 401 on unauthorized GET", async () => {
    mocks.requireAdmin.mockRejectedValue(unauthorized("No auth"));

    const req = new Request("http://localhost/api/leads", { method: "GET" });
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.ok).toBe(false);
  });

  it("returns 400 when limit is invalid", async () => {
    const req = new Request("http://localhost/api/leads?limit=abc", {
      method: "GET",
    });
    const res = await GET(req);

    expect(res.status).toBe(400);
    expect(mocks.listLeads).not.toHaveBeenCalled();
  });

  it("returns 429 after exceeding POST rate limit by IP", async () => {
    let lastStatus = 0;

    for (let i = 0; i < 11; i += 1) {
      const res = await POST(buildPostRequest("10.0.0.1"));
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
    expect(mocks.createLead).toHaveBeenCalledTimes(10);
  });
});
