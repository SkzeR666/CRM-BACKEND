import { apiRequest } from "@/lib/api/http";
import type { Lead, UpdateLeadPayload } from "@/types/lead";

type ListLeadsResponse = { leads: Lead[] };
type UpdateLeadResponse = { lead: Lead };

type ListOptions = {
  q?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

type AuthOptions = {
  accessToken?: string;
};

function authHeaders(accessToken?: string) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}

export async function listLeads(options: ListOptions = {}, auth: AuthOptions = {}) {
  try {
    const data = await apiRequest<ListLeadsResponse>("/api/leads", {
      query: {
        q: options.q,
        status: options.status,
        limit: options.limit,
        offset: options.offset,
      },
      headers: authHeaders(auth.accessToken),
    });

    return { leads: data.leads ?? [], error: "" };
  } catch (error) {
    return {
      leads: [] as Lead[],
      error: error instanceof Error ? error.message : "Falha ao carregar leads.",
    };
  }
}

export async function updateLead(
  id: string,
  payload: UpdateLeadPayload,
  options: AuthOptions = {}
) {
  const data = await apiRequest<UpdateLeadResponse>(`/api/leads/${id}`, {
    method: "PATCH",
    headers: authHeaders(options.accessToken),
    body: payload,
  });

  return data.lead;
}

export async function deleteLead(id: string, options: AuthOptions = {}) {
  return apiRequest<{ ok: boolean }>(`/api/leads/${id}`, {
    method: "DELETE",
    headers: authHeaders(options.accessToken),
  });
}
