import { getApiBaseUrl } from "@/lib/api/config";

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
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
    const message =
      typeof data === "object" && data && "error" in data ? String(data.error) : "API request failed";
    throw new Error(message);
  }

  return data as T;
}
