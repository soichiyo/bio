// lib/rate-limiter.ts

const DAILY_LIMIT_PER_IP = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Best-effort in-memory store. Resets on serverless cold start.
const ipMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: DAILY_LIMIT_PER_IP - 1 };
  }

  if (entry.count >= DAILY_LIMIT_PER_IP) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: DAILY_LIMIT_PER_IP - entry.count };
}
