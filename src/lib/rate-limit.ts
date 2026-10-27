/**
 * Rate Limiting Module for MolarMetric
 * 
 * Provides rate-limiting interfaces for authentication, reset-password,
 * and public submission endpoints.
 * 
 * Note on Serverless Deployments:
 * Distributed rate-limiting requires an external distributed store such as
 * Upstash Redis (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN).
 * When these environment variables are not configured, an in-process fallback
 * operates for single-instance/local testing, but distributed multi-region
 * enforcement is marked as UNCONFIGURED.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export function isDistributedRateLimitConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  isDistributed: boolean;
}

/**
 * Checks whether an identifier (e.g. IP, email hash) exceeds the maximum allowed requests in a window.
 * 
 * @param identifier Unique rate-limit key
 * @param limit Max requests per window
 * @param windowSeconds Window length in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const isDistributed = isDistributedRateLimitConfigured();

  // If Upstash Redis is configured, use its REST API
  if (isDistributed) {
    try {
      const url = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

      // Use a multi-command REST pipeline for atomic INCR and EXPIRE
      const response = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", `ratelimit:${identifier}`],
          ["EXPIRE", `ratelimit:${identifier}`, windowSeconds, "NX"],
        ]),
      });

      if (response.ok) {
        const data = await response.json();
        const currentCount = Number(data[0]?.result || 1);
        const remaining = Math.max(0, limit - currentCount);

        return {
          success: currentCount <= limit,
          limit,
          remaining,
          resetInSeconds: windowSeconds,
          isDistributed: true,
        };
      }
    } catch (err) {
      console.warn("Distributed rate-limit lookup warning, falling back to local:", err);
    }
  }

  // Fallback to in-process memory store
  const now = Date.now();
  const existing = memoryStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
      isDistributed: false,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    success: existing.count <= limit,
    limit,
    remaining,
    resetInSeconds,
    isDistributed: false,
  };
}
