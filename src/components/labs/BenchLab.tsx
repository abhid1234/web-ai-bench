import { useState, useMemo, useCallback, useEffect } from "react";
import type { Backend, ModelEntry, RunResult } from "../../lib/types";
import { MODELS } from "../../lib/catalog";
import { detectAvailableBackends, getDeviceInfo, detectWebNNDevice } from "../../lib/device";
import { runAllBackends } from "../../lib/harness";
import { getHeapMB, freeMemoryAndReload } from "../../lib/memory";
import { saveRun } from "../../lib/persistence";
import { buildSubmissionUrl } from "../../lib/github-issue";
import { BackendBadge } from "../BackendBadge";
import { RunResultCard } from "../RunResultCard";
import { formatSize } from "../../lib/format";

export function BenchLab() {
  const [selectedId, setSelectedId] = useState<string>(MODELS[0].id);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const [device, setDevice] = useState(() => getDeviceInfo());
  const availableBackends = useMemo(() => detectAvailableBackends(), []);

  useEffect(() => {
    detectWebNNDevice().then((webnnDevice) => setDevice((prev) => ({ ...prev, webnnDevice })));
  }, []);

  const [heapMB, setHeapMB] = useState<number | null>(() => getHeapMB());
  useEffect(() => {
    const id = setInterval(() => setHeapMB(getHeapMB()), 2000);
    return () => clearInterval(id);
  }, []);

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
          await saveRun(result).catch(() => {});
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
    <div className="flex flex-col gap-4">
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
        {device.webnnAvailable && device.webnnDevice && (
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">WebNN routes to</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={
                device.webnnDevice === "npu"
                  ? { backgroundColor: "var(--color-primary-container)", color: "var(--color-primary)" }
                  : { backgroundColor: "var(--color-surface-container-high)", color: "var(--color-on-surface-variant)" }
              }
            >
              {device.webnnDevice === "npu" ? "⚡ NPU" : device.webnnDevice.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Memory card */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Browser memory in use
          </div>
          <div
            className="text-2xl font-bold tabular-nums"
            style={{ color: "var(--color-on-surface)" }}
          >
            {heapMB != null ? `${Math.round(heapMB)} MB` : "n/a"}
            <span
              className="text-xs font-normal ml-2"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {heapMB != null ? "(updates every 2s)" : "(Chromium-only API)"}
            </span>
          </div>
        </div>
        <button
          onClick={freeMemoryAndReload}
          className="px-6 py-3 rounded-lg text-base font-bold tracking-wide cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md hover:shadow-lg"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            border: "none",
          }}
          title="Reloads the page to fully release WebGPU/WebNN memory. Saved runs in the matrix are kept."
        >
          🧹 Free Browser Memory
        </button>
      </div>

      {/* Picker */}
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
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
            {selectedModel.notes}
          </p>
        )}
      </div>

      {/* Results */}
      {sortedResults.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {sortedResults.map((r) => (
            <RunResultCard key={r.backend} run={r} />
          ))}
        </div>
      )}

      {/* Submit */}
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
