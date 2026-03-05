import { tooManyRequests } from "@/lib/http/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

export function enforceRateLimit(params: {
  key: string;
  windowMs: number;
  maxRequests: number;
}) {
  const now = Date.now();
  const current = store.get(params.key);

  if (!current || current.resetAt <= now) {
    store.set(params.key, {
      count: 1,
      resetAt: now + params.windowMs,
    });
    return;
  }

  if (current.count >= params.maxRequests) {
    throw tooManyRequests("Rate limit exceeded.");
  }

  current.count += 1;
  store.set(params.key, current);
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();

  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  return "unknown";
}

export function resetRateLimitStoreForTests() {
  if (process.env.NODE_ENV === "test") {
    store.clear();
  }
}
