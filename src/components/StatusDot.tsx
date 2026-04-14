import type { Status } from "../lib/types";

const COLORS: Record<Status, string> = {
  queued: "var(--color-outline-variant)",
  running: "var(--color-warning)",
  pass: "var(--color-success)",
  fail: "var(--color-danger)",
};

export function StatusDot({ status, animate = true }: { status: Status; animate?: boolean }) {
  const isRunning = status === "running" && animate;
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${isRunning ? "animate-pulse" : ""}`}
      style={{ backgroundColor: COLORS[status] }}
    />
  );
}
