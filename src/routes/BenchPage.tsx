export function Component() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
        Live Bench
      </h1>
      <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
        Pick a model, run it across every backend your browser supports, see the side-by-side.
      </p>
      <div
        className="mt-6 rounded-xl p-8 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px dashed var(--color-outline-variant)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        Harness wiring lands in Phase B (next).
      </div>
    </div>
  );
}
