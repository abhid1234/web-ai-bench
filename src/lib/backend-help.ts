import type { Backend } from "./types";

export const BACKEND_LABELS: Record<Backend, string> = {
  webnn: "WebNN",
  webgpu: "WebGPU",
  wasm: "WebAssembly",
};

export const BACKEND_UNAVAILABLE_LONG: Record<Backend, string> = {
  webnn:
    "Your browser doesn't expose WebNN. Today: Chrome on Android (Pixel/Snapdragon), Chrome on Windows (Copilot+ PCs), and Edge. WebNN is what unlocks NPU acceleration.",
  webgpu:
    "Your browser doesn't expose WebGPU. Update Chrome/Safari to a recent version, or enable it in flags.",
  wasm:
    "WebAssembly is unavailable in this browser — that's unusual; try a modern browser.",
};

export const BACKEND_UNAVAILABLE_SHORT: Record<Backend, string> = {
  webnn:
    "Your browser doesn't expose WebNN — try Android Chrome, a Copilot+ PC, or Edge to see NPU-accelerated cells light up.",
  webgpu:
    "Your browser doesn't expose WebGPU — update your browser or enable it in flags.",
  wasm:
    "WebAssembly is unavailable in this browser — unusual; try a modern browser.",
};
