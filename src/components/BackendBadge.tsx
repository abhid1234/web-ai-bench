import type { Backend } from "../lib/types";

const COLORS: Record<Backend, { bg: string; fg: string; border: string }> = {
  webnn: { bg: "var(--color-webnn-bg)", fg: "var(--color-webnn)", border: "var(--color-webnn)" },
  webgpu: { bg: "var(--color-webgpu-bg)", fg: "var(--color-webgpu)", border: "var(--color-webgpu)" },
  wasm: { bg: "var(--color-wasm-bg)", fg: "var(--color-wasm)", border: "var(--color-wasm)" },
};

export function BackendBadge({ backend, size = "md" }: { backend: Backend; size?: "sm" | "md" }) {
  const c = COLORS[backend];
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`${padding} rounded-full font-bold uppercase tracking-wider`}
      style={{ backgroundColor: c.bg, color: c.fg, border: `1px solid ${c.border}40` }}
    >
      {backend}
    </span>
  );
}
