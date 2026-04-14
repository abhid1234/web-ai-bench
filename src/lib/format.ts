/**
 * Output-preview formatter. Different Transformers.js pipelines return
 * wildly different shapes — embeddings give a Tensor with .data, classifiers
 * give arrays of {label, score}, generators give arrays with .generated_text,
 * ASR gives {text}. This funnels them all into a short human-readable string
 * for the result card.
 */

export function formatOutput(out: unknown): string {
  if (out == null) return "(no output)";

  // Tensor with .data (embeddings)
  if (typeof out === "object" && out !== null && "data" in out) {
    const data = (out as { data: unknown }).data;
    if (data instanceof Float32Array || Array.isArray(data)) {
      const arr = Array.from(data as ArrayLike<number>).slice(0, 4);
      const dims = (data as ArrayLike<number>).length;
      return `[${arr.map((v) => v.toFixed(4)).join(", ")}, ...] (${dims} dims)`;
    }
  }

  // ASR: {text: "..."}
  if (typeof out === "object" && out !== null && "text" in out) {
    const text = String((out as { text: unknown }).text).slice(0, 80);
    return `"${text}"`;
  }

  // Array results (classification, generation)
  if (Array.isArray(out) && out.length > 0) {
    const first = out[0] as Record<string, unknown>;
    if ("label" in first && "score" in first) {
      const top = out
        .slice(0, 2)
        .map((x) => {
          const item = x as { label: string; score: number };
          return `${item.label} (${(item.score * 100).toFixed(1)}%)`;
        })
        .join(", ");
      return top;
    }
    if ("generated_text" in first) {
      return `"${String(first.generated_text).slice(0, 80)}"`;
    }
  }

  // Fallback
  try {
    return JSON.stringify(out).slice(0, 100);
  } catch {
    return String(out).slice(0, 100);
  }
}

export function formatMs(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1) return "<1 ms";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function formatMB(mb: number | null): string {
  if (mb === null) return "—";
  if (Math.abs(mb) < 0.1) return "0 MB";
  return `${mb >= 0 ? "+" : ""}${mb.toFixed(1)} MB`;
}

export function formatSize(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  return `${mb.toFixed(0)} MB`;
}
