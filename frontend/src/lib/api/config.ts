const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:4000";

export function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    return "";
  }

  return DEFAULT_LOCAL_API_BASE_URL;
}
