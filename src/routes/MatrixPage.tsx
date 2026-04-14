import { useEffect, useMemo, useState } from "react";
import type { Backend, RunResult, Task } from "../lib/types";
import { MODELS, SEEDED_RUNS } from "../lib/catalog";
import { getAllRuns } from "../lib/persistence";
import { BackendBadge } from "../components/BackendBadge";
import { formatMs, formatSize } from "../lib/format";

const BACKENDS: Backend[] = ["webnn", "webgpu", "wasm"];
const TASKS: Task[] = ["embed", "classify", "vision-classify", "multimodal-embed", "asr", "generate"];

export function Component() {
  const [localRuns, setLocalRuns] = useState<RunResult[]>([]);
  const [taskFilter, setTaskFilter] = useState<Task | "all">("all");
  const [selected, setSelected] = useState<RunResult | null>(null);

  useEffect(() => {
    getAllRuns()
      .then(setLocalRuns)
      .catch(() => setLocalRuns([]));
  }, []);

  const allRuns = useMemo<RunResult[]>(() => [...SEEDED_RUNS, ...localRuns], [localRuns]);

  // Index latest result per (modelId, backend)
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
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
          Compatibility Matrix
        </h1>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          Every model × backend cell. Click a cell for the full run record. Mixes seeded data
          ({SEEDED_RUNS.length}) with your local runs ({localRuns.length}).
        </p>
      </div>

      {/* Task filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All tasks"
          active={taskFilter === "all"}
          onClick={() => setTaskFilter("all")}
        />
        {TASKS.map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={taskFilter === t}
            onClick={() => setTaskFilter(t)}
          />
        ))}
      </div>

      {/* Matrix table */}
      <div
        className="rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-outline-variant)" }}
      >
        <table className="w-full text-sm" style={{ minWidth: "640px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
                Model
              </th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
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
        Empty cells haven&rsquo;t been benchmarked yet. Run them on the{" "}
        <a href="/" className="underline">Bench</a> page and click &ldquo;Submit my run&rdquo; to seed the public dataset.
      </p>

      {/* Detail modal */}
      {selected && <RunDetailModal run={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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
          <button
            onClick={onClose}
            className="text-2xl"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
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
