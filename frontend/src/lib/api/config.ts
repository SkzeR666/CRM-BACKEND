const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:4000";
const DEFAULT_PROD_API_BASE_URL = "https://crm-backend-green.vercel.app";

export function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    return DEFAULT_PROD_API_BASE_URL;
  }

  return DEFAULT_LOCAL_API_BASE_URL;
}
