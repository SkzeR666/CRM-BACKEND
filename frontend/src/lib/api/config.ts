export function getApiBaseUrl() {
  if (typeof window !== "undefined") return "";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  return siteUrl.replace(/\/+$/, "");
}
