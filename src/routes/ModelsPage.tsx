import { MODELS } from "../lib/catalog";
import { formatSize } from "../lib/format";
import type { Backend } from "../lib/types";

const BACKENDS: Backend[] = ["webnn", "webgpu", "wasm"];

export function Component() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
          Model Catalog
        </h1>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          {MODELS.length} hand-curated Transformers.js models with metadata, recommended dtypes
          per backend, and the gotchas that aren&rsquo;t documented anywhere else.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MODELS.map((m) => (
          <div
            key={m.id}
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base" style={{ color: "var(--color-on-surface)" }}>
                    {m.name}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: "var(--color-primary-container)",
                      color: "var(--color-on-primary-container)",
                    }}
                  >
                    {m.task}
                  </span>
                </div>
                <a
                  href={m.hfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono hover:underline"
                  style={{ color: "var(--color-outline)" }}
                >
                  {m.id} ↗
                </a>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums" style={{ color: "var(--color-on-surface)" }}>
                  {formatSize(m.sizeMB)}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
                  on disk
                </div>
              </div>
            </div>

            {m.notes && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-on-surface-variant)" }}>
                {m.notes}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-[11px]">
              <div>
                <div
                  className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Recommended dtype
                </div>
                <div className="flex gap-1.5">
                  {BACKENDS.map((b) => (
                    <DtypeChip key={b} backend={b} dtype={m.dtypes[b]} />
                  ))}
                </div>
              </div>
              {m.freeDimensionOverrides && (
                <div>
                  <div
                    className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    freeDimensionOverrides
                  </div>
                  <div
                    className="font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--color-surface-container)",
                      color: "var(--color-on-surface-variant)",
                    }}
                  >
                    {JSON.stringify(m.freeDimensionOverrides)}
                  </div>
                </div>
              )}
              <div>
                <div
                  className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Test input
                </div>
                <div
                  className="font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--color-surface-container)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  {m.testInput.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DtypeChip({ backend, dtype }: { backend: Backend; dtype: string | undefined }) {
  if (!dtype) {
    return (
      <span
        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          color: "var(--color-outline)",
        }}
      >
        {backend}: —
      </span>
    );
  }
  return (
    <span
      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
      style={{
        backgroundColor: `var(--color-${backend}-bg)`,
        color: `var(--color-${backend})`,
      }}
    >
      {backend}: {dtype}
    </span>
  );
}
