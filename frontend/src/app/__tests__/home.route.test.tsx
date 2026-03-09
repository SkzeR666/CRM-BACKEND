import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/projects", () => ({
  listProjects: vi.fn(async () => ({
    projects: [
      {
        id: "1",
        slug: "residencial-samfer",
        title: "Residencial Samfer",
        city: "Taubate",
        type: "Apartamento",
        suites: 1,
        parking_spots: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 250000,
      },
    ],
  })),
}));

describe("home route", () => {
  it("exports homepage metadata", async () => {
    const pageModule = await import("../page");

    expect(pageModule.metadata.title).toBeDefined();
  });

  it("renders without crashing", async () => {
    const pageModule = await import("../page");
    const element = await pageModule.default({ searchParams: { theme: "light" } });

    expect(element).toBeTruthy();
  });
});
