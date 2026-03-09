import { describe, expect, it } from "vitest";

describe("imoveis listing metadata", () => {
  it("sets noIndex when filters are present", async () => {
    const { generateMetadata } = await import("../page");

    const metadata = await generateMetadata({
      searchParams: { city: "Taubate", type: "Apartamento" },
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("keeps index when there are no filters", async () => {
    const { generateMetadata } = await import("../page");

    const metadata = await generateMetadata({
      searchParams: {},
    });

    expect(metadata.robots).toBeUndefined();
  });
});
