import { getApiBaseUrl } from "@/lib/api/config";

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
};

type ApiErrorIssue = {
  message?: string;
};

type ApiErrorShape = {
  message?: string;
  issues?: ApiErrorIssue[];
};

type ApiResponseShape = {
  error?: string | ApiErrorShape;
};

function withQuery(path: string, query?: QueryParams) {
  if (!query) return path;

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const parsed = search.toString();
  return parsed ? `${path}?${parsed}` : path;
}

function extractApiErrorMessage(data: unknown) {
  if (!data || typeof data !== "object") return "API request failed";

  const payload = data as ApiResponseShape;
  const error = payload.error;

  if (typeof error === "string" && error.trim()) return error;
  if (!error || typeof error !== "object") return "API request failed";

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  const firstIssue = Array.isArray(error.issues) ? error.issues[0] : null;
  if (firstIssue && typeof firstIssue.message === "string" && firstIssue.message.trim()) {
    return firstIssue.message;
  }

  return "API request failed";
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${withQuery(path, options.query)}`;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
    cache: "no-store",
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = extractApiErrorMessage(data);
    throw new Error(message);
  }

  return data as T;
}
