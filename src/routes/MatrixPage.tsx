export function Component() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
        Compatibility Matrix
      </h1>
      <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
        Filterable grid of every (model × backend) cell. Click a cell for the full run record.
      </p>
      <div
        className="mt-6 rounded-xl p-8 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px dashed var(--color-outline-variant)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        Matrix lands in Phase D.
      </div>
    </div>
  );
}
