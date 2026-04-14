/**
 * Heap snapshot helper. Uses the non-standard performance.memory API which
 * is Chromium-only. Returns null where unavailable so callers report "n/a"
 * rather than fake zeros.
 */

interface PerfWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export function getHeapMB(): number | null {
  const perf = performance as PerfWithMemory;
  if (!perf.memory) return null;
  return perf.memory.usedJSHeapSize / (1024 * 1024);
}

export function memoryDelta(beforeMB: number | null, afterMB: number | null): number | null {
  if (beforeMB === null || afterMB === null) return null;
  return afterMB - beforeMB;
}
