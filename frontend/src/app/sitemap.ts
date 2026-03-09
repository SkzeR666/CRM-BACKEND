import type { MetadataRoute } from "next";
import { listProjects } from "@/lib/api/projects";
import { toAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projectsResult = await listProjects({ limit: 500 });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/imoveis"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = projectsResult.projects
    .filter((project) => Boolean(project.slug))
    .map((project) => ({
      url: toAbsoluteUrl(`/imoveis/${project.slug}`),
      lastModified: project.updated_at ? new Date(project.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...propertyRoutes];
}
