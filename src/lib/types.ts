/**
 * Shared types for Web AI Bench.
 * RunResult is the canonical record format that flows from the harness into
 * IndexedDB, the matrix view, and (eventually) data/runs.json.
 */

export type Backend = "webnn" | "webgpu" | "wasm";

export type Task =
  | "embed"
  | "classify"
  | "vision-classify"
  | "multimodal-embed"
  | "asr"
  | "generate";

export type Status = "queued" | "running" | "pass" | "fail";

export interface ModelEntry {
  id: string;
  name: string;
  task: Task;
  pipeline: string;
  sizeMB: number;
  dtypes: Partial<Record<Backend, string>>;
  freeDimensionOverrides?: Record<string, number>;
  testInput: { type: "text" | "image-url" | "audio-url"; value: string };
  callOptions?: Record<string, unknown>;
  hfUrl: string;
  notes?: string;
}

export interface DeviceInfo {
  userAgent: string;
  platform?: string;
  hardwareConcurrency?: number;
  deviceMemoryGB?: number;
  webnnAvailable: boolean;
  webgpuAvailable: boolean;
  webnnDevice?: "npu" | "gpu" | "cpu" | "unknown";
}

export interface RunResult {
  id: string;
  modelId: string;
  backend: Backend;
  status: Status;
  coldLoadMs: number | null;
  inferP50Ms: number | null;
  inferP95Ms: number | null;
  inferAllMs: number[];
  memoryDeltaMB: number | null;
  outputPreview: string | null;
  error: string | null;
  transformersVersion: string;
  ranAt: string;
  device: DeviceInfo;
}
