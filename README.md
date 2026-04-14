# Web AI Bench

> The missing public benchmark and compatibility matrix for **WebNN**, **WebGPU**, and **WASM** running [Transformers.js](https://github.com/huggingface/transformers.js) models. Runs in any browser. No install.

[**bench.ondeviceml.space**](https://bench.ondeviceml.space)

## Why this exists

Developers picking a backend for in-browser ML have nothing to point at. The Transformers.js docs don't mention WebNN. The WebNN spec doesn't tell you which models work. Microsoft's WebNN Developer Preview ships 4 demos but no comparison. There is no public, apples-to-apples latency table for WebNN vs WebGPU vs WASM.

Web AI Bench is the missing piece. It runs the same model across every backend the visitor's browser supports, captures load time, p50/p95 inference latency, memory delta, and the *exact* error message when a backend fails — and lets anyone submit results from their own machine.

## What's in v0.1

- **Live Bench** (`/`) — pick a model, run it across all available backends, see the side-by-side
- **Compatibility Matrix** (`/matrix`) — filterable grid of every (model × backend) cell with status, latency, and error logs
- **Model Catalog** (`/models`) — 12 hand-curated Transformers.js models with metadata, `freeDimensionOverrides`, known issues
- **About** (`/about`) — methodology, architecture, IoT preview, contribution flow

## Stack

- Vite 6 + React 19 + TypeScript + Tailwind 4
- React Router 7
- Transformers.js loaded dynamically from CDN — never bundled
- IndexedDB for local result persistence
- Static `data/runs.json` checked into the repo, merged via PR

No backend. No API routes. The whole thing is a static SPA.

## Run locally

```bash
npm install
npm run dev
```

## Contribute a benchmark run

1. Open [bench.ondeviceml.space](https://bench.ondeviceml.space) in a browser that supports the backend you care about
2. Pick a model, click **Run All Backends**
3. Click **Submit my run** — opens a prefilled GitHub Issue
4. Maintainer merges to `data/runs.json`

## Roadmap

- v0.2 — Tauri-shell edge runner (Raspberry Pi 5, Jetson, Coral)
- v0.3 — GitHub Action that runs the harness in CI on Transformers.js PRs
- v0.4 — Hugging Face Space mirror

## Credits

- [Joshua Lochner / Xenova](https://github.com/xenova) — Transformers.js
- [Ningxin Hu / Intel](https://github.com/huningxin) — WebNN spec
- [Microsoft WebNN team](https://github.com/microsoft/webnn-developer-preview) — DirectML EP

## License

Apache 2.0
