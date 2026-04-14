export function Component() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
        About
      </h1>
      <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
        Methodology, architecture, IoT preview, contribution flow.
      </p>
      <div
        className="mt-6 rounded-xl p-8 text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px dashed var(--color-outline-variant)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        Content lands in Phase E.
      </div>
    </div>
  );
}
