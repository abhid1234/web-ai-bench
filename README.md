# Web AI Bench

> A 350-million-parameter model is 1.4 gigabytes. No browser will download that. No NPU will accept that. No phone has the memory for that. And yet in-browser AI demos that are starting to feel actually good — live caption, on-device translation, in-page semantic search — are running models that size and bigger.

**Web AI Bench** is the curriculum + benchmark that explains how. Seven short lessons that teach in-browser AI through working labs you can run on your device, in your browser, right now.

→ [**bench.ondeviceml.space**](https://bench.ondeviceml.space)
→ [**Companion blog post**](https://abhid.substack.com/p/how-to-fit-a-35-billion-parameter) — long-form essay on the quantization story
→ [**github.com/abhid1234/web-ai-bench**](https://github.com/abhid1234/web-ai-bench) — this repo

---

## What's here

A 7-lesson curriculum, each with prose + an interactive lab embedded inside.

| # | Lesson | Lab |
|---|---|---|
| 0 | **Why on-device AI** — privacy, latency, cost, offline | LiveDemo · 23 MB embedder running across every backend on page load |
| 1 | **Three browser backends** — WebNN, WebGPU, WASM | LiveDemo with model picker (6 reliable text models) |
| 2 | **NPUs and where they live** — Hexagon, ANE, Tensor TPU, MediaTek APU | NPUDetectionLab · probes `navigator.ml.createContext` |
| 3 | **Picking a model** — task, size, dtype, format | ModelCatalogLab · 12 hand-curated Transformers.js models |
| 4 | **The compatibility matrix** — every model × every backend | MatrixLab · filterable grid, click cells for full run records |
| 5 | **Run your own bench** — pick anything, contribute results | BenchLab · runs across all available backends, submits via prefilled GitHub issue |
| 6 | **Quantization** — fp32 → fp16 → int8 → int4 | QuantizationLab · estimated parameter count + animated bars showing size at each precision |

The curriculum is designed for mobile reading — bigger body type, scannable card grids, skip-to-lab pill on every page, reading times in every header. Pull it up on your phone.

## Why this exists

Developers picking a backend for in-browser ML have nothing to point at. The Transformers.js docs don't mention WebNN. The WebNN spec doesn't tell you which models work. There is no public, apples-to-apples latency table for WebNN vs WebGPU vs WASM.

Web AI Bench is the missing piece. It runs the same model across every backend the visitor's browser supports, captures load time, p50/p95 inference latency, memory delta, and the *exact* error message when a backend fails — and lets anyone submit results from their own device.

## Stack

- Vite 6 + React 19 + TypeScript + Tailwind 4
- React Router 7, lazy-loaded routes
- Transformers.js loaded dynamically from CDN — never bundled
- IndexedDB for local result persistence
- Static `data/runs.json` checked into the repo, merged via PR

No backend. No API routes. The whole thing is a static SPA hosted on Vercel.

## Run locally

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`. WebNN is gated behind a Chrome flag (`chrome://flags/#web-machine-learning-neural-network`) on most platforms; WebGPU works out of the box on Chrome 113+; WASM works everywhere.

## Contribute a benchmark run

1. Open [bench.ondeviceml.space/learn/run](https://bench.ondeviceml.space/learn/run) in any browser
2. Pick a model, click **Run All Backends**
3. When it finishes, click **Submit my run** — opens a prefilled GitHub Issue with the run JSON
4. Maintainer reviews and merges good submissions to `data/runs.json`
5. Your numbers start appearing on every visitor's matrix

The `data/runs.json` file is the source of truth for the public matrix. PRs that add real device data are always welcome.

## Roadmap

- v0.2 — Tauri-shell edge runner (Raspberry Pi 5, Jetson, Coral)
- v0.3 — GitHub Action that runs the harness in CI on Transformers.js PRs
- v0.4 — Hugging Face Space mirror

## Layout

```
src/
  routes/
    CurriculumIndex.tsx         # /
    lessons/
      Lesson{0Why,1Backends,2NPU,3Models,4Matrix,5Run,6Quantization}.tsx
  components/
    LessonShell.tsx             # shared lesson chrome (header, prose, callout, card grid, lab anchor, prev/next)
    LiveDemo.tsx                # auto-running hero demo on Lessons 0 + 1
    Sidebar.tsx
    Layout.tsx                  # responsive shell with mobile header
    labs/
      BenchLab.tsx              # the main harness — runs one model across all backends
      MatrixLab.tsx             # cross-device compatibility grid
      ModelCatalogLab.tsx       # the 12-model catalog
      NPUDetectionLab.tsx       # WebNN device probe
      QuantizationLab.tsx       # fp32 → int4 size visualizer
  lib/
    catalog.ts                  # MODELS array
    harness.ts                  # runAllBackends async generator
    persistence.ts              # IndexedDB read/write
    device.ts                   # detectAvailableBackends, detectWebNNDevice
    lessons.ts                  # LESSONS metadata + helpers
data/
  runs.json                     # seeded benchmark dataset (PR-merged)
```

## Credits

- [Joshua Lochner / Xenova](https://github.com/xenova) — Transformers.js
- [Ningxin Hu / Intel](https://github.com/huningxin) — WebNN spec
- [Microsoft WebNN team](https://github.com/microsoft/webnn-developer-preview) — DirectML EP
- The [mni-ml](https://mni-ml.github.io/) curriculum — visual + structural inspiration

## License

Apache 2.0
