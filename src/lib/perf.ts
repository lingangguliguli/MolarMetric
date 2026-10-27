/**
 * Lightweight performance instrumentation utility for MolarMetric.
 * Tracks execution time of critical paths (auth context, database queries, server actions)
 * without logging any PII, credentials, tokens, or sensitive payload data.
 */

const IS_DEV = process.env.NODE_ENV !== "production";
const ENABLE_PERF_LOGS = process.env.PERF_LOGGING === "true" || IS_DEV;

export interface PerfMeasurement {
  label: string;
  durationMs: number;
  timestamp: string;
}

/**
 * Execute an async operation and measure its duration.
 * Only logs if PERF_LOGGING is enabled or duration exceeds warnThresholdMs.
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>,
  warnThresholdMs: number = 300
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    if (ENABLE_PERF_LOGS || durationMs >= warnThresholdMs) {
      const level = durationMs >= warnThresholdMs ? "warn" : "debug";
      if (level === "warn") {
        console.warn(`[PERF:SLOW] ${label} took ${durationMs}ms (threshold: ${warnThresholdMs}ms)`);
      } else {
        console.log(`[PERF] ${label} took ${durationMs}ms`);
      }
    }
  }
}

/**
 * Synchronously measure a function.
 */
export function measureSync<T>(label: string, fn: () => T, warnThresholdMs: number = 50): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    if (ENABLE_PERF_LOGS && durationMs >= warnThresholdMs) {
      console.warn(`[PERF:SLOW] ${label} took ${durationMs}ms`);
    }
  }
}
