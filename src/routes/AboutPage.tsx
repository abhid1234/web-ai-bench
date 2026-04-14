export function Component() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-on-surface)" }}>
          About Web AI Bench
        </h1>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          Why this exists, how it works, and where it&rsquo;s going.
        </p>
      </div>

      <Section title="Why this exists">
        <p>
          Developers picking a backend for in-browser ML have nothing to point at. The Transformers.js
          docs don&rsquo;t mention WebNN. The WebNN spec doesn&rsquo;t tell you which models work.
          Microsoft&rsquo;s WebNN Developer Preview ships four demos but no comparison.
        </p>
        <p className="mt-3">
          There is no public, apples-to-apples latency table for{" "}
          <span className="font-semibold">WebNN vs WebGPU vs WASM</span> running real models.
          Web AI Bench is the missing piece.
        </p>
      </Section>

      <Section title="How a benchmark run works">
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            You pick a model on the <a href="/" className="underline">Bench</a> page.
          </li>
          <li>
            The harness detects which backends your browser supports (WebNN, WebGPU, WASM) and
            queues a run for each.
          </li>
          <li>
            For each backend it loads the model fresh, runs <span className="font-mono">5</span>{" "}
            inference passes, captures p50/p95 latency, JS heap delta, and a preview of the output.
          </li>
          <li>
            If a backend fails it captures the exact error message and moves on. The grid on{" "}
            <a href="/matrix" className="underline">/matrix</a> turns those failures into the
            documentation that no one writes.
          </li>
          <li>
            Results live in your browser&rsquo;s IndexedDB. Click <em>Submit my run</em> to open a
            prefilled GitHub Issue — the maintainer merges good submissions into{" "}
            <span className="font-mono text-[11px]">data/runs.json</span>.
          </li>
        </ol>
      </Section>

      <Section title="Architecture">
        <pre
          className="text-[10px] leading-tight font-mono p-4 rounded overflow-x-auto"
          style={{
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
          }}
        >
{`         bench.ondeviceml.space (Vercel SPA)
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   [/ Bench]      [/matrix]      [/models]
   harness        merged grid    static catalog
       │               │
       └───────┬───────┘
               │
        IndexedDB cache  ◄──── data/runs.json
               │            (community submissions
        "Submit my run"      merged via PR)
               │
               ▼
        GitHub Issue API
        (no backend needed)`}
        </pre>
        <p className="mt-3 text-xs">
          Transformers.js is loaded dynamically from the jsDelivr CDN at runtime, never bundled.
          The main JS chunk stays under 300 KB; ONNX Runtime Web only reaches the visitor&rsquo;s
          machine if they actually click <em>Run</em>.
        </p>
      </Section>

      <Section title="Methodology and caveats">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Cold load only in v0.1.</strong> Warm-load reload tracking is on the v0.2 list.
            The first run after the page loads is what gets recorded.
          </li>
          <li>
            <strong>p50/p95 from 5 runs.</strong> Five passes is enough to show a meaningful gap
            between backends but light enough that visitors don&rsquo;t walk away. Larger sample
            sizes are a knob if the demand shows up.
          </li>
          <li>
            <strong>Heap delta is best-effort.</strong> Uses <span className="font-mono text-[11px]">performance.memory</span>{" "}
            which is Chromium-only and rounded by browser privacy policy. Treat it as directional,
            not authoritative.
          </li>
          <li>
            <strong>Backend preference is visitor-detected.</strong> A run on a Chromebook with
            no NPU can&rsquo;t produce a WebNN-NPU result — the matrix shows what the visitor&rsquo;s
            machine could test, not what the backend is theoretically capable of.
          </li>
          <li>
            <strong>The dataset is only as good as the contributions.</strong> v0.1 ships seeded
            from one machine. The whole point of the submission flow is that this grows past that.
          </li>
        </ul>
      </Section>

      <Section title="Run on edge devices (preview)">
        <p>
          The harness is a static SPA — it runs on anything that runs Chromium. That means
          embedded shells (Tauri, Electron, CEF, kiosk Chromium) on Raspberry Pi, Jetson, Coral,
          and smart displays can host a Web AI Bench window and submit results to the same
          dataset.
        </p>
        <p className="mt-3 text-xs">
          A first-class IoT runner with auto-submission is the v0.2 milestone. The minimum
          today is a Tauri config that points at this URL:
        </p>
        <pre
          className="text-[10px] leading-tight font-mono p-4 mt-2 rounded overflow-x-auto"
          style={{
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
          }}
        >
{`# tauri.conf.json
{
  "tauri": {
    "windows": [{
      "title": "Web AI Bench",
      "url": "https://bench.ondeviceml.space",
      "width": 1280,
      "height": 800,
      "fullscreen": false
    }]
  }
}`}
        </pre>
      </Section>

      <Section title="Roadmap">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><strong>v0.2</strong> — Tauri-shell edge runner with auto-submission</li>
          <li><strong>v0.3</strong> — GitHub Action that runs the harness in CI on Transformers.js PRs</li>
          <li><strong>v0.4</strong> — Hugging Face Space mirror so model cards can link to the matrix</li>
          <li><strong>v0.5</strong> — Warm-load tracking, repeat-run sample size as a knob</li>
        </ul>
      </Section>

      <Section title="Credits">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <a href="https://github.com/xenova" target="_blank" rel="noopener noreferrer" className="underline">
              Joshua Lochner / Xenova
            </a>{" "}
            — Transformers.js
          </li>
          <li>
            <a href="https://github.com/huningxin" target="_blank" rel="noopener noreferrer" className="underline">
              Ningxin Hu / Intel
            </a>{" "}
            — WebNN spec
          </li>
          <li>
            <a href="https://github.com/microsoft/webnn-developer-preview" target="_blank" rel="noopener noreferrer" className="underline">
              Microsoft WebNN team
            </a>{" "}
            — DirectML EP and the developer preview demos
          </li>
        </ul>
      </Section>

      <div
        className="rounded-xl p-4 text-xs text-center"
        style={{
          backgroundColor: "var(--color-surface-container)",
          color: "var(--color-outline)",
        }}
      >
        Open source under Apache 2.0 ·{" "}
        <a href="https://github.com/abhid1234/web-ai-bench" target="_blank" rel="noopener noreferrer" className="underline">
          github.com/abhid1234/web-ai-bench
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-outline-variant)",
      }}
    >
      <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-on-surface)" }}>
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {children}
      </div>
    </section>
  );
}
