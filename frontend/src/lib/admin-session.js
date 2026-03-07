import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "samfre_admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }

  return secret;
}

export function createAdminSessionValue() {
  const payload = "admin";
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function isValidAdminSession(value) {
  if (!value) return false;

  const [payload, signature] = value.split(".");

  if (!payload || !signature) return false;
  if (payload !== "admin") return false;

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  return signature === expectedSignature;
}