import type { RunResult } from "../lib/types";
import { BackendBadge } from "./BackendBadge";
import { StatusDot } from "./StatusDot";
import { formatMs, formatMB } from "../lib/format";

export function RunResultCard({ run }: { run: RunResult }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <BackendBadge backend={run.backend} />
          {run.backend === "webnn" && run.device.webnnDevice && run.device.webnnDevice !== "unknown" && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={
                run.device.webnnDevice === "npu"
                  ? { backgroundColor: "var(--color-primary-container)", color: "var(--color-primary)" }
                  : { backgroundColor: "var(--color-surface-container-high)", color: "var(--color-on-surface-variant)" }
              }
            >
              {run.device.webnnDevice === "npu" ? "⚡ NPU" : run.device.webnnDevice.toUpperCase()}
            </span>
          )}
          <StatusDot status={run.status} />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {run.status}
          </span>
        </div>
      </div>

      {run.status === "running" && (
        <div className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
          Loading model and running {5} inference passes…
        </div>
      )}

      {run.status === "pass" && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Metric label="Cold load" value={formatMs(run.coldLoadMs)} />
            <Metric label="p50 inference" value={formatMs(run.inferP50Ms)} />
            <Metric label="p95 inference" value={formatMs(run.inferP95Ms)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Metric label="Heap delta" value={formatMB(run.memoryDeltaMB)} />
            <Metric label="Runs" value={String(run.inferAllMs.length)} />
          </div>
          {run.outputPreview && (
            <div className="mt-3">
              <div
                className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Output
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
        </>
      )}

      {run.status === "fail" && run.error && (
        <div
          className="rounded-lg p-3 text-xs font-mono break-all"
          style={{
            backgroundColor: "var(--color-danger-container)",
            color: "var(--color-danger)",
            border: "1px solid var(--color-danger)40",
          }}
        >
          {run.error}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-wider font-semibold"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {label}
      </div>
      <div className="text-base font-bold tabular-nums" style={{ color: "var(--color-on-surface)" }}>
        {value}
      </div>
    </div>
  );
}
