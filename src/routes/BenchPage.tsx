import { useState, useMemo, useCallback } from "react";
import type { Backend, ModelEntry, RunResult } from "../lib/types";
import { MODELS } from "../lib/catalog";
import { detectAvailableBackends, getDeviceInfo } from "../lib/device";
import { runAllBackends } from "../lib/harness";
import { saveRun } from "../lib/persistence";
import { buildSubmissionUrl } from "../lib/github-issue";
import { BackendBadge } from "../components/BackendBadge";
import { RunResultCard } from "../components/RunResultCard";
import { formatSize } from "../lib/format";

export function Component() {
  const [selectedId, setSelectedId] = useState<string>(MODELS[0].id);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const device = useMemo(() => getDeviceInfo(), []);
  const availableBackends = useMemo(() => detectAvailableBackends(), []);
  const selectedModel = useMemo<ModelEntry>(
    () => MODELS.find((m) => m.id === selectedId) ?? MODELS[0],
    [selectedId],
  );

  const appendLog = useCallback((line: string) => {
    setEventLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  }, []);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setEventLog([]);
    appendLog(`Starting bench for ${selectedModel.name}`);
    appendLog(`Backends to test: ${availableBackends.join(" + ")}`);

    const finalResults: RunResult[] = [];
    try {
      for await (const result of runAllBackends(selectedModel, { backends: availableBackends })) {
        if (result.status === "running") {
          appendLog(`${result.backend}: starting...`);
          setResults((prev) => {
            const without = prev.filter((r) => r.backend !== result.backend);
            return [...without, result];
          });
        } else {
          appendLog(
            result.status === "pass"
              ? `${result.backend}: ✓ pass — p50 ${result.inferP50Ms}ms, cold ${result.coldLoadMs}ms`
              : `${result.backend}: ✗ fail — ${result.error?.slice(0, 60) ?? "unknown"}`,
          );
          setResults((prev) => {
            const without = prev.filter((r) => r.backend !== result.backend);
            return [...without, result];
          });
          finalResults.push(result);
          await saveRun(result).catch(() => {
            // best-effort
          });
        }
      }
      appendLog("All backends complete.");
    } catch (e) {
      appendLog(`FATAL: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(false);
    }
  }, [appendLog, availableBackends, selectedModel]);

  const submitUrl = useMemo(() => {
    const completed = results.filter((r) => r.status !== "running");
    return completed.length > 0 ? buildSubmissionUrl(completed) : null;
  }, [results]);

  const sortedResults = useMemo(
    () =>
      [...results].sort((a, b) => {
        const order: Backend[] = ["webnn", "webgpu", "wasm"];
        return order.indexOf(a.backend) - order.indexOf(b.backend);
      }),
    [results],
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
          Live Bench
        </h1>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          Pick a model. Run it across every backend your browser supports. See the side-by-side.
        </p>
      </div>

      {/* Device card */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs"
        style={{
          backgroundColor: "var(--color-surface-container)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Your browser</span>
          <span>{device.platform ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Backends</span>
          {availableBackends.map((b) => (
            <BackendBadge key={b} backend={b} size="sm" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Cores</span>
          <span>{device.hardwareConcurrency ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Reported RAM</span>
          <span>{device.deviceMemoryGB ? `${device.deviceMemoryGB} GB` : "—"}</span>
        </div>
      </div>

      {/* Model picker + Run button */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-outline-variant)" }}
      >
        <label
          className="block text-[10px] uppercase tracking-wider font-semibold mb-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Model
        </label>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={running}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "var(--color-surface-container)",
              border: "1px solid var(--color-outline-variant)",
              color: "var(--color-on-surface)",
            }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.task} — {formatSize(m.sizeMB)}
              </option>
            ))}
          </select>
          <button
            onClick={handleRun}
            disabled={running}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {running ? "Running…" : "Run All Backends"}
          </button>
        </div>
        {selectedModel.notes && (
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {selectedModel.notes}
          </p>
        )}
      </div>

      {/* Results grid */}
      {sortedResults.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {sortedResults.map((r) => (
            <RunResultCard key={r.backend} run={r} />
          ))}
        </div>
      )}

      {/* Submit button */}
      {submitUrl && !running && (
        <div className="flex justify-center">
          <a
            href={submitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg text-sm font-bold"
            style={{
              backgroundColor: "var(--color-tertiary-container)",
              color: "var(--color-tertiary)",
              border: "1px solid var(--color-tertiary)40",
            }}
          >
            Submit my run → GitHub Issue
          </a>
        </div>
      )}

      {/* Event log */}
      {eventLog.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-outline-variant)" }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Event log
          </p>
          <div
            className="text-[11px] font-mono space-y-0.5 max-h-64 overflow-y-auto"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {eventLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
