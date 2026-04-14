import type { Backend, ModelEntry, RunResult } from "./types";
import { loadTransformers, TRANSFORMERS_VERSION } from "./transformers-loader";
import { getHeapMB, memoryDelta } from "./memory";
import { getDeviceInfo } from "./device";
import { formatOutput } from "./format";

/**
 * Core run-all-backends async iterator.
 *
 * For each requested backend it yields:
 *   1. an initial "running" RunResult so the UI can show progress
 *   2. the final "pass" or "fail" RunResult with timings or the error
 *
 * One backend failing never aborts the others — that's the entire point.
 * The error message lives on the result so it can be rendered as the
 * "documentation that no one writes."
 */

interface RunOptions {
  backends: Backend[];
  runs?: number;
}

export async function* runAllBackends(
  model: ModelEntry,
  options: RunOptions,
): AsyncGenerator<RunResult> {
  const inferenceRuns = options.runs ?? 5;
  const transformers = await loadTransformers();
  const device = getDeviceInfo();

  for (const backend of options.backends) {
    const id = `${model.id}__${backend}__${Date.now()}`;
    const baseResult: RunResult = {
      id,
      modelId: model.id,
      backend,
      status: "running",
      coldLoadMs: null,
      inferP50Ms: null,
      inferP95Ms: null,
      inferAllMs: [],
      memoryDeltaMB: null,
      outputPreview: null,
      error: null,
      transformersVersion: TRANSFORMERS_VERSION,
      ranAt: new Date().toISOString(),
      device,
    };

    yield { ...baseResult };

    try {
      const heapBefore = getHeapMB();

      const pipelineOptions: Record<string, unknown> = {
        device: backend,
        dtype: model.dtypes[backend] ?? "fp32",
      };
      if (model.freeDimensionOverrides && backend === "webnn") {
        pipelineOptions.session_options = {
          freeDimensionOverrides: model.freeDimensionOverrides,
        };
      }

      const coldStart = performance.now();
      const pipe = await transformers.pipeline(model.pipeline, model.id, pipelineOptions);
      const coldLoadMs = Math.round(performance.now() - coldStart);

      const callArgs: unknown[] = [model.testInput.value];
      if (model.callOptions) callArgs.push(model.callOptions);

      const timings: number[] = [];
      let lastOutput: unknown = null;
      for (let i = 0; i < inferenceRuns; i++) {
        const t0 = performance.now();
        lastOutput = await (pipe as (...a: unknown[]) => Promise<unknown>)(...callArgs);
        timings.push(performance.now() - t0);
      }
      timings.sort((a, b) => a - b);
      const p50 = timings[Math.floor(timings.length / 2)];
      const p95 = timings[Math.min(timings.length - 1, Math.floor(timings.length * 0.95))];

      const heapAfter = getHeapMB();
      const memDelta = memoryDelta(heapBefore, heapAfter);

      if (pipe.dispose) {
        try {
          await pipe.dispose();
        } catch {
          // disposal is best-effort
        }
      }

      yield {
        ...baseResult,
        status: "pass",
        coldLoadMs,
        inferP50Ms: Math.round(p50),
        inferP95Ms: Math.round(p95),
        inferAllMs: timings.map((t) => Math.round(t)),
        memoryDeltaMB: memDelta,
        outputPreview: formatOutput(lastOutput),
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      yield {
        ...baseResult,
        status: "fail",
        error: message.slice(0, 500),
      };
    }
  }
}
