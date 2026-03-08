import { apiRequest } from "@/lib/api/http";
import type { CreateProjectPayload, Project } from "@/types/project";

type ListProjectsResponse = { projects: Project[] };
type CreateProjectResponse = { project: Project };

type ListOptions = {
  city?: string;
  status?: string;
  type?: string;
  featured?: boolean;
  limit?: number;
};

type CreateOptions = {
  adminKey?: string;
};

export async function listProjects(options: ListOptions = {}) {
  try {
    const data = await apiRequest<ListProjectsResponse>("/api/projects", {
      query: {
        city: options.city,
        status: options.status,
        type: options.type,
        featured: options.featured,
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

export async function createProject(payload: CreateProjectPayload, options: CreateOptions = {}) {
  const data = await apiRequest<CreateProjectResponse>("/api/projects", {
    method: "POST",
    headers: options.adminKey ? { "x-admin-key": options.adminKey } : undefined,
    body: payload,
  });

  return data.project;
}
