import { useEffect, useRef, useState } from "react";
import type { Backend, ModelEntry } from "../lib/types";
import { MODELS } from "../lib/catalog";
import { loadTransformers } from "../lib/transformers-loader";
import { detectAvailableBackends, detectWebNNDevice } from "../lib/device";
import { shouldSkipLiveDemo } from "../lib/memory";
import { BACKEND_UNAVAILABLE_LONG } from "../lib/backend-help";
import { formatSize } from "../lib/format";
import { BackendBadge } from "./BackendBadge";

const HERO_MODEL_ID = "Xenova/all-MiniLM-L6-v2";

type DemoState = {
  status: "loading" | "inferring" | "done" | "fail" | "unavailable";
  coldMs?: number;
  inferMs?: number;
  error?: string;
};

const ALL_BACKENDS: Backend[] = ["webnn", "webgpu", "wasm"];

// LiveDemo only offers text-input models that fit in a reasonable
// download. Vision (image-url), audio (audio-url), and LLMs > 130 MB
// stay reachable from BenchLab on Lesson 5. The hero demo is meant to
// "just work" without needing to fetch remote images/audio or wait for
// half-gigabyte downloads on a phone.
const PICKABLE_MODELS = MODELS.filter(
  (m) => m.testInput.type === "text" && m.sizeMB <= 130,
);

function friendlyError(raw: string | undefined): string {
  if (!raw) return "Failed";
  const lower = raw.toLowerCase();
  if (lower.includes("missing") && (lower.includes("execution") || lower.includes("kernel") || lower.includes("op")))
    return "Backend missing an op for this model";
  if (lower.includes("out of memory") || lower.includes("oom") || lower.includes("allocation failed"))
    return "Out of memory — pick a smaller model";
  if (lower.includes("session already started") || lower.includes("session mismatch"))
    return "Backend conflict — refresh the page";
  if (lower.includes("freedimension") || lower.includes("free dimension") || lower.includes("dynamic shape"))
    return "Model needs dimension overrides not configured for this backend";
  if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to load"))
    return "Couldn't download model weights — check connection";
  if (lower.includes("compile") || lower.includes("shader"))
    return "Backend can't compile this model on your device";
  if (lower.includes("not implemented") || lower.includes("unsupported"))
    return "Op not yet supported on this backend";
  if (raw.length > 64) return raw.slice(0, 60) + "…";
  return raw;
}

type PipelineFn = (...args: unknown[]) => Promise<unknown>;

async function runOne(
  model: ModelEntry,
  backend: Backend,
  onUpdate: (s: DemoState) => void,
): Promise<void> {
  try {
    const transformers = await loadTransformers();
    onUpdate({ status: "loading" });
    const t0 = performance.now();
    const opts: Record<string, unknown> = {
      device: backend,
      dtype: model.dtypes[backend] ?? "fp32",
    };
    if (model.freeDimensionOverrides && backend === "webnn") {
      opts.session_options = { freeDimensionOverrides: model.freeDimensionOverrides };
    }
    const pipe = (await transformers.pipeline(model.pipeline, model.id, opts)) as PipelineFn;
    const coldMs = Math.round(performance.now() - t0);
    onUpdate({ status: "inferring", coldMs });

    const callArgs: unknown[] = [model.testInput.value];
    if (model.callOptions) callArgs.push(model.callOptions);
    await pipe(...callArgs);
    const timings: number[] = [];
    for (let i = 0; i < 3; i++) {
      const t = performance.now();
      await pipe(...callArgs);
      timings.push(performance.now() - t);
    }
    timings.sort((a, b) => a - b);
    const inferMs = Math.round(timings[Math.floor(timings.length / 2)]);
    onUpdate({ status: "done", coldMs, inferMs });
  } catch (e) {
    onUpdate({ status: "fail", error: e instanceof Error ? e.message : String(e) });
  }
}

export function LiveDemo() {
  const [backends] = useState(() => detectAvailableBackends());
  const [results, setResults] = useState<Partial<Record<Backend, DemoState>>>({});
  const [npu, setNpu] = useState<"npu" | "gpu" | "cpu" | "unknown" | null>(null);
  const [autoSkipped, setAutoSkipped] = useState(() => shouldSkipLiveDemo());
  const [modelId, setModelId] = useState<string>(HERO_MODEL_ID);
  const [running, setRunning] = useState(false);
  const generationRef = useRef(0);

  const selectedModel = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

  useEffect(() => {
    if (autoSkipped) return;
    detectWebNNDevice().then(setNpu);
    const myGen = ++generationRef.current;
    const initial: Partial<Record<Backend, DemoState>> = {};
    for (const b of ALL_BACKENDS) {
      if (!backends.includes(b)) initial[b] = { status: "unavailable" };
    }
    setResults(initial);
    setRunning(true);
    // Run sequentially — ONNX Runtime Web has global state and can't
    // initialize multiple backends concurrently (causes "session mismatch"
    // and "session already started" errors).
    (async () => {
      for (const b of backends) {
        if (generationRef.current !== myGen) return;
        await runOne(selectedModel, b, (s) => {
          if (generationRef.current !== myGen) return;
          setResults((prev) => ({ ...prev, [b]: s }));
        });
      }
      if (generationRef.current === myGen) setRunning(false);
    })();
  }, [backends, autoSkipped, selectedModel]);

  if (autoSkipped) {
    return (
      <div
        className="rounded-xl p-5 md:p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div
          className="text-[10px] uppercase tracking-wider font-semibold mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Live demo · paused after memory free
        </div>
        <div
          className="text-base font-bold mb-3"
          style={{ color: "var(--color-on-surface)" }}
        >
          Click below to re-run the auto-demo (re-allocates ~50–200 MB).
        </div>
        <button
          onClick={() => setAutoSkipped(false)}
          className="px-4 py-2 rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Run live demo
        </button>
      </div>
    );
  }

  const npuDetected = npu === "npu";
  const winner = findWinner(results);

  return (
    <div
      className="rounded-xl p-5 md:p-6"
      style={{
        backgroundColor: npuDetected
          ? "var(--color-primary-container)"
          : "var(--color-surface)",
        border: `1px solid ${npuDetected ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] uppercase tracking-wider font-semibold mb-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {running ? "Live demo · running in your browser…" : "Live demo · running in your browser"}
          </div>
          <div
            className="text-lg md:text-xl font-bold"
            style={{ color: "var(--color-on-surface)" }}
          >
            {selectedModel.name} · {selectedModel.task} · {formatSize(selectedModel.sizeMB)}
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Same model. Three backends. Your device, your numbers.
          </div>
        </div>
        {npuDetected && (
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }}
          >
            ⚡ NPU detected on this device
          </span>
        )}
      </div>

      {/* Model picker */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
        <label
          htmlFor="livedemo-model"
          className="text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Try another model
        </label>
        <select
          id="livedemo-model"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={running}
          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-surface-container)",
            border: "1px solid var(--color-outline-variant)",
            color: "var(--color-on-surface)",
          }}
        >
          {PICKABLE_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.task} — {formatSize(m.sizeMB)}
            </option>
          ))}
        </select>
      </div>
      <div
        className="text-[11px] mb-3 -mt-1"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        Showing {PICKABLE_MODELS.length} text models that auto-run cleanly. For vision, audio, and big LLMs:{" "}
        <a href="/learn/run" className="underline font-semibold" style={{ color: "var(--color-primary)" }}>
          Lesson 5 → full catalog
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ALL_BACKENDS.map((b) => (
          <DemoCard
            key={b}
            backend={b}
            state={results[b]}
            highlightNPU={b === "webnn" && npuDetected}
            isWinner={winner === b}
            modelSizeMB={selectedModel.sizeMB}
          />
        ))}
      </div>

      {winner && (
        <div
          className="mt-4 text-xs"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Fastest backend on your device:{" "}
          <span className="font-bold uppercase">{winner}</span>
          {winner === "webnn" && npuDetected && " — routed through your NPU."}
        </div>
      )}
    </div>
  );
}

function findWinner(results: Partial<Record<Backend, DemoState>>): Backend | null {
  let best: { backend: Backend; ms: number } | null = null;
  for (const b of ["webnn", "webgpu", "wasm"] as Backend[]) {
    const r = results[b];
    if (r?.status === "done" && r.inferMs != null) {
      if (!best || r.inferMs < best.ms) best = { backend: b, ms: r.inferMs };
    }
  }
  return best?.backend ?? null;
}

function DemoCard({
  backend,
  state,
  highlightNPU,
  isWinner,
  modelSizeMB,
}: {
  backend: Backend;
  state?: DemoState;
  highlightNPU: boolean;
  isWinner: boolean;
  modelSizeMB: number;
}) {
  const status = state?.status ?? "loading";

  if (status === "unavailable") {
    return (
      <div
        className="rounded-lg p-4 flex flex-col"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          border: "1px dashed var(--color-outline-variant)",
          opacity: 0.85,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BackendBadge backend={backend} size="sm" />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            unavailable
          </span>
        </div>
        <div
          className="text-[10px] uppercase tracking-wider mb-1"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Not on this device
        </div>
        <div
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-outline)" }}
        >
          —
        </div>
        <div
          className="text-[11px] leading-snug"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {BACKEND_UNAVAILABLE_LONG[backend]}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-4 transition-all"
      style={{
        backgroundColor: "var(--color-surface-container)",
        border: highlightNPU
          ? "2px solid var(--color-primary)"
          : isWinner
            ? "2px solid var(--color-tertiary)"
            : "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BackendBadge backend={backend} size="sm" />
        {highlightNPU && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-primary)" }}
          >
            ⚡ NPU
          </span>
        )}
        {isWinner && !highlightNPU && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-tertiary)" }}
          >
            fastest
          </span>
        )}
      </div>
      <div
        className="text-[10px] uppercase tracking-wider mb-1"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        p50 inference
      </div>
      <div
        className="text-3xl font-bold tabular-nums min-h-[2.25rem] flex items-center"
        style={{ color: "var(--color-on-surface)" }}
      >
        {status === "fail" ? (
          "—"
        ) : state?.inferMs != null ? (
          <span>
            {state.inferMs}
            <span
              className="text-base font-semibold ml-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              ms
            </span>
          </span>
        ) : (
          <Spinner />
        )}
      </div>
      <div
        className="text-[10px] uppercase tracking-wider mt-3 mb-0.5"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        cold load
      </div>
      <div
        className="text-sm font-semibold tabular-nums"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {state?.coldMs != null ? `${state.coldMs} ms` : "…"}
      </div>
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mt-3"
        style={{
          color: status === "fail" ? "var(--color-danger)" : "var(--color-on-surface-variant)",
        }}
        title={status === "fail" ? state?.error : undefined}
      >
        {status === "loading" && `Downloading ${formatSize(modelSizeMB)}…`}
        {status === "inferring" && "Running 3 passes…"}
        {status === "done" && "✓ Done"}
        {status === "fail" && friendlyError(state?.error)}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-7 h-7 align-middle">
      <span
        className="block w-full h-full rounded-full border-[3px] animate-spin"
        style={{
          borderColor: "var(--color-outline-variant)",
          borderTopColor: "var(--color-primary)",
        }}
      />
    </span>
  );
}
