import { useEffect, useMemo, useState } from "react";
import type { Backend, RunResult, Task } from "../../lib/types";
import { MODELS, SEEDED_RUNS } from "../../lib/catalog";
import { getAllRuns, clearRuns } from "../../lib/persistence";
import { detectAvailableBackends } from "../../lib/device";
import { BACKEND_LABELS, BACKEND_UNAVAILABLE_SHORT } from "../../lib/backend-help";
import { BackendBadge } from "../BackendBadge";
import { formatMs, formatSize } from "../../lib/format";

const BACKENDS: Backend[] = ["webnn", "webgpu", "wasm"];
const TASKS: Task[] = ["embed", "classify", "vision-classify", "multimodal-embed", "asr", "generate"];

export function MatrixLab() {
  const [localRuns, setLocalRuns] = useState<RunResult[]>([]);
  const [taskFilter, setTaskFilter] = useState<Task | "all">("all");
  const [selected, setSelected] = useState<RunResult | null>(null);

  useEffect(() => {
    getAllRuns()
      .then(setLocalRuns)
      .catch(() => setLocalRuns([]));
  }, []);

  function handleClearLocalRuns() {
    clearRuns().then(() => setLocalRuns([]));
  }

  const unavailableBackends = useMemo<Backend[]>(() => {
    const available = new Set(detectAvailableBackends());
    return BACKENDS.filter((b) => !available.has(b));
  }, []);

  const allRuns = useMemo<RunResult[]>(() => [...SEEDED_RUNS, ...localRuns], [localRuns]);

  const latest = useMemo(() => {
    const map = new Map<string, RunResult>();
    for (const run of allRuns) {
      const key = `${run.modelId}__${run.backend}`;
      const existing = map.get(key);
      if (!existing || new Date(run.ranAt).getTime() > new Date(existing.ranAt).getTime()) {
        map.set(key, run);
      }
    }
    return map;
  }, [allRuns]);

  const filteredModels = useMemo(
    () => (taskFilter === "all" ? MODELS : MODELS.filter((m) => m.task === taskFilter)),
    [taskFilter],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
          {SEEDED_RUNS.length} seeded runs · {localRuns.length} local runs
        </p>
        <button
          onClick={handleClearLocalRuns}
          disabled={localRuns.length === 0}
          className="text-xs px-3 py-1 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-danger-container)",
            color: "var(--color-danger)",
            border: "1px solid var(--color-danger)40",
          }}
        >
          Clear local runs
        </button>
      </div>

      {unavailableBackends.length > 0 && (
        <div
          className="rounded-lg p-4 flex flex-col gap-2"
          style={{
            backgroundColor: "var(--color-surface-container)",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Heads up
            </span>
            {unavailableBackends.map((b) => (
              <BackendBadge key={b} backend={b} size="sm" />
            ))}
            <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface)" }}>
              not available in your browser
            </span>
          </div>
          <ul className="text-xs space-y-1 leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
            {unavailableBackends.map((b) => (
              <li key={b}>
                <span className="font-semibold">{BACKEND_LABELS[b]}:</span> {BACKEND_UNAVAILABLE_SHORT[b]}
              </li>
            ))}
          </ul>
          <div className="text-xs" style={{ color: "var(--color-outline)" }}>
            Cells in those column(s) show data submitted by other devices — they don't reflect your hardware.
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <FilterChip label="All tasks" active={taskFilter === "all"} onClick={() => setTaskFilter("all")} />
        {TASKS.map((t) => (
          <FilterChip key={t} label={t} active={taskFilter === t} onClick={() => setTaskFilter(t)} />
        ))}
      </div>

      <div
        className="rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-outline-variant)" }}
      >
        <table className="w-full text-sm" style={{ minWidth: "640px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
              <th
                className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Model
              </th>
              <th
                className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Task
              </th>
              {BACKENDS.map((b) => (
                <th key={b} className="text-center px-4 py-3">
                  <BackendBadge backend={b} size="sm" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((model) => (
              <tr key={model.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-sm" style={{ color: "var(--color-on-surface)" }}>
                    {model.name}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--color-outline)" }}>
                    {formatSize(model.sizeMB)}
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px]" style={{ color: "var(--color-on-surface-variant)" }}>
                  {model.task}
                </td>
                {BACKENDS.map((b) => {
                  const run = latest.get(`${model.id}__${b}`);
                  return (
                    <td key={b} className="px-2 py-2 text-center">
                      <MatrixCell run={run} onClick={() => run && setSelected(run)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs" style={{ color: "var(--color-outline)" }}>
        Empty cells haven't been benchmarked yet. Head to{" "}
        <a href="/learn/run" className="underline">
          Lesson 5
        </a>{" "}
        to run them and submit your results.
      </p>

      {selected && <RunDetailModal run={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={
        active
          ? {
              backgroundColor: "var(--color-primary-container)",
              color: "var(--color-on-primary-container)",
            }
          : {
              backgroundColor: "var(--color-surface)",
              color: "var(--color-on-surface-variant)",
              border: "1px solid var(--color-outline-variant)",
            }
      }
    >
      {label}
    </button>
  );
}

function MatrixCell({ run, onClick }: { run: RunResult | undefined; onClick: () => void }) {
  if (!run) {
    return (
      <div
        className="rounded-lg py-2 px-3 text-[11px]"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          color: "var(--color-outline)",
        }}
      >
        —
      </div>
    );
  }
  const isPass = run.status === "pass";
  const isNPU = run.backend === "webnn" && run.device?.webnnDevice === "npu";
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg py-2 px-2 text-[11px] font-bold tabular-nums hover:opacity-80 transition-opacity"
      style={{
        backgroundColor: isPass ? "var(--color-tertiary-container)" : "var(--color-danger-container)",
        color: isPass ? "var(--color-tertiary)" : "var(--color-danger)",
        border: `1px solid ${isPass ? "var(--color-tertiary)" : "var(--color-danger)"}40`,
      }}
    >
      {isPass ? formatMs(run.inferP50Ms) : "FAIL"}
      {isNPU && (
        <span className="ml-1 text-[9px]" title="NPU-accelerated">
          ⚡
        </span>
      )}
    </button>
  );
}

function RunDetailModal({ run, onClose }: { run: RunResult; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-6"
        style={{ backgroundColor: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BackendBadge backend={run.backend} />
            <span className="font-bold" style={{ color: "var(--color-on-surface)" }}>
              {run.modelId}
            </span>
          </div>
          <button onClick={onClose} className="text-2xl" style={{ color: "var(--color-on-surface-variant)" }}>
            ×
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs mb-4">
          <DetailRow label="Status" value={run.status} />
          <DetailRow label="Cold load" value={formatMs(run.coldLoadMs)} />
          <DetailRow label="p50 inference" value={formatMs(run.inferP50Ms)} />
          <DetailRow label="p95 inference" value={formatMs(run.inferP95Ms)} />
          <DetailRow label="TJS version" value={run.transformersVersion} />
          <DetailRow label="Ran at" value={new Date(run.ranAt).toLocaleString()} />
        </dl>

        {run.outputPreview && (
          <div className="mb-4">
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Output preview
            </div>
            <div
              className="text-xs font-mono px-3 py-2 rounded break-all"
              style={{
                backgroundColor: "var(--color-surface-container)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {run.outputPreview}
            </div>
          </div>
        )}

        {run.error && (
          <div>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--color-danger)" }}
            >
              Error
            </div>
            <div
              className="text-xs font-mono px-3 py-2 rounded break-all"
              style={{
                backgroundColor: "var(--color-danger-container)",
                color: "var(--color-danger)",
              }}
            >
              {run.error}
            </div>
          </div>
        )}

        <div
          className="text-[10px] mt-4 pt-3"
          style={{ color: "var(--color-outline)", borderTop: "1px solid var(--color-outline-variant)" }}
        >
          {run.device.userAgent}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt
        className="text-[10px] uppercase tracking-wider font-semibold"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {label}
      </dt>
      <dd className="font-bold" style={{ color: "var(--color-on-surface)" }}>
        {value}
      </dd>
    </div>
  );
}
