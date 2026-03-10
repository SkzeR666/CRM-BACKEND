import "server-only";
import type { Project } from "@/types/project";
import {
  getProjectById as getProjectByIdFromService,
  getProjectBySlug as getProjectBySlugFromService,
  listProjects as listProjectsFromService,
} from "@/lib/services/projects.service";

type ListOptions = {
  city?: string;
  status?: string;
  type?: string;
  bedrooms?: number;
  suites?: number;
  parking_spots?: number;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  featured?: boolean;
  limit?: number;
};

export async function listPublicProjects(options: ListOptions = {}) {
  try {
    const featured = typeof options.is_featured === "boolean" ? options.is_featured : options.featured;

    const projects = await listProjectsFromService({
      city: options.city,
      status: options.status,
      type: options.type,
      bedrooms: options.bedrooms,
      suites: options.suites,
      parking_spots: options.parking_spots,
      min_price: options.min_price,
      max_price: options.max_price,
      is_featured: typeof featured === "boolean" ? String(featured) : undefined,
      limit: options.limit,
    });

    return { projects: (projects ?? []) as Project[], error: "" };
  } catch (error) {
    return {
      projects: [] as Project[],
      error: error instanceof Error ? error.message : "Falha ao carregar projetos.",
    };
  }
}

export async function getPublicProjectBySlug(slug: string) {
  try {
    return (await getProjectBySlugFromService(slug)) as Project | null;
  } catch {
    return null;
  }
}

export async function getPublicProjectById(id: string) {
  try {
    return (await getProjectByIdFromService(id)) as Project | null;
  } catch {
    return null;
  }
}
