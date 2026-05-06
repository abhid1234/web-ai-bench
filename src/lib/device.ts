import type { DeviceInfo } from "./types";

interface MLContext {
  createContext: (opts?: Record<string, unknown>) => Promise<unknown>;
}

interface NavWithExtras extends Navigator {
  ml?: MLContext;
  gpu?: unknown;
  deviceMemory?: number;
}

export function getDeviceInfo(): DeviceInfo {
  const nav = navigator as NavWithExtras;
  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemoryGB: nav.deviceMemory,
    webnnAvailable: typeof nav.ml !== "undefined",
    webgpuAvailable: typeof nav.gpu !== "undefined",
  };
}

export async function detectWebNNDevice(): Promise<"npu" | "gpu" | "cpu" | "unknown"> {
  const nav = navigator as NavWithExtras;
  if (!nav.ml || typeof nav.ml.createContext !== "function") return "unknown";
  for (const deviceType of ["npu", "gpu", "cpu"] as const) {
    try {
      await nav.ml.createContext({ deviceType });
      return deviceType;
    } catch {
      // not available, try next
    }
  }
  return "unknown";
}

export function detectAvailableBackends(): Array<"webnn" | "webgpu" | "wasm"> {
  const nav = navigator as NavWithExtras;
  const backends: Array<"webnn" | "webgpu" | "wasm"> = [];
  if (typeof nav.ml !== "undefined") backends.push("webnn");
  if (typeof nav.gpu !== "undefined") backends.push("webgpu");
  backends.push("wasm");
  return backends;
}
