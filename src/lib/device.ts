import type { DeviceInfo } from "./types";

interface NavWithExtras extends Navigator {
  ml?: unknown;
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

export function detectAvailableBackends(): Array<"webnn" | "webgpu" | "wasm"> {
  const nav = navigator as NavWithExtras;
  const backends: Array<"webnn" | "webgpu" | "wasm"> = [];
  if (typeof nav.ml !== "undefined") backends.push("webnn");
  if (typeof nav.gpu !== "undefined") backends.push("webgpu");
  backends.push("wasm");
  return backends;
}
