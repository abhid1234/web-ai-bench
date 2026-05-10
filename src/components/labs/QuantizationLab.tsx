import { useState } from "react";
import { MODELS } from "../../lib/catalog";
import type { Backend, ModelEntry } from "../../lib/types";

const BACKENDS: Backend[] = ["webnn", "webgpu", "wasm"];

const BYTES_PER_PARAM: Record<string, number> = {
  fp32: 4,
  fp16: 2,
  q8: 1,
  int8: 1,
  q4: 0.5,
  q4f16: 0.6,
};

interface Precision {
  dtype: string;
  label: string;
  bytesPerParam: number;
  accuracy: string;
  support: string;
}

const PRECISION_TOUR: Precision[] = [
  {
    dtype: "fp32",
    label: "Float32",
    bytesPerParam: 4,
    accuracy: "Baseline (training-time precision).",
    support: "WebGPU, WASM. NPUs reject fp32.",
  },
  {
    dtype: "fp16",
    label: "Float16",
    bytesPerParam: 2,
    accuracy: "Imperceptible loss for most tasks; some attention math needs care.",
    support: "WebGPU (preferred). WASM has partial support.",
  },
  {
    dtype: "q8",
    label: "Int8",
    bytesPerParam: 1,
    accuracy: "Small loss on generation; usually invisible on embeddings + classification.",
    support: "All three backends. The dtype WebNN routes to NPUs.",
  },
  {
    dtype: "q4",
    label: "Int4",
    bytesPerParam: 0.5,
    accuracy: "Noticeable on generation without quant-aware training; fine for retrieval + classify.",
    support: "WebGPU (q4f16) + WASM. Some NPUs (Hexagon, ANE) accept int4.",
  },
];

function estimateParams(m: ModelEntry): number {
  const basis = m.dtypes.webgpu ?? m.dtypes.wasm ?? m.dtypes.webnn ?? "fp32";
  const bpp = BYTES_PER_PARAM[basis] ?? 4;
  return (m.sizeMB * 1024 * 1024) / bpp;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  if (mb < 1000) return `${mb.toFixed(0)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function formatParams(params: number): string {
  if (params < 1e6) return `${(params / 1e3).toFixed(0)}K`;
  if (params < 1e9) return `${(params / 1e6).toFixed(0)}M`;
  return `${(params / 1e9).toFixed(1)}B`;
}

export function QuantizationLab() {
  const [selectedId, setSelectedId] = useState(MODELS[0].id);
  const model = MODELS.find((m) => m.id === selectedId) ?? MODELS[0];
  const params = estimateParams(model);
  const fp32Bytes = params * 4;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <label
              htmlFor="quant-model-picker"
              className="block text-[10px] uppercase tracking-wider font-semibold mb-1.5"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Pick a model
            </label>
            <select
              id="quant-model-picker"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: "var(--color-surface-container)",
                color: "var(--color-on-surface)",
                border: "1px solid var(--color-outline-variant)",
              }}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.task})
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-on-surface)" }}>
              ~{formatParams(params)}
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
              estimated parameters
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {PRECISION_TOUR.map((p) => {
            const sizeBytes = params * p.bytesPerParam;
            const ratio = (sizeBytes / fp32Bytes) * 100;
            return (
              <div key={p.dtype} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      {p.label}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--color-outline)" }}
                    >
                      {p.bytesPerParam} byte{p.bytesPerParam === 1 ? "" : "s"}/param
                    </span>
                  </div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: "var(--color-on-surface)" }}>
                    {formatBytes(sizeBytes)}
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-surface-container)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${ratio}%`,
                      backgroundColor: "var(--color-primary)",
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                  <span><span className="font-semibold">Accuracy:</span> {p.accuracy}</span>
                  <span><span className="font-semibold">Backends:</span> {p.support}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="rounded-lg p-3.5 flex flex-col gap-2 text-xs leading-relaxed"
          style={{
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              This catalog entry ships at
            </span>
            {BACKENDS.map((b) => {
              const dtype = model.dtypes[b];
              if (!dtype) return null;
              return (
                <span
                  key={b}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
                  style={{
                    backgroundColor: `var(--color-${b}-bg)`,
                    color: `var(--color-${b})`,
                  }}
                >
                  {b}: {dtype}
                </span>
              );
            })}
          </div>
          <p>
            Estimates assume uniform precision across all weights. Real models keep embeddings + layer-norms in
            higher precision, so on-disk sizes typically run 5–15% above the bar above. The runtime memory
            footprint is also higher: KV cache + activation buffers add 1.5–3× the weight size during inference.
          </p>
        </div>
      </div>
    </div>
  );
}
