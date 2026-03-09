import { apiRequest } from "@/lib/api/http";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "@/types/project";

type ListProjectsResponse = { projects: Project[] };
type CreateProjectResponse = { project: Project };
type GetProjectResponse = { project: Project };

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

type CreateOptions = {
  adminKey?: string;
};

type UpdateOptions = {
  adminKey?: string;
};

type DeleteOptions = {
  adminKey?: string;
};

export async function listProjects(options: ListOptions = {}) {
  try {
    const featured =
      typeof options.is_featured === "boolean" ? options.is_featured : options.featured;

    const data = await apiRequest<ListProjectsResponse>("/api/projects", {
      query: {
        city: options.city,
        status: options.status,
        type: options.type,
        bedrooms: options.bedrooms,
        suites: options.suites,
        parking_spots: options.parking_spots,
        min_price: options.min_price,
        max_price: options.max_price,
        is_featured: featured,
        limit: options.limit,
      },
    });

    return { projects: data.projects ?? [], error: "" };
  } catch (error) {
    return {
      projects: [] as Project[],
      error: error instanceof Error ? error.message : "Falha ao carregar projetos.",
    };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const data = await apiRequest<GetProjectResponse>(`/api/projects/by-slug/${slug}`);
    return data.project;
  } catch {
    return null;
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await apiRequest<GetProjectResponse>(`/api/projects/${id}`);
    return data.project;
  } catch {
    return null;
  }
}

export async function createProject(payload: CreateProjectPayload, options: CreateOptions = {}) {
  const data = await apiRequest<CreateProjectResponse>("/api/projects", {
    method: "POST",
    headers: options.adminKey ? { "x-admin-key": options.adminKey } : undefined,
    body: payload,
  });

  return data.project;
}

export async function updateProject(
  id: string,
  payload: UpdateProjectPayload,
  options: UpdateOptions = {}
) {
  const data = await apiRequest<CreateProjectResponse>(`/api/projects/${id}`, {
    method: "PATCH",
    headers: options.adminKey ? { "x-admin-key": options.adminKey } : undefined,
    body: payload,
  });

  return data.project;
}

export async function deleteProject(id: string, options: DeleteOptions = {}) {
  return apiRequest<{ ok: boolean }>(`/api/projects/${id}`, {
    method: "DELETE",
    headers: options.adminKey ? { "x-admin-key": options.adminKey } : undefined,
  });
}
