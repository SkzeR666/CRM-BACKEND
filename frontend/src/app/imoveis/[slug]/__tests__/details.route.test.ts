import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/projects", () => ({
  getProjectBySlug: vi.fn(async (slug: string) => {
    if (slug === "nao-existe") return null;

    return {
      id: "1",
      slug,
      title: "Residencial Samfer",
      description: "Empreendimento em Taubate",
      city: "Taubate",
      cover_image: "https://example.com/capa.jpg",
    };
  }),
  listProjects: vi.fn(async () => ({ projects: [] })),
}));

describe("imoveis detail metadata", () => {
  it("returns noindex metadata when slug does not exist", async () => {
    const { generateMetadata } = await import("../page");

    const metadata = await generateMetadata({ params: { slug: "nao-existe" } });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("returns project metadata when slug exists", async () => {
    const { generateMetadata } = await import("../page");

    const metadata = await generateMetadata({ params: { slug: "residencial-samfer" } });

    expect(metadata.title).toBe("Residencial Samfer");
  });
});
